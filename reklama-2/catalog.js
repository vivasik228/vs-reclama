(() => {
  const grid = document.querySelector('[data-poster-grid]');
  if (!grid) return;
  const posterNumbers = ["1.1 1.2","1.3 1.4 1.5","1.6 1.7","1.8 1.9 1.10 1.11","2.1 2.2","2.3 2.4","2.5 2.6","3.1 3.2 3.3","3.4 3.5 3.6 3.7","4.1 4.2 4.3","4.4 4.5","5.1 5.2 5.3 5.4","5.5 5.6 5.7 5.8","5.9 5.10 5.11 5.12","5.13 5.14","5.15 5.16","5.17 6.1 6.2","6.3 6.4","6.5 6.6 6.7 6.8","6.9 6.10 7.1 7.2","7.3 7.4 7.5 8.1","8.2 8.3 8.4 8.5","8.6 8.7 8.8 9.1","9.2 9.3 9.4 10.1","10.2 10.3 10.4 10.5","11.1 11.2 11.3 11.4","11.5 11.6 11.7 11.8","11.9 11.10 11.11 11.12","11.13 11.14 12.1 12.2","12.3 12.4 12.5 12.6","12.7 12.8 12.9 13.1","13.2 13.3 13.4 13.5","13.6 14.1 14.2 14.3","14.4 14.5 14.6 14.7","14.8 15.1 15.2 15.3","15.4 15.5 16.1 16.2","16.3 16.4 16.5","16.6 17.1 17.2","18.1 18.2 18.3 18.4","18.5 18.6 18.7 19.1","19.2 19.3 19.4 19.5","19.6 19.7 20.1 20.2","20.3 20.4 20.5 20.6","20.7 20.8 20.9 20.10","20.11 20.12 21.1","21.2 22.1 22.2","22.3 22.4 22.5 22.6","23.1 23.2 23.3 23.4","23.5 23.6 23.7","23.8 23.9 23.10 23.11","24.1 24.2","24.3 25.1 25.2","25.3 25.4 25.5 25.6","25.7 25.8 25.9 25.10","25.11 25.12 25.13 26.1","26.2 26.3","28.1 28.2 28.3","28.4 29.1","29.2 29.3","30.1 30.2 30.3 31.1","31.2 31.3 31.4 31.5","31.6 31.7","31.8 31.9","31.10 32.1 32.2","33.1 33.2"];
  const categories = [
    ['Пожарная безопасность', 'Огнетушители, эвакуация, противопожарные действия', 1],
    ['Первая помощь', 'Первая помощь и действия при несчастных случаях', 5],
    ['Безопасность на транспорте', 'Автомобили, спецтехника и дорожное движение', 12],
    ['Подъёмные сооружения', 'Краны, строповка, склады и работы на высоте', 21],
    ['Сварочные работы', 'Сварка, сварочная дуга и сварочные соединения', 24],
    ['Газовое хозяйство', 'Газоопасные работы и обслуживание оборудования', 33],
    ['Строительные работы', 'Котлованы, леса, инструмент и производство', 39],
    ['Электробезопасность', 'Средства защиты и работа в электроустановках', 46],
    ['Общие правила и СИЗ', 'Средства защиты, знаки и производственная безопасность', 51],
    ['Обучающие плакаты', 'Инструктажи, детская безопасность и станочные работы', 57]
  ];
  const indexCard = `<article class="poster-index">
    <div class="poster-index__head"><span class="poster-index__eyebrow">Навигатор по каталогу</span><h3>Выберите нужную тему</h3><p>Нажмите на категорию — каталог сразу перенесёт вас к соответствующим плакатам.</p></div>
    <div class="poster-index__grid">${categories.map(([title, text, page]) => `<button type="button" class="poster-index__item" data-go-page="${page}"><span><strong>${title}</strong><small>${text}</small></span><span class="poster-index__arrow">→</span></button>`).join('')}</div>
  </article>`;
  const pageLabel = n => `Страница ${n}`;
  const sectionStarts = new Map(categories.map((category, index) => [category[2], { category, index }]));
  const pagesHtml = Array.from({ length: 65 }, (_, index) => {
    const page = index + 1;
    const assetPage = page + 1;
    const section = sectionStarts.get(page);
    let sectionHeader = '';
    if (section) {
      const [title, text] = section.category;
      const nextStart = categories[section.index + 1]?.[2] || 66;
      const endPage = nextStart - 1;
      sectionHeader = `<header class="poster-section" id="category-${page}">
        <div class="poster-section__mark" aria-hidden="true"></div>
        <div><span class="poster-section__eyebrow">Раздел каталога</span><h3>${title}</h3><p>${text}</p></div>
        <span class="poster-section__range">Страницы ${page}–${endPage}</span>
      </header>`;
    }
    return `${sectionHeader}<article class="poster-card" data-page="${page}">
      <button class="poster-card__preview" type="button" aria-label="Открыть ${pageLabel(page)} крупно"><img src="assets/plakaty/catalog-${String(assetPage).padStart(2,'0')}.webp?v=cropped-20260813" alt="${pageLabel(page)}" loading="lazy" decoding="async"></button>
      <div class="poster-card__number">
        <div class="poster-card__page"><span>Страница</span><strong>${page}</strong></div>
        <div class="poster-card__codes"><span>Номера плакатов</span><b>${posterNumbers[index].replaceAll(' ', ' · ')}</b></div>
      </div>
    </article>`;
  }).join('');
  grid.innerHTML = indexCard + pagesHtml;
  const cards = [...grid.querySelectorAll('.poster-card')];
  grid.querySelectorAll('[data-go-page]').forEach(button => button.addEventListener('click', () => {
    const target = grid.querySelector(`#category-${button.dataset.goPage}`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  const viewer = document.querySelector('[data-poster-viewer]');
  const viewerImg = viewer.querySelector('img');
  const viewerTitle = viewer.querySelector('[data-viewer-title]');
  let current = 0;
  const show = index => { current = index < 1 ? cards.length : index > cards.length ? 1 : index; const assetPage = current + 1; viewerImg.src = `assets/plakaty/catalog-${String(assetPage).padStart(2,'0')}.webp?v=cropped-20260813`; viewerImg.alt = pageLabel(current); viewerTitle.textContent = pageLabel(current); };
  cards.forEach((card, index) => card.querySelector('.poster-card__preview').addEventListener('click', () => { show(index + 1); viewer.classList.add('is-open'); viewer.setAttribute('aria-hidden','false'); document.body.classList.add('poster-viewer-open'); viewer.querySelector('[data-viewer-close]').focus(); }));
  const close = () => { viewer.classList.remove('is-open'); viewer.setAttribute('aria-hidden','true'); document.body.classList.remove('poster-viewer-open'); viewerImg.removeAttribute('src'); };
  viewer.querySelector('[data-viewer-close]').addEventListener('click', close);
  viewer.querySelector('[data-viewer-prev]').addEventListener('click', () => show(current - 1));
  viewer.querySelector('[data-viewer-next]').addEventListener('click', () => show(current + 1));
  viewer.addEventListener('click', e => { if (e.target === viewer) close(); });
  document.addEventListener('keydown', e => { if (!viewer.classList.contains('is-open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(current - 1); if (e.key === 'ArrowRight') show(current + 1); });
})();
