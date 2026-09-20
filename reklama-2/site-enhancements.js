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
  application?.addEventListener('submit', event => {
    event.preventDefault();
    if (!application.reportValidity()) return;
    const lines = [...new FormData(application)].map(([name, value]) => `${name}: ${String(value).trim()}`);
    window.prepareSiteRequest('ЗАЯВКА НА ЗАКАЗ\n\n' + lines.join('\n'), 'Заявка с сайта ВС-РЕКЛАМА', application);
  });

  const photos = [...document.querySelectorAll('img[data-full-src]')];
  if (!photos.length || typeof HTMLDialogElement === 'undefined') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'photo-viewer';
  dialog.setAttribute('aria-label', 'Просмотр работ');
  dialog.innerHTML = '<button type="button" class="photo-viewer__close" aria-label="Закрыть фотографию">×</button><div class="photo-viewer__media"></div><p class="photo-viewer__caption" aria-live="polite"></p><div class="photo-viewer__controls"><button type="button" aria-label="Предыдущая фотография">←</button><button type="button" aria-label="Следующая фотография">→</button></div>';
  document.body.append(dialog);
  const media = dialog.querySelector('.photo-viewer__media');
  const caption = dialog.querySelector('.photo-viewer__caption');
  let current = 0, previousFocus, oldOverflow;
  const show = index => {
    current = (index + photos.length) % photos.length;
    const source = photos[current];
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
    caption.textContent = `${current + 1} / ${photos.length} — ${source.alt}`;
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
    show(index); dialog.showModal(); document.body.style.overflow = 'hidden';
  }
})();
