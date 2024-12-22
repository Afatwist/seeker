// Обработчик для страницы Список стандартных уровней - файл: file-choose.html

import { Level } from "./Classes/Level.js";
import { goToPage, localStorageClear } from "./Classes/Helpers.js";

localStorageClear();
// ####################################################################

/* Обработчик формы выбора пользовательского файла */
document.getElementById('form-choose')!.
    addEventListener('submit', formHandler);

function formHandler(event: SubmitEvent): any {
    event.preventDefault();

    let file = new FormData(event.target as HTMLFormElement).get('file');
    if (!file) return;

    let reader = new FileReader();

    reader.readAsText(file as Blob);

    reader.onload = () => {
        localStorage.setItem("gameData", reader.result as string);
        window.open(goToPage(), '_self');
    };

}


// ################################################################
/* Список стандартных уровней */
const levelsList = document.getElementById('levels-list')!;
// генерирует список стандартных уровней 
for (let num = 1; num <= Level.count; num++) {
    let { levelData } = await import(`../sources/levels/data/${num}.js`);
    levelsList.appendChild(cardRender(levelData));
}

/** Генерирует карточку уровня 
 * @param cardData данные уровня
 * @returns карточка уровня
 */
function cardRender(cardData: ILevelData): HTMLDivElement {
    //  карточка
    let card = document.createElement('div');
    card.classList.add("flex-col", "card");

    // скриншот уровня
    let cover = document.createElement('div');
    cover.classList.add('card-cover');
    cover.style.backgroundImage = `url('../sources/levels/cover/${cardData.id}.png')`;

    // название
    let title = document.createElement('span');
    title.innerHTML = cardData.title;
    title.classList.add("card-title", "select-not-pointer");

    // описание
    let description = document.createElement('span');
    description.innerHTML = cardData.description;
    description.classList.add("card-description", "select-not-pointer");

    // сложность
    let game_difficulty = document.createElement('span');
    game_difficulty.innerHTML = "сложность: " + difficultyRus(cardData.game_difficulty);
    game_difficulty.classList.add("card-game_difficulty", "select-not-pointer");

    card.append(cover, title, description, game_difficulty);

    card.addEventListener('click', () => {
        localStorage.setItem("gameData", JSON.stringify(cardData));
        window.open(goToPage(), '_self');
    })

    return card;
}

/** Уровень сложности по-русски 
 * @param {string} difficulty 
 * @returns {string}
 */
function difficultyRus(difficulty: string): string {
    return {
        easy: "Легкая",
        normal: "Нормальная",
        hard: "Сложная"
    }[difficulty] || difficulty;
}