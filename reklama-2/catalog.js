(() => {
  const grid = document.querySelector('[data-poster-grid]');
  if (!grid) return;
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
      <div class="poster-card__number"><span>Страница</span><strong>${page}</strong></div>
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
