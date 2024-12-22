// Обработчик для страницы Конструктор уровня (главное меню) - файл: constructor.html

document.getElementById('btn-constructor-create')!.addEventListener('click', () => {
    window.open('../../pages/constructor/create.html', '_self');
});

document.getElementById('btn-constructor-edit')!.addEventListener('click', () => {
    window.open('../../pages/file-choose.html', '_self');
});
