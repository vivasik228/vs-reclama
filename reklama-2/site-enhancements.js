(() => {
  'use strict';
  // No personal data is stored in the browser or sent to third-party services.
  window.prepareSiteRequest = (body, subject, form) => {
    let result = form.querySelector('.request-result');
    if (!result) {
      result = document.createElement('section');
      result.className = 'request-result';
      result.setAttribute('aria-label', 'Подготовленная заявка');
      form.append(result);
    }
    result.replaceChildren();
    const note = document.createElement('p');
    note.setAttribute('role', 'status');
    note.textContent = 'Заявка подготовлена, но ещё не отправлена. Откройте письмо и отправьте его в своей почте либо скопируйте текст и отправьте на v-s-reklama@mail.ru.';
    const preview = document.createElement('textarea');
    preview.readOnly = true;
    preview.value = body;
    preview.setAttribute('aria-label', 'Текст заявки для копирования');
    preview.rows = 8;
    const mail = document.createElement('a');
    mail.className = 'btn btn--primary';
    mail.textContent = 'Открыть письмо';
    mail.href = `mailto:v-s-reklama@mail.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'btn';
    copy.textContent = 'Скопировать заявку';
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(body);
        note.textContent = 'Текст скопирован. Вставьте его в письмо на v-s-reklama@mail.ru и отправьте.';
      } catch {
        preview.focus(); preview.select();
        note.textContent = 'Скопируйте выделенный текст вручную и отправьте его на v-s-reklama@mail.ru.';
      }
    });
    const download = document.createElement('button');
    download.type = 'button'; download.className = 'btn'; download.textContent = 'Сохранить заявку';
    download.addEventListener('click', () => {
      const url = URL.createObjectURL(new Blob(['\ufeff' + body], {type:'text/plain;charset=utf-8'}));
      const a = document.createElement('a'); a.href = url; a.download = 'zayavka-vs-reklama.txt';
      a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    result.append(note, preview, mail, copy, download);
    result.tabIndex = -1; result.focus();
  };

  const application = document.querySelector('.application-form');
  if (application) {
    const params = new URLSearchParams(location.search);
    const work = (params.get('work') || '').slice(0, 300);
    const service = (params.get('service') || '').slice(0, 150);
    if (work) {
      const selected = document.createElement('div');
      selected.className = 'selected-work';
      const title = document.createElement('strong');
      title.textContent = 'Выбранный пример: ' + work;
      const detail = document.createElement('p'); detail.textContent = service;
      selected.append(title, detail);
      for (const [name, value] of [['Пример работы', work], ['Услуга', service]]) {
        const input = document.createElement('input'); input.type = 'hidden'; input.name = name; input.value = value;
        selected.append(input);
      }
      const source = params.get('source') || '';
      // Only allow a local HTML page, never an arbitrary URL from the query string.
      if (/^[a-z0-9-]+\.html$/.test(source)) {
        const back = document.createElement('a'); back.href = source; back.textContent = 'Вернуться к примерам →';
        selected.append(back);
        const input = document.createElement('input'); input.type = 'hidden'; input.name = 'Страница примера';
        input.value = new URL(source, location.href).href; selected.append(input);
      }
      application.prepend(selected);
      const description = application.querySelector('[name="Описание заказа"]');
      if (description && !description.value) description.value = 'Хочу заказать похожую работу: ' + work + '.\n';
    }
  }
  application?.addEventListener('submit', event => {
    event.preventDefault();
    if (!application.reportValidity()) return;
    const lines = [...new FormData(application)].map(([name, value]) => `${name}: ${String(value).trim()}`);
    window.prepareSiteRequest('ЗАЯВКА НА ЗАКАЗ\n\n' + lines.join('\n'), 'Заявка с сайта ВС-РЕКЛАМА', application);
  });

  const photos = [...document.querySelectorAll('img[data-full-src]')];
  const sections = [...document.querySelectorAll('.portfolio-section')];
  if (sections.length) {
    const groups = [
      ['all', 'Все работы', () => true],
      ['signs', 'Вывески', section => section.id.includes('vyveski')],
      ['stands', 'Стенды', section => section.id === 'works-stendy'],
      ['cars', 'Автомобили', section => section.id === 'works-dop-uslugi'],
      ['clothes', 'Логотипы на одежду', section => /termopechat|dtf-pechat|vyshivka/.test(section.id)],
      ['safety', 'Охрана труда', section => /plany-evakuacii|ohrana/.test(section.id)]
    ];
    const nav = document.querySelector('.portfolio-nav');
    const controls = document.createElement('div'); controls.className = 'portfolio-filters';
    controls.setAttribute('role', 'group'); controls.setAttribute('aria-label', 'Фильтр работ');
    const status = document.createElement('p'); status.className = 'portfolio-filter-status';
    status.setAttribute('role', 'status');
    const buttons = new Map();
    for (const [key, label, includes] of groups) {
      const count = sections.filter(includes).reduce((sum, section) => sum + section.querySelectorAll('.portfolio-card').length, 0);
      if (!count) continue;
      const button = document.createElement('button'); button.type = 'button';
      button.textContent = `${label} · ${count}`; button.dataset.filter = key;
      button.addEventListener('click', () => select(key, true));
      buttons.set(key, button); controls.append(button);
    }
    nav.replaceWith(controls, status);
    function select(key, updateUrl) {
      const group = groups.find(item => item[0] === key) || groups[0];
      let count = 0;
      sections.forEach(section => {
        section.hidden = !group[2](section);
        if (!section.hidden) count += section.querySelectorAll('.portfolio-card').length;
      });
      buttons.forEach((button, value) => button.setAttribute('aria-pressed', String(value === group[0])));
      status.textContent = `Показано работ: ${count} из ${photos.length}`;
      if (updateUrl) {
        const url = new URL(location.href);
        if (group[0] === 'all') url.searchParams.delete('category'); else url.searchParams.set('category', group[0]);
        url.hash = ''; history.pushState(null, '', url);
      }
    }
    const restore = () => {
      const section = sections.find(item => '#' + item.id === location.hash);
      const key = section ? groups.slice(1).find(group => group[2](section))?.[0] : new URLSearchParams(location.search).get('category');
      select(key, false);
    };
    restore(); window.addEventListener('popstate', restore); window.addEventListener('hashchange', restore);
  }
  const orderLinks = new Map();
  photos.forEach(photo => {
    const figure = photo.closest('figure');
    const caption = figure?.querySelector('figcaption');
    if (!caption) return;
    const title = figure.querySelector('h3')?.textContent.trim() || caption.textContent.trim() || photo.alt;
    const section = figure.closest('.portfolio-section, .logo-works__block');
    const service = section?.querySelector('h2')?.textContent.trim() || document.querySelector('h1')?.textContent.trim() || '';
    const source = figure.querySelector('figcaption a[href$=".html"]')?.getAttribute('href') || location.pathname.split('/').pop() || 'nashi-raboty.html';
    const query = new URLSearchParams({work:title, service, source});
    const link = document.createElement('a'); link.className = 'work-order-link';
    link.href = 'application.html?' + query; link.textContent = 'Заказать похожее →';
    caption.append(link); orderLinks.set(photo, link.href);
  });
  if (!photos.length || typeof HTMLDialogElement === 'undefined') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'photo-viewer';
  dialog.setAttribute('aria-label', 'Просмотр работ');
  dialog.innerHTML = '<button type="button" class="photo-viewer__close" aria-label="Закрыть фотографию">×</button><div class="photo-viewer__media"></div><p class="photo-viewer__caption" aria-live="polite"></p><div class="photo-viewer__controls"><button type="button" aria-label="Предыдущая фотография">←</button><button type="button" aria-label="Следующая фотография">→</button></div>';
  document.body.append(dialog);
  const media = dialog.querySelector('.photo-viewer__media');
  const caption = dialog.querySelector('.photo-viewer__caption');
  const order = document.createElement('a'); order.className = 'work-order-link photo-viewer__order';
  order.textContent = 'Заказать похожее →'; caption.after(order);
  let visiblePhotos = photos;
  let current = 0, previousFocus, oldOverflow;
  const show = index => {
    current = (index + visiblePhotos.length) % visiblePhotos.length;
    const source = visiblePhotos[current];
    media.replaceChildren();
    if (source.dataset.crop) {
      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('viewBox', source.dataset.crop);
      svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', source.alt);
      const image = document.createElementNS(ns, 'image');
      image.setAttribute('href', source.dataset.fullSrc);
      image.setAttribute('width', source.dataset.originalWidth);
      image.setAttribute('height', source.dataset.originalHeight);
      svg.append(image); media.append(svg);
    } else {
      const image = new Image(); image.alt = source.alt; image.src = source.dataset.fullSrc;
      image.addEventListener('error', () => { caption.textContent = 'Не удалось загрузить оригинал. Попробуйте открыть фотографию позже.'; });
      media.append(image);
    }
    caption.textContent = `${current + 1} / ${visiblePhotos.length} — ${source.alt}`;
    order.hidden = !orderLinks.has(source);
    if (orderLinks.has(source)) order.href = orderLinks.get(source);
  };
  const close = () => dialog.close();
  dialog.querySelector('.photo-viewer__close').addEventListener('click', close);
  dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = oldOverflow;
    media.replaceChildren(); previousFocus?.focus();
  });
  const [prev, next] = dialog.querySelectorAll('.photo-viewer__controls button');
  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  photos.forEach((photo, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'photo-open';
    button.setAttribute('aria-label', `Увеличить: ${photo.alt}`);
    // Existing links already provide a no-JavaScript route to the full image.
    const link = photo.closest('a');
    if (link) { link.addEventListener('click', event => { event.preventDefault(); open(index, link); }); }
    else { photo.before(button); button.append(photo); button.addEventListener('click', () => open(index, button)); }
  });
  function open(index, trigger) {
    previousFocus = trigger; oldOverflow = document.body.style.overflow;
    visiblePhotos = photos.filter(photo => !photo.closest('[hidden]'));
    show(visiblePhotos.indexOf(photos[index])); dialog.showModal(); document.body.style.overflow = 'hidden';
  }
})();
