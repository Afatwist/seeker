// Обработчик для Главной страницы - файл: index.html

localStorage.clear();

document.getElementById('in-game').addEventListener('click', () => {
    localStorage.setItem('page', 'game');
    window.open('pages/file-choose/file-choose.html', '_self');
});

document.getElementById('constructor').addEventListener('click', () => {
    localStorage.setItem('page', 'constructor');
    window.open('pages/constructor/constructor.html', '_self');
});

document.getElementById('how-play').addEventListener('click', () => {
    window.open('pages/how-play.html', '_self');
});