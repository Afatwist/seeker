// Обработчик для Главной страницы - файл: index.html

localStorage.clear();

document.getElementById('in-game')!.addEventListener('click', () => {
    openLink('file-choose', 'game');
});

document.getElementById('constructor')!.addEventListener('click', () => {
    openLink('constructor/constructor', 'constructor');
});

document.getElementById('how-play')!.addEventListener('click', () => {
    openLink('how-play');
})


/** Переход по указанной ссылке 
 * @param link - страница перехода
 * @param itemSet - добавить указанное значение в LocalStorage 
*/
function openLink(link: string, itemSet: string | false = false): void {
    if (itemSet) localStorage.setItem('page', itemSet);
    window.open(`pages/${link}.html`, '_self');
}