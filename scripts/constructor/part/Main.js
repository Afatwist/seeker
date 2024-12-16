import { Level } from "../../Classes/Level.js";
import { BackForwardAction } from "./BackForwardAction.js";
import { BoardInfo } from "./BoardInfo.js";
import { ControlBtn } from "./ControlBtn.js";

/** Основной класс конструктора */
export class Main {

    /** Текущая нажатая кнопка на боковой панели
     * @type {ActionBtn|null}
    */
    static ACTION = null

    /**
     * @type {Level}
     */
    static LEVEL

    /** Подготовка данных */
    static init(data) {
        Main.LEVEL = new Level(data);
    }

    /** Обработчик событий для клеток на игровом поле */
    static handler() {
        document.querySelectorAll('.cell').forEach(this.cellEvent);
    }

    /** Создать новый ряд
     * @returns {HTMLDivElement}
     */
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

    /** Создать новую клетку на поле 
     * @returns {HTMLDivElement}
     */
    static createNewCell() {
        let newCell = document.createElement('div');
        newCell.classList.add('cell', 'free');
        newCell.dataset.type = 'free';
        newCell.dataset.row = '';
        newCell.dataset.col = '';
        this.cellEvent(newCell);
        return newCell;
    }

    /** Создать новый предмета, для добавления в клетку 
     * @returns {HTMLDivElement}
     */
    static createNewItem() {
        let item = document.createElement('div');
        item.classList.add('item', this.ACTION.item);
        item.dataset.type = this.ACTION.type;
        return item;
    }

    /** Добавить событие на клетку
     * 
     * @param {HTMLDivElement} cell - клетка
     */
    static cellEvent(cell) {
        cell.addEventListener('click', () => {
            if (Main.ACTION) {
                BackForwardAction.addToArrBackward();
                if (Main.ACTION.menu === 'cell') {
                    Main.actionHandlerCell(cell);
                    BoardInfo.update(false);
                } else if (Main.ACTION.menu === 'row') {
                    Main.actionHandlerRow(cell);
                    BoardInfo.update(true);
                } else if (Main.ACTION.menu === 'col') {
                    Main.actionHandlerCol(cell);
                    BoardInfo.update(true);
                }
                else alert('Ошибка обработки кнопок меню');
            }
        });
    }

    /** Обработка кнопок из меню Клетка
     * @param {HTMLDivElement} cell клетка к которой применяется действие
     */
    static actionHandlerCell(cell) {
        switch (this.ACTION.type) {
            case 'loot':    // Добавление добычи
            case 'hurdle':  // Добавление препятствия
            case 'enemy':   // Добавление врага/противника
                this.updateCell(cell, 'free', this.createNewItem());
                break;

            case 'type':        // Смена типа клетки
            case 'cell-clear':  // Удаление/очистка клетки
            case 'pointer':     // Добавление клеток Старт и Финиш
                this.updateCell(cell, this.ACTION.item);
                break;

            default: break;
        }
    }

    /** Обработка кнопок из меню Ряд
     * @param {HTMLDivElement} cell клетка к которой применяется действие
     */
    static actionHandlerRow(cell) {
        switch (this.ACTION.type) {
            case 'row-add':
                let currentRow = cell.closest('.row');
                let newRow = this.#createNewRow();
                currentRow.insertAdjacentElement(this.ACTION.position, newRow);
                break;

            case 'row-remove':
                cell.closest('.row').remove();
                break;

            default: break;
        }
    }

    /** Обработка кнопок из меню Колонка
     * @param {HTMLDivElement} cell клетка к которой применяется действие
     */
    static actionHandlerCol(cell) {
        switch (this.ACTION.type) {
            case 'col-add':
                // новая колонка
                document.
                    querySelectorAll(`.cell[data-col="${cell.dataset.col}"]`).
                    forEach(targetCell =>
                        targetCell.insertAdjacentElement(this.ACTION.position, this.createNewCell())
                    );
                // добавление верхней кнопки для новой колонки
                document.querySelector(`.control-button-top[data-number="${cell.dataset.col}"]`).
                    insertAdjacentElement(this.ACTION.position, ControlBtn.btnRender('col', ''));
                break;

            case 'col-remove':
                // удаление колонки
                document.
                    querySelectorAll(`.cell[data-col="${cell.dataset.col}"]`).
                    forEach(targetCell => targetCell.remove());
                // удаление верхней кнопки для колонки
                document.querySelector(`.control-button-top[data-number="${cell.dataset.col}"]`).remove();

                break;

            default: break;
        }
    }

    /** Обновление клетки при смене типа клетки или предмета в ней
     * @param {HTMLDivElement} cell - обновляемая клетка
     * @param {string} type - тип/класс клетки 
     * @param {HTMLDivElement?} item - добавляемый предмет
     */
    static updateCell(cell, type, item = '') {
        cell.dataset.type = type;
        cell.className = '';
        cell.classList.add('cell', type);
        cell.replaceChildren(item);
    }
}