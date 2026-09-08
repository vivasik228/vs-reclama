(() => {
  'use strict';
  const base = new URL('.', document.currentScript.src);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const style = document.createElement('style');
  style.textContent = `
    .page-loader{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:radial-gradient(ellipse 32% 70% at 0% 50%,rgba(255,109,0,.19),rgba(255,109,0,.055) 42%,transparent 100%),radial-gradient(ellipse 32% 70% at 100% 50%,rgba(255,109,0,.19),rgba(255,109,0,.055) 42%,transparent 100%),#fffdfc;opacity:1;transition:opacity .2s ease;pointer-events:all}
    .page-loader[hidden]{display:none}
    .page-loader.is-done{opacity:0;pointer-events:none}
    .page-loader__inner{width:min(280px,72vw);text-align:center}
    .page-loader__image{display:block;width:100%;height:auto;border:0;border-radius:0;box-shadow:none;background:transparent;mix-blend-mode:darken}
    .page-loader__progress{position:relative;height:8px;width:72%;margin:8px auto 0;overflow:hidden;border-radius:9999px;background:#fff0e2}
    .page-loader__indicator{height:100%;width:45%;border-radius:inherit;background:#ff7900;animation:page-loading 1.15s ease-in-out infinite}
    @keyframes page-loading{from{transform:translateX(-110%)}to{transform:translateX(325%)}}
    @media(prefers-reduced-motion:reduce){.page-loader{transition:none}.page-loader__indicator{animation:none;width:100%;opacity:.6}}
  `;
  document.head.append(style);
  const overlay = document.createElement('div');
  overlay.className = 'page-loader';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-label', 'Загрузка страницы');
  const inner = document.createElement('div');
  inner.className = 'page-loader__inner';
  const img = new Image(480, 400);
  img.className = 'page-loader__image';
  img.alt = '';
  img.src = new URL(reduced ? 'assets/thermopress-loading.png?v=warm-aura' : 'assets/thermopress-loading.gif?v=warm-aura', base).href;
  const progress = document.createElement('div');
  progress.className = 'page-loader__progress';
  progress.setAttribute('role', 'progressbar');
  progress.setAttribute('aria-label', 'Загрузка');
  const indicator = document.createElement('div');
  indicator.className = 'page-loader__indicator';
  progress.append(indicator);
  inner.append(img, progress);
  overlay.append(inner);
  const minimumDisplay = 1000;
  let fallback, fade, hold;
  let shownAt = Date.now();
  let pageReady = false;
  function mount() {
    if (!overlay.isConnected && document.body) document.body.append(overlay);
  }
  function hide() {
    clearTimeout(fallback);
    clearTimeout(hold);
    overlay.classList.add('is-done');
    fade = setTimeout(() => { overlay.hidden = true; }, 220);
  }
  function finishWhenReady() {
    pageReady = true;
    clearTimeout(hold);
    hold = setTimeout(hide, Math.max(0, minimumDisplay - (Date.now() - shownAt)));
  }
  img.addEventListener('load', () => {
    shownAt = Date.now();
    if (pageReady && !overlay.hidden) finishWhenReady();
  }, {once:true});
  function show() {
    mount();
    clearTimeout(fade);
    clearTimeout(fallback);
    clearTimeout(hold);
    shownAt = Date.now();
    overlay.hidden = false;
    overlay.classList.remove('is-done');
    fallback = setTimeout(hide, 8000);
  }
  // Show as soon as the parser creates the body; no HTML without JS is hidden.
  const observer = new MutationObserver(() => {
    if (document.body) { mount(); observer.disconnect(); }
  });
  observer.observe(document.documentElement, {childList:true});
  mount();
  fallback = setTimeout(hide, 8000);
  window.addEventListener('load', finishWhenReady, {once:true});
  window.addEventListener('pageshow', event => { if (event.persisted) hide(); });
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    if (!url.pathname.endsWith('.html') && !url.pathname.endsWith('/')) return;
    show();
  });
})();
