// Обработчик Формы редактирования уровня - файл: edit.html
import { Level } from "../Classes/Level.js";

const data = JSON.parse(localStorage.getItem('gameData') as string);

const LEVEL = new Level(data);

const inputs = document.querySelectorAll('.form-input') as NodeListOf<HTMLInputElement>;
inputs.forEach(input => input.value = LEVEL[input.name]);

document.getElementById('form-edit')!.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(<HTMLFormElement>event.target);

    LEVEL.updateData(formData);

    localStorage.setItem("gameData", JSON.stringify(LEVEL));
    window.open('board.html', '_self');
});