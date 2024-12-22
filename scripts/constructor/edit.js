import { Level } from "../Classes/Level.js";
const data = JSON.parse(localStorage.getItem('gameData'));
const LEVEL = new Level(data);
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => input.value = LEVEL[input.name]);
document.getElementById('form-edit').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    LEVEL.updateData(formData);
    localStorage.setItem("gameData", JSON.stringify(LEVEL));
    window.open('board.html', '_self');
});
//# sourceMappingURL=edit.js.map