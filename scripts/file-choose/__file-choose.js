import { localStorageClear } from "../Classes/Helpers.js";

// Обработчик для страницы: Выбор уровня - файл: file-choose.html
localStorageClear();

document.getElementById('standard').addEventListener('click', () => {
    window.open('standard-levels.html', '_self');
});


document.getElementById('user-file').addEventListener('click', () => {
    window.open('user-file.html', '_self');
});
