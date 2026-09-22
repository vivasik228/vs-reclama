import ru from './vendor/intl-tel-input/js/ru.js';

const phone = document.querySelector('.application-form input[type="tel"], .catalog-request__form input[name="phone"]');

if (phone && window.intlTelInput) {
  const form = phone.form;
  const error = document.createElement('span');
  error.className = 'phone-error';
  error.id = 'phone-error';
  error.setAttribute('aria-live', 'polite');
  phone.closest('label').append(error);
  phone.setAttribute('aria-describedby', error.id);

  const iti = window.intlTelInput(phone, {
    initialCountry: 'ru',
    countryOrder: ['ru', 'kz', 'by', 'uz', 'kg', 'am', 'az', 'ge'],
    countryNameLocale: 'ru',
    uiTranslations: ru,
    separateDialCode: true,
    strictMode: true,
    placeholderNumberPolicy: 'AGGRESSIVE',
    allowedNumberTypes: ['MOBILE', 'FIXED_LINE', 'FIXED_LINE_OR_MOBILE']
  });

  let ready = false;
  let touched = false;
  iti.promise.then(() => { ready = true; });

  const message = () => {
    if (!phone.value.trim()) return 'Введите номер телефона.';
    if (!ready) return 'Подождите, проверка номера загружается.';
    if (iti.isValidNumber()) return '';
    const reason = iti.getValidationError();
    if (reason === 'TOO_SHORT') return 'Номер слишком короткий для выбранной страны.';
    if (reason === 'TOO_LONG') return 'Номер слишком длинный для выбранной страны.';
    return 'Проверьте номер телефона для выбранной страны.';
  };
  const show = text => {
    error.textContent = text;
    phone.setCustomValidity(text);
    phone.setAttribute('aria-invalid', String(Boolean(text)));
  };

  phone.addEventListener('input', () => {
    touched = true;
    const filtered = phone.value.replace(/[^+\d()\s-]/g, '');
    if (filtered !== phone.value) {
      phone.value = filtered;
      show('В номере телефона можно вводить только цифры.');
    } else show('');
  });
  phone.addEventListener('blur', () => { touched = true; show(message()); });
  phone.addEventListener('invalid', () => { touched = true; show(message()); });
  phone.addEventListener('countrychange', () => {
    if (touched && phone.value.trim()) show(message());
    else show('');
  });
  phone.addEventListener('strict:reject', () => {
    touched = true;
    show('В номере телефона можно вводить только цифры.');
  });

  form.addEventListener('submit', event => {
    const text = message();
    show(text);
    if (text) {
      event.preventDefault();
      event.stopImmediatePropagation();
      phone.reportValidity();
      phone.focus();
    }
  }, true);
  form.addEventListener('formdata', event => {
    if (ready && iti.isValidNumber()) {
      event.formData.set(phone.name, iti.getNumber());
      event.formData.set('Страна телефона', iti.getSelectedCountry()?.name || '');
    }
  });
}
