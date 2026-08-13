document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[data-catalog-request]');
  if (!form) return;

  const rows = form.querySelector('[data-poster-rows]');
  const addButton = form.querySelector('[data-add-poster]');

  const addRow = () => {
    const number = rows.children.length + 1;
    const row = document.createElement('div');
    row.className = 'catalog-request__row';
    row.innerHTML = `
      <span class="catalog-request__row-number">${number}</span>
      <label><span>№ плаката</span><input name="poster_number" type="text" placeholder="Например, 1.1" /></label>
      <label><span>Размер</span><input name="poster_size" type="text" placeholder="A3, A2…" /></label>
      <label><span>Количество</span><input name="poster_quantity" type="number" min="1" inputmode="numeric" placeholder="1" /></label>
      <label><span>Вид материала</span><input name="poster_material" type="text" placeholder="Бумага, пластик…" /></label>
      <button class="catalog-request__remove" type="button" aria-label="Удалить строку">×</button>`;
    row.querySelector('.catalog-request__remove').addEventListener('click', () => {
      row.remove();
      [...rows.children].forEach((item, index) => { item.querySelector('.catalog-request__row-number').textContent = index + 1; });
    });
    rows.append(row);
  };

  addButton.addEventListener('click', addRow);
  for (let index = 0; index < 4; index += 1) addRow();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const posters = [...rows.querySelectorAll('.catalog-request__row')]
      .map((row) => [...row.querySelectorAll('input')].map((input) => input.value.trim()))
      .filter((values) => values.some(Boolean));
    const lines = [
      'АНКЕТА-ЗАЯВКА НА ПОЛУЧЕНИЕ ПЛАКАТОВ ПО ТБ', '',
      `Контактное лицо: ${data.get('contact') || ''}`,
      `ФИО: ${data.get('full_name') || ''}`,
      `Должность: ${data.get('position') || ''}`,
      `Название организации: ${data.get('organization') || ''}`,
      `ИНН/КПП: ${data.get('inn_kpp') || ''}`,
      `Код города: ${data.get('city_code') || ''}`,
      `Телефон/факс: ${data.get('phone') || ''}`,
      `E-mail: ${data.get('email') || ''}`,
      `Почтовый адрес: ${data.get('postal_address') || ''}`,
      `Юридический адрес: ${data.get('legal_address') || ''}`, '',
      'ПЛАКАТЫ:',
      ...posters.map((values, index) => `${index + 1}. № ${values[0] || '—'}; размер: ${values[1] || '—'}; количество: ${values[2] || '—'}; материал: ${values[3] || '—'}`)
    ];
    const subject = `Заявка на плакаты по ТБ — ${data.get('organization') || data.get('full_name') || 'заказчик'}`;
    window.location.href = `mailto:v-s-reklama@mail.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  });
});
