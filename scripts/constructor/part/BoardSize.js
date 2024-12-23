import { Main } from "./Main.js";
export class BoardSize {
    static minRow = 1;
    static minCol = 1;
    static minCell = 10;
    static maxRow = 100;
    static maxCol = 100;
    static maxCell = 5000;
    static #rows;
    static #cols;
    static #cells;
    static init() {
        this.#rows = document.getElementsByClassName('row');
        this.#cells = document.getElementsByClassName('cell');
        this.#cols = document.getElementsByClassName('control-button-top');
    }
    static check() {
        let message = [];
        let cellCount = [...this.#cells].filter(cell => cell.dataset.type !== 'none').length;
        let colCount = this.#cols.length;
        let rowCount = this.#rows.length;
        if (cellCount <= 10 && Main.ACTION?.type === 'cell-clear') {
            message.push('На поле должно быть минимум 10 клеток доступных для перемещения игрока!');
        }
        if (Main.ACTION?.type === 'row-remove') {
            if (rowCount === 1)
                message.push('На поле должен быть минимум один ряд!');
            if (cellCount - colCount < 10)
                message.push(`На поле может быть минимум 10 клеток, 
            при удалении ряда останется: ${cellCount - colCount}!`);
        }
        if (Main.ACTION?.type === 'col-remove') {
            if (colCount === 100)
                message.push('На поле должна быть минимум одна колонка!');
            if (cellCount - rowCount < 100)
                message.push(`На поле может быть минимум 10 клеток,
            при удалении колонки останется: ${cellCount - rowCount}!`);
        }
        if (Main.ACTION?.type === 'row-add') {
            if (rowCount >= 100)
                message.push('На поле может быть максимум сто рядов!');
            if (cellCount + colCount > 5000)
                message.push(`На поле может быть максимум 5000 клеток, 
            при добавлении ряда получится: ${cellCount + colCount}!`);
        }
        if (Main.ACTION?.type === 'col-add') {
            if (colCount >= 100)
                message.push('На поле может быть максимум сто колонок!');
            if (cellCount + rowCount > 5000)
                message.push(`На поле может быть максимум 5000 клеток,
            при добавлении колонки получится: ${cellCount + rowCount}!`);
        }
        if (message.length) {
            alert(message.join(" \n"));
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=BoardSize.js.map