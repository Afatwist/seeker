import { Level } from "./Classes/Level.js";
import { goToPage, localStorageClear } from "./Classes/Helpers.js";
localStorageClear();
document.getElementById('form-choose').
    addEventListener('submit', formHandler);
function formHandler(event) {
    event.preventDefault();
    let file = new FormData(event.target).get('file');
    if (!file)
        return;
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        localStorage.setItem("gameData", reader.result);
        window.open(goToPage(), '_self');
    };
}
const levelsList = document.getElementById('levels-list');
for (let num = 1; num <= Level.count; num++) {
    let { levelData } = await import(`../sources/levels/data/${num}.js`);
    levelsList.appendChild(cardRender(levelData));
}
function cardRender(cardData) {
    let card = document.createElement('div');
    card.classList.add("flex-col", "card");
    let cover = document.createElement('div');
    cover.classList.add('card-cover');
    cover.style.backgroundImage = `url('../sources/levels/cover/${cardData.id}.png')`;
    let title = document.createElement('span');
    title.innerHTML = cardData.title;
    title.classList.add("card-title", "select-not-pointer");
    let description = document.createElement('span');
    description.innerHTML = cardData.description;
    description.classList.add("card-description", "select-not-pointer");
    let game_difficulty = document.createElement('span');
    game_difficulty.innerHTML = "сложность: " + difficultyRus(cardData.game_difficulty);
    game_difficulty.classList.add("card-game_difficulty", "select-not-pointer");
    card.append(cover, title, description, game_difficulty);
    card.addEventListener('click', () => {
        localStorage.setItem("gameData", JSON.stringify(cardData));
        window.open(goToPage(), '_self');
    });
    return card;
}
function difficultyRus(difficulty) {
    return {
        easy: "Легкая",
        normal: "Нормальная",
        hard: "Сложная"
    }[difficulty] || difficulty;
}
//# sourceMappingURL=file-choose.js.map