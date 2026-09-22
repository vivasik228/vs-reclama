(() => {
  'use strict';
  const burger=document.querySelector('.burger');
  const menu=document.querySelector('.mobile-nav');
  const close=()=>{burger?.classList.remove('is-open');burger?.setAttribute('aria-expanded','false');menu?.classList.remove('is-open');document.body.style.overflow='';};
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&menu?.classList.contains('is-open')){close();burger?.focus();}
    if(event.key==='Escape')document.querySelectorAll('.nav-dropdown.is-open').forEach(el=>el.classList.remove('is-open'));
  });
  matchMedia('(max-width:900px)').addEventListener('change',event=>{if(!event.matches)close();});
  const groups={
    'naruzhnaya-reklama':[['Вывески','vyveski.html'],['Световые короба','svetovye-koroba.html'],['Стенды','stendy.html'],['Таблички','tablichki.html'],['Указатели','ukazateli.html'],['Дополнительные услуги','dop-uslugi.html'],['Монтаж','montazh.html'],['Наши работы','nashi-raboty-naruzhnaya.html']],
    'logotipy-odezhda':[['Термопечать','termopechat.html'],['DTF-печать','dtf-pechat.html'],['Вышивка','vyshivka.html'],['Каски и кепки','kaski-kepki.html'],['Наши работы','nashi-raboty-logotipy.html']],
    'ohrana-truda':[['Знаки безопасности','znaki-tb-perechen.html'],['Плакаты','plakaty-ohrana-perechen.html'],['Планы эвакуации','plany-evakuacii.html'],['Наши работы','nashi-raboty-ohrana.html']],
    'markirovka-trub':[['Ленты-маркеры','lenty-markery.html'],['Отсылка к ГОСТу','otssylka-k-gostu.html']]
  };
  const group=groups[document.body.dataset.page];
  if(group){const nav=document.createElement('nav');nav.className='related-directions';nav.setAttribute('aria-label','Услуги направления');for(const [name,href] of group){const a=document.createElement('a');a.href=href;a.textContent=name+' ↗';nav.append(a);}document.querySelector('.page-hero .container')?.append(nav);}

  const formGrid=document.querySelector('.application-form__grid');
  const phoneField=formGrid?.querySelector('.phone-field');
  if(phoneField){
    const desktopNext=phoneField.nextElementSibling;
    const mobile=matchMedia('(max-width:600px)');
    const positionPhone=()=>{
      if(mobile.matches)formGrid.append(phoneField);
      else formGrid.insertBefore(phoneField,desktopNext);
    };
    positionPhone();
    mobile.addEventListener('change',positionPhone);
  }
})();
