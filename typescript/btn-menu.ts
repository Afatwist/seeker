import { baseUrl } from "./Classes/Helpers.js";

// Общие кнопки на всех страницах
document.getElementById('to-back-menu')!.addEventListener('click', () => {
    window.history.back();
});

document.getElementById('to-main-page')!.addEventListener('click', () => {
    window.open(baseUrl, '_self');
});