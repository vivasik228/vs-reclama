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

  document.querySelectorAll('.application-form input[type="tel"], .catalog-request__form input[name="phone"]').forEach(phone=>{
    const error=document.createElement('span');
    error.className='phone-error';
    error.id='phone-error-'+Math.random().toString(36).slice(2);
    error.setAttribute('aria-live','polite');
    phone.closest('label').append(error);
    phone.setAttribute('aria-describedby',error.id);
    const message=()=>{
      if(!phone.value)return 'Укажите номер телефона.';
      if(phone.value.length!==11)return 'Введите 11 цифр номера телефона.';
      if(!/^[78]/.test(phone.value))return 'Номер должен начинаться с 7 или 8.';
      return '';
    };
    const show=(text)=>{error.textContent=text;phone.setCustomValidity(text);phone.setAttribute('aria-invalid',String(Boolean(text)));};
    phone.addEventListener('beforeinput',event=>{
      if(event.data && /\D/.test(event.data)){
        event.preventDefault();
        show('В номере телефона можно вводить только цифры.');
      }
    });
    phone.addEventListener('input',()=>{
      const cleaned=phone.value.replace(/\D/g,'').slice(0,11);
      if(phone.value!==cleaned){phone.value=cleaned;show('В номере телефона можно вводить только цифры.');}
      else show(phone.value.length===11?message():'');
    });
    phone.addEventListener('blur',()=>show(message()));
    phone.addEventListener('invalid',()=>show(message()));
  });
})();
