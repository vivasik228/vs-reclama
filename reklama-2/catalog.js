(() => {
  const codes = ["","1.1 1.2","1.3 1.4 1.5","1.6 1.7","1.8 1.9 1.10 1.11","2.1 2.2","2.3 2.4","2.5 2.6","3.1 3.2 3.3","3.4 3.5 3.6 3.7","4.1 4.2 4.3","4.4 4.5","5.1 5.2 5.3 5.4","5.5 5.6 5.7 5.8","5.9 5.10 5.11 5.12","5.13 5.14","5.15 5.16","5.17 6.1 6.2","6.3 6.4","6.5 6.6 6.7 6.8","6.9 6.10 7.1 7.2","7.3 7.4 7.5 8.1","8.2 8.3 8.4 8.5","8.6 8.7 8.8 9.1","9.2 9.3 9.4 10.1","10.2 10.3 10.4 10.5","11.1 11.2 11.3 11.4","11.5 11.6 11.7 11.8","11.9 11.10 11.11 11.12","11.13 11.14 12.1 12.2","12.3 12.4 12.5 12.6","12.7 12.8 12.9 13.1","13.2 13.3 13.4 13.5","13.6 14.1 14.2 14.3","14.4 14.5 14.6 14.7","14.8 15.1 15.2 15.3","15.4 15.5 16.1 16.2","16.3 16.4 16.5","16.6 17.1 17.2","18.1 18.2 18.3 18.4","18.5 18.6 18.7 19.1","19.2 19.3 19.4 19.5","19.6 19.7 20.1 20.2","20.3 20.4 20.5 20.6","20.7 20.8 20.9 20.10","20.11 20.12 21.1","21.2 22.1 22.2","22.3 22.4 22.5 22.6","23.1 23.2 23.3 23.4","23.5 23.6 23.7","23.8 23.9 23.10 23.11","24.1 24.2","24.3 25.1 25.2","25.3 25.4 25.5 25.6","25.7 25.8 25.9 25.10","25.11 25.12 25.13 26.1","26.2 26.3","28.1 28.2 28.3","28.4 29.1","29.2 29.3","30.1 30.2 30.3 31.1","31.2 31.3 31.4 31.5","31.6 31.7","31.8 31.9","31.10 32.1 32.2","33.1 33.2",""];
  const grid = document.querySelector('[data-poster-grid]');
  if (!grid) return;
  const servicePages = new Set([1, 67]);
  const pageLabel = n => n === 1 ? 'Содержание каталога' : n === 67 ? 'Анкета-заявка' : `Страница ${n}`;
  grid.innerHTML = codes.map((pageCodes, i) => {
    const n = i + 1;
    const meta = pageCodes ? `Коды плакатов: ${pageCodes}` : (n === 1 ? 'Быстрый указатель по всему каталогу' : 'Форма для оформления заказа');
    return `<article class="poster-card${servicePages.has(n) ? ' poster-card--service' : ''}" data-page="${n}" data-search="${n} ${pageCodes}">
      <button class="poster-card__preview" type="button" aria-label="Открыть ${pageLabel(n)} крупно"><img src="assets/plakaty/catalog-${String(n).padStart(2,'0')}.webp" alt="${pageLabel(n)}" loading="lazy" decoding="async"></button>
      <div class="poster-card__body"><div class="poster-card__meta"><span class="poster-card__page">${pageLabel(n)}</span><span class="poster-card__zoom">Увеличить</span></div><p class="poster-card__codes">${meta}</p></div>
    </article>`;
  }).join('');
  const cards = [...grid.querySelectorAll('.poster-card')];
  const search = document.querySelector('[data-poster-search]');
  const empty = document.querySelector('[data-poster-empty]');
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase().replace(',', '.');
    let shown = 0;
    cards.forEach(card => { const ok = !q || card.dataset.search.split(/\s+/).some(v => v === q) || card.dataset.search.includes(q); card.hidden = !ok; if (ok) shown++; });
    empty.classList.toggle('is-visible', shown === 0);
  });
  const chosen = new Set();
  const codeInput = document.querySelector('[data-code-input]');
  const addCode = document.querySelector('[data-code-add]');
  const selection = document.querySelector('[data-poster-selection]');
  const updateSelection = () => {
    const list = [...chosen];
    selection.textContent = list.length ? `Оформить заявку: ${list.join(', ')}` : 'Сначала добавьте код плаката';
    selection.setAttribute('aria-disabled', list.length ? 'false' : 'true');
    selection.href = list.length ? `mailto:v-s-reklama@mail.ru?subject=${encodeURIComponent('Заявка на плакаты по охране труда')}&body=${encodeURIComponent('Здравствуйте! Интересуют плакаты с кодами: ' + list.join(', ') + '.\n\nУкажите, пожалуйста, тираж и материал.')}` : '#';
  };
  addCode.addEventListener('click', () => { const value = codeInput.value.trim().replace(',', '.'); if (value) { chosen.add(value); codeInput.value = ''; updateSelection(); } });
  codeInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addCode.click(); } });
  const viewer = document.querySelector('[data-poster-viewer]');
  const viewerImg = viewer.querySelector('img');
  const viewerTitle = viewer.querySelector('[data-viewer-title]');
  const viewerCodes = viewer.querySelector('[data-viewer-codes]');
  let current = 0;
  const show = index => { current = (index + cards.length) % cards.length; const n = current + 1; viewerImg.src = `assets/plakaty/catalog-${String(n).padStart(2,'0')}.webp`; viewerImg.alt = pageLabel(n); viewerTitle.textContent = pageLabel(n); viewerCodes.textContent = codes[current] ? `Коды: ${codes[current]}` : ''; };
  cards.forEach((card, index) => card.querySelector('button').addEventListener('click', () => { show(index); viewer.classList.add('is-open'); viewer.setAttribute('aria-hidden','false'); document.body.classList.add('poster-viewer-open'); viewer.querySelector('[data-viewer-close]').focus(); }));
  const close = () => { viewer.classList.remove('is-open'); viewer.setAttribute('aria-hidden','true'); document.body.classList.remove('poster-viewer-open'); viewerImg.removeAttribute('src'); };
  viewer.querySelector('[data-viewer-close]').addEventListener('click', close);
  viewer.querySelector('[data-viewer-prev]').addEventListener('click', () => show(current - 1));
  viewer.querySelector('[data-viewer-next]').addEventListener('click', () => show(current + 1));
  viewer.addEventListener('click', e => { if (e.target === viewer) close(); });
  document.addEventListener('keydown', e => { if (!viewer.classList.contains('is-open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(current - 1); if (e.key === 'ArrowRight') show(current + 1); });
  updateSelection();
})();
