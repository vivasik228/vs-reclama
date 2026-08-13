document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('[data-sign-grid]');
  if (!grid) return;

  const pages = [
    { section: 'Запрещающие знаки', description: 'Красные знаки запрета по ГОСТ.', codes: 'P01 - P07' },
    { codes: 'P08 - P14' }, { codes: 'P15 - P21' },
    { section: 'Знаки пожарной безопасности', description: 'Средства пожаротушения и направления к ним.', codes: 'P22 - P23 · F01 - F04' },
    { codes: 'F04-01 - F12' },
    { section: 'Предупреждающие знаки', description: 'Жёлтые знаки опасности и предупреждения.', codes: 'W01 - W08' },
    { codes: 'W09 - W16' }, { codes: 'W17 - W24' }, { codes: 'W25 - W30 · M01 - M02' },
    { section: 'Предписывающие и эвакуационные знаки', description: 'Обязательные действия и направления эвакуации.', codes: 'M03 - M15 · E01' },
    { codes: 'M16 - M20' }, { codes: 'E02 - E13' }, { codes: 'E14 - E23' },
    { section: 'Медицинские, указательные и электротехнические знаки', description: 'Первая помощь, сервисные и электротехнические обозначения.', codes: 'E024 · E025 · D01 - D03 · W08 · ЗП-30' },
    { codes: 'E01 - E04 · E11 - E13 · EC01 - EC04' },
    { section: 'Готовые знаки и плакаты', description: 'Текстовые таблички и плакаты для рабочих зон.', codes: 'ЗП-01 - ЗП-17' },
    { codes: 'ЗП-18 - ЗП-29 · типоразмеры' }
  ];

  pages.forEach((item, index) => {
    const page = index + 1;
    if (item.section) {
      const section = document.createElement('div');
      section.className = 'poster-section';
      section.innerHTML = `<div class="poster-section__mark"></div><div><span>Раздел каталога</span><h3>${item.section}</h3><p>${item.description}</p></div><div class="poster-section__range">Страницы ${page}${pages.slice(index + 1).findIndex(next => next.section) >= 0 ? `-${page + pages.slice(index + 1).findIndex(next => next.section)}` : `-${pages.length}`}</div>`;
      grid.append(section);
    }
    const card = document.createElement('article');
    card.className = 'poster-card';
    card.innerHTML = `<button class="poster-card__preview" type="button" aria-label="Открыть страницу ${page}"><img src="assets/znaki/catalog-${String(page).padStart(2, '0')}.webp" alt="Каталог знаков безопасности, страница ${page}" loading="lazy"></button><div class="poster-card__number"><div class="poster-card__page"><span>Страница</span><strong>${page}</strong></div><div class="poster-card__codes"><span>Коды знаков</span><b>${item.codes}</b></div></div>`;
    card.querySelector('button').addEventListener('click', () => openViewer(index));
    grid.append(card);
  });

  const viewer = document.querySelector('[data-sign-viewer]');
  const viewerImage = viewer.querySelector('img');
  const viewerTitle = viewer.querySelector('[data-sign-viewer-title]');
  let current = 0;
  function show(index) {
    current = (index + pages.length) % pages.length;
    viewerImage.src = `assets/znaki/catalog-${String(current + 1).padStart(2, '0')}.webp`;
    viewerImage.alt = `Каталог знаков безопасности, страница ${current + 1}`;
    viewerTitle.textContent = `Страница ${current + 1} из ${pages.length} · ${pages[current].codes}`;
  }
  function openViewer(index) { show(index); viewer.classList.add('is-open'); viewer.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function closeViewer() { viewer.classList.remove('is-open'); viewer.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  viewer.querySelector('[data-sign-viewer-close]').addEventListener('click', closeViewer);
  viewer.querySelector('[data-sign-viewer-prev]').addEventListener('click', () => show(current - 1));
  viewer.querySelector('[data-sign-viewer-next]').addEventListener('click', () => show(current + 1));
  viewer.addEventListener('click', event => { if (event.target === viewer) closeViewer(); });
  document.addEventListener('keydown', event => { if (!viewer.classList.contains('is-open')) return; if (event.key === 'Escape') closeViewer(); if (event.key === 'ArrowLeft') show(current - 1); if (event.key === 'ArrowRight') show(current + 1); });
});
