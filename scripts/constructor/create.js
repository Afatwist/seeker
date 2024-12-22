import { Level } from "../Classes/Level.js";
document.getElementById('form-create').
    addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    let inputRow = Number(data.get('row'));
    let inputCol = Number(data.get('col'));
    if (inputRow * inputCol < 10) {
        alert("Размер поля должен быть более 10 клеток!");
    }
    else if (inputRow * inputCol > 3000) {
        alert("Размер поля должен быть менее 3000 клеток!");
    }
    else {
        const LEVEL = new Level;
        LEVEL.createForm(data);
        localStorage.setItem("gameData", JSON.stringify(LEVEL));
        window.open('board.html', '_self');
    }
});
//# sourceMappingURL=create.js.map