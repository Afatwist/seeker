/* Функции помощники */

/** Перенаправляет на страницы игры или конструктора 
 * @returns {string}
 */
export function goToPage() {
    const page = localStorage.getItem('page');

    if (page === 'constructor') return '../pages/constructor/board.html';
    if (page === 'game') return '../pages/game.html';
    return '/';
}

export const baseUrl = '/seeker/';

export function localStorageClear() { 
    localStorage.removeItem('gameData');
    localStorage.removeItem('fromConstructor');
}