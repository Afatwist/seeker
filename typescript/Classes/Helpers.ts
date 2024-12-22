/* Функции помощники */

/** Перенаправляет на страницы игры или конструктора */
export function goToPage(): string {
    const page = localStorage.getItem('page');

    if (page === 'constructor') return '../pages/constructor/board.html';
    if (page === 'game') return '../pages/game.html';
    return baseUrl;
}

// /** Переход по указанной ссылке 
//  * @param link - страница перехода
//  * @param itemSet - добавить указанное значение в LocalStorage 
// */
// export function openLink(link: string, itemSet: string | false = false): void {
//     if (itemSet) localStorage.setItem('page', itemSet);
//     window.open(`pages/${link}.html`, '_self');
// }

export const baseUrl = '/seeker/';

/** Очистка  localStorage*/
export function localStorageClear(): void {
    localStorage.removeItem('gameData');
    localStorage.removeItem('fromConstructor');
}