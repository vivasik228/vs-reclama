document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-catalog-request]').forEach((form) => {
    const kind = form.dataset.requestKind || 'poster';
    const rows = form.querySelector('[data-request-rows], [data-poster-rows]');
    const addButton = form.querySelector('[data-add-item], [data-add-poster]');
    if (!rows || !addButton) return;

    const isSign = kind === 'sign';
    const itemName = isSign ? 'Код знака' : '№ плаката';

    const renumberRows = () => {
      [...rows.children].forEach((item, index) => {
        item.querySelector('.catalog-request__row-number').textContent = index + 1;
      });
    };

    const addRow = () => {
      const row = document.createElement('div');
      row.className = 'catalog-request__row';
      row.innerHTML = `
        <span class="catalog-request__row-number">${rows.children.length + 1}</span>
        <label><span>${itemName}</span><input name="item_code" type="text" placeholder="${isSign ? 'Например, W01' : 'Например, 1.1'}" /></label>
        <label><span>Размер</span><input name="item_size" type="text" placeholder="A3, A2…" /></label>
        <label><span>Количество</span><input name="item_quantity" type="number" min="1" inputmode="numeric" placeholder="1" /></label>
        <label><span>Вид материала</span><input name="item_material" type="text" placeholder="${isSign ? 'Плёнка, пластик…' : 'Бумага, пластик…'}" /></label>
        <button class="catalog-request__remove" type="button" aria-label="Удалить строку">×</button>`;
      row.querySelector('.catalog-request__remove').addEventListener('click', () => {
        row.remove();
        renumberRows();
      });
      rows.append(row);
    };

    addButton.addEventListener('click', addRow);
    for (let index = 0; index < 4; index += 1) addRow();

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const items = [...rows.querySelectorAll('.catalog-request__row')]
        .map((row) => [...row.querySelectorAll('input')].map((input) => input.value.trim()))
        .filter((values) => values.some(Boolean));
      const title = isSign ? 'ЗАЯВКА НА ПОЛУЧЕНИЕ ЗНАКОВ ПО ТБ' : 'АНКЕТА-ЗАЯВКА НА ПОЛУЧЕНИЕ ПЛАКАТОВ ПО ТБ';
      const lines = [
        title, '',
        `Контактное лицо: ${data.get('contact') || ''}`,
        ...(!isSign ? [`ФИО: ${data.get('full_name') || ''}`] : []),
        `Должность: ${data.get('position') || ''}`,
        `Название ${isSign ? 'компании' : 'организации'}: ${data.get('organization') || ''}`,
        ...(!isSign ? [`ИНН/КПП: ${data.get('inn_kpp') || ''}`, `Код города: ${data.get('city_code') || ''}`] : []),
        `Телефон${isSign ? '' : '/факс'}: ${data.get('phone') || ''}`,
        `E-mail: ${data.get('email') || ''}`,
        `Почтовый адрес: ${data.get('postal_address') || ''}`,
        ...(!isSign ? [`Юридический адрес: ${data.get('legal_address') || ''}`] : []), '',
        isSign ? 'ЗНАКИ:' : 'ПЛАКАТЫ:',
        ...items.map((values, index) => `${index + 1}. ${itemName}: ${values[0] || '—'}; размер: ${values[1] || '—'}; количество: ${values[2] || '—'}; материал: ${values[3] || '—'}`)
      ];
      const subject = `Заявка на ${isSign ? 'знаки' : 'плакаты'} по ТБ — ${data.get('organization') || data.get('contact') || 'заказчик'}`;
      window.location.href = `mailto:v-s-reklama@mail.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    });
  });
});
