import { Level } from "../../Classes/Level.js";
import { BackForwardAction } from "./BackForwardAction.js";
import { BoardInfo } from "./BoardInfo.js";
import { BoardSize } from "./BoardSize.js";
import { ControlBtn } from "./ControlBtn.js";
export class Main {
    static ACTION = null;
    static LEVEL;
    static init(data) {
        Main.LEVEL = new Level(data);
    }
    static handler() {
        document.querySelectorAll('.cell').forEach(cell => this.cellEvent(cell));
    }
    static #createNewRow() {
        let newRow = document.createElement('div');
        newRow.classList.add('row');
        newRow.dataset.row = ' ';
        newRow.append(ControlBtn.btnRender('row', ''));
        for (let c = 1; c <= this.LEVEL.board.size.cols; c++) {
            let newCell = this.createNewCell();
            newRow.append(newCell);
        }
        return newRow;
    }
    static createNewCell() {
        let newCell = document.createElement('div');
        newCell.classList.add('cell', 'free');
        newCell.dataset.type = 'free';
        newCell.dataset.row = '';
        newCell.dataset.col = '';
        this.cellEvent(newCell);
        return newCell;
    }
    static createNewItem() {
        let item = document.createElement('div');
        item.classList.add('item', this.ACTION.item);
        item.dataset.type = this.ACTION.type;
        return item;
    }
    static cellEvent(cell) {
        cell.addEventListener('click', () => {
            if (Main.ACTION) {
                BackForwardAction.addToArrBackward();
                if (Main.ACTION.menu === 'cell') {
                    Main.actionHandlerCell(cell);
                    BoardInfo.update(false);
                }
                else if (Main.ACTION.menu === 'row') {
                    Main.actionHandlerRow(cell);
                    BoardInfo.update(true);
                }
                else if (Main.ACTION.menu === 'col') {
                    Main.actionHandlerCol(cell);
                    BoardInfo.update(true);
                }
                else
                    alert('Ошибка обработки кнопок меню');
            }
        });
    }
    static actionHandlerCell(cell) {
        switch (this.ACTION.type) {
            case 'loot':
            case 'hurdle':
            case 'enemy':
                this.updateCell(cell, 'free', this.createNewItem());
                break;
            case 'type':
            case 'pointer':
                this.updateCell(cell, this.ACTION.item);
                break;
            case 'cell-clear':
                if (BoardSize.check())
                    break;
                this.updateCell(cell, this.ACTION.item);
                break;
            default: break;
        }
    }
    static actionHandlerRow(cell) {
        switch (this.ACTION.type) {
            case 'row-add':
                if (BoardSize.check())
                    return;
                let currentRow = cell.closest('.row');
                let newRow = this.#createNewRow();
                currentRow.insertAdjacentElement(this.ACTION.position, newRow);
                break;
            case 'row-remove':
                if (BoardSize.check())
                    return;
                cell.closest('.row').remove();
                break;
            default: break;
        }
    }
    static actionHandlerCol(cell) {
        switch (this.ACTION.type) {
            case 'col-add':
                if (BoardSize.check())
                    return;
                document.
                    querySelectorAll(`.cell[data-col="${cell.dataset.col}"]`).
                    forEach(targetCell => targetCell.insertAdjacentElement(this.ACTION.position, this.createNewCell()));
                document.querySelector(`.control-button-top[data-number="${cell.dataset.col}"]`).
                    insertAdjacentElement(this.ACTION.position, ControlBtn.btnRender('col', ''));
                break;
            case 'col-remove':
                if (BoardSize.check())
                    return;
                let controlButtons = document.querySelectorAll('.control-button-top');
                document.
                    querySelectorAll(`.cell[data-col="${cell.dataset.col}"]`).
                    forEach(targetCell => targetCell.remove());
                controlButtons.forEach(btn => {
                    if (btn.dataset.number === cell.dataset.col)
                        btn.remove();
                });
                break;
            default: break;
        }
    }
    static updateCell(cell, type, item) {
        cell.dataset.type = type;
        cell.className = '';
        cell.classList.add('cell', type);
        cell.replaceChildren(item || '');
    }
}
//# sourceMappingURL=Main.js.map