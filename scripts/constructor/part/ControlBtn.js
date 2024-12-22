import { BackForwardAction } from "./BackForwardAction.js";
import { BoardInfo } from "./BoardInfo.js";
import { Main } from "./Main.js";
export class ControlBtn {
    static make() {
        let rows = document.querySelectorAll('.row');
        let cellsCount = rows[0].querySelectorAll('.cell').length;
        this.#colRender(cellsCount);
        this.#rowRender(rows);
    }
    static btnRender(direction, number) {
        if (direction === 'col')
            return this.#btnRender('Колонка', 'top', direction, number);
        else if (direction === 'row')
            return this.#btnRender('Ряд', 'left', direction, number);
        else
            alert('Ошибка при создании контрольной кнопки, btnRender');
    }
    static addEvent(button) {
        button.addEventListener('click', () => {
            if (Main.ACTION.type === 'pointer')
                return;
            const { direction, number } = button.dataset;
            BackForwardAction.addToArrBackward();
            if (Main.ACTION.menu === 'cell') {
                document.querySelectorAll(`.cell[data-${direction}="${number}"]`).
                    forEach(cell => { Main.actionHandlerCell(cell); });
                BoardInfo.update(false);
            }
            else if (Main.ACTION.menu === 'col' || Main.ACTION.menu === 'row') {
                let cell = document.querySelector(`.cell[data-${Main.ACTION.menu}="${number}"]`);
                if (direction === 'col')
                    Main.actionHandlerCol(cell);
                if (direction === 'row')
                    Main.actionHandlerRow(cell);
                BoardInfo.update(true);
            }
            else
                alert('Ошибка контрольной кнопки');
        });
    }
    static #colRender(cellsCount) {
        let controlRowTop = document.createElement('div');
        controlRowTop.classList.add('row-control-top');
        for (let col = 1; col <= cellsCount; col++) {
            controlRowTop.append(this.btnRender('col', col));
        }
        document.querySelector('.board').prepend(controlRowTop);
    }
    static #rowRender(rows) {
        rows.forEach(row => {
            row.prepend(this.btnRender('row', row.dataset.row));
        });
    }
    static #btnRender(text, style, direction, number) {
        let button = document.createElement('button');
        button.innerText = `${text}: ${number}`;
        button.classList.add('control-button', `control-button-${style}`);
        button.dataset.direction = direction;
        button.dataset.number = number;
        this.addEvent(button);
        return button;
    }
}
//# sourceMappingURL=ControlBtn.js.map