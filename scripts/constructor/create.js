import { Level } from "../Classes/Level.js";
import { BoardSize } from "./part/BoardSize.js";
document.getElementById('form-create').
    addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    let inputRow = Number(data.get('row'));
    let inputCol = Number(data.get('col'));
    if (inputRow * inputCol < BoardSize.minCell) {
        alert(`Минимальный размер поля ${BoardSize.minCell} клеток!`);
    }
    else if (inputRow * inputCol > BoardSize.maxCell) {
        alert(`Максимальный размер поля ${BoardSize.maxCell} клеток!`);
    }
    else {
        const LEVEL = new Level;
        LEVEL.createForm(data);
        localStorage.setItem("gameData", JSON.stringify(LEVEL));
        window.open('board.html', '_self');
    }
});
//# sourceMappingURL=create.js.map