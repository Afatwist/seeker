// Обработчик для страницы: Пользовательское поле - файл: user-file.html

import { goToPage, localStorageClear } from "../Classes/Helpers.js";

localStorageClear();

document.getElementById('form-choose').
    addEventListener('submit', (event) => {
        event.preventDefault();

        let file = new FormData(event.target).get('file');

        let reader = new FileReader();

        reader.readAsText(file);

        reader.onload = () => {
            localStorage.setItem("gameData", reader.result);
            window.open(goToPage(), '_self');
        };
    });