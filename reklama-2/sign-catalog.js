document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('[data-sign-grid]');
  if (!grid) return;

  const sections = [
    { title: 'Запрещающие знаки', description: 'Красные знаки запрета по ГОСТ.', items: [
      ['catalog-01.webp', '1', 'P01 - P07'], ['catalog-02.webp', '2', 'P08 - P14'], ['catalog-03.webp', '3', 'P15 - P21'], ['catalog-04-prohibition.webp', '4 · верхняя часть', 'P34 · P20'] ] },
    { title: 'Знаки пожарной безопасности', description: 'Средства пожаротушения и направления к ним.', items: [
      ['catalog-04-fire.webp', '4 · нижняя часть', 'F02 - F05 · F01-01'], ['catalog-05.webp', '5', 'F04-01 - F12'] ] },
    { title: 'Предупреждающие знаки', description: 'Жёлтые знаки опасности и предупреждения.', items: [
      ['catalog-06.webp', '6', 'W01 - W08'], ['catalog-07.webp', '7', 'W09 - W16'], ['catalog-08.webp', '8', 'W17 - W24'], ['catalog-09-warning.webp', '9 · верхняя часть', 'W26 - W30'] ] },
    { title: 'Предписывающие знаки', description: 'Синие знаки обязательных действий.', items: [
      ['catalog-09-mandatory.webp', '9 · нижняя часть', 'M01 - M02'], ['catalog-10-mandatory.webp', '10 · верхняя часть', 'M10 - M15'], ['catalog-11.webp', '11', 'M03 - M09'] ] },
    { title: 'Эвакуационные знаки', description: 'Направления движения, выходы и безопасные пути.', items: [
      ['catalog-10-evacuation.webp', '10 · нижняя часть', 'E01-01'], ['catalog-12.webp', '12', 'E02 - E13'], ['catalog-13.webp', '13', 'E14 - E22'], ['catalog-15-evacuation.webp', '15 · верхняя часть', 'E10 - E12 · E23'] ] },
    { title: 'Знаки медицинского и санитарного назначения', description: 'Первая помощь и медицинские пункты.', items: [
      ['catalog-15-medical.webp', '15 · нижняя часть', 'EC01 - EC04'], ['catalog-14-medical.webp', '14 · верхняя часть', 'EC05 - EC06'] ] },
    { title: 'Указательные знаки', description: 'Информационные обозначения бытовых и общественных зон.', items: [
      ['catalog-14-information.webp', '14 · средняя часть', 'D01 - D03'] ] },
    { title: 'Электротехнические знаки', description: 'Предупреждение о напряжении и обозначение заземления.', items: [
      ['catalog-14-electrical.webp', '14 · нижняя часть', 'W08 · ЗП-30 · 42/220/380 В'] ] },
    { title: 'Готовые знаки и плакаты', description: 'Текстовые таблички и плакаты для рабочих зон.', items: [
      ['catalog-16-prohibition.webp', '16 · верхняя часть', 'ЗП-05 · ЗП-06 · ЗП-08 · ЗП-11'], ['catalog-16-warning.webp', '16 · нижняя часть', 'ЗП-24 · ЗП-22 · ЗП-23 · ЗП-07 · ЗП-09 - ЗП-16'], ['catalog-17-signs.webp', '17 · верхняя часть', 'ЗП-17 - ЗП-29'], ['catalog-17-sizes.webp', '17 · нижняя часть', 'Типоразмеры 1 - 3'] ] }
  ];

  const pages = sections.flatMap(section => section.items.map(item => ({ image: item[0], page: item[1], codes: item[2], section: section.title })));
  let globalIndex = 0;
  sections.forEach(sectionData => {
    const start = globalIndex + 1;
    const end = globalIndex + sectionData.items.length;
    const section = document.createElement('div');
    section.className = 'poster-section';
    section.innerHTML = `<div class="poster-section__mark"></div><div><span>Раздел каталога</span><h3>${sectionData.title}</h3><p>${sectionData.description}</p></div><div class="poster-section__range">Листы ${start}-${end}</div>`;
    grid.append(section);

    sectionData.items.forEach(item => {
      const index = globalIndex;
      const card = document.createElement('article');
      card.className = 'poster-card';
      card.innerHTML = `<button class="poster-card__preview" type="button" aria-label="Открыть страницу ${item[1]}"><img src="assets/znaki/${item[0]}" alt="${sectionData.title}, страница ${item[1]}" loading="lazy"></button><div class="poster-card__number"><div class="poster-card__page"><span>Страница</span><strong>${item[1]}</strong></div><div class="poster-card__codes"><span>Коды знаков</span><b>${item[2]}</b></div></div>`;
      card.querySelector('button').addEventListener('click', () => openViewer(index));
      grid.append(card);
      globalIndex += 1;
    });
  });

  const viewer = document.querySelector('[data-sign-viewer]');
  const viewerImage = viewer.querySelector('img');
  const viewerTitle = viewer.querySelector('[data-sign-viewer-title]');
  let current = 0;
  function show(index) {
    current = (index + pages.length) % pages.length;
    const item = pages[current];
    viewerImage.src = `assets/znaki/${item.image}`;
    viewerImage.alt = `${item.section}, страница ${item.page}`;
    viewerTitle.textContent = `Страница ${item.page} · ${item.codes}`;
  }
  function openViewer(index) { show(index); viewer.classList.add('is-open'); viewer.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function closeViewer() { viewer.classList.remove('is-open'); viewer.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  viewer.querySelector('[data-sign-viewer-close]').addEventListener('click', closeViewer);
  viewer.querySelector('[data-sign-viewer-prev]').addEventListener('click', () => show(current - 1));
  viewer.querySelector('[data-sign-viewer-next]').addEventListener('click', () => show(current + 1));
  viewer.addEventListener('click', event => { if (event.target === viewer) closeViewer(); });
  document.addEventListener('keydown', event => { if (!viewer.classList.contains('is-open')) return; if (event.key === 'Escape') closeViewer(); if (event.key === 'ArrowLeft') show(current - 1); if (event.key === 'ArrowRight') show(current + 1); });
});
