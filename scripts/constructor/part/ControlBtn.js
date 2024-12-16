import { BackForwardAction } from "./BackForwardAction.js";
import { BoardInfo } from "./BoardInfo.js";
import { Main } from "./Main.js";

/** Создает Кнопки сверху и слева от поля с клетками
 * для применения выбранного действия ко всему ряду или колонке
 * 
 */
export class ControlBtn {
    /** Создание верхних и боковых кнопок для управления всей колонкой или рядом */
    static make() {
        /** Все ряды на поле */
        let rows = document.querySelectorAll('.row');
        /** Количество клеток в ряду */
        let cellsCount = rows[0].querySelectorAll('.cell').length;

        this.#colRender(cellsCount);
        this.#rowRender(rows);

    }

    /** Создание кнопки для управления всей колонкой/рядом 
     * @param {string} direction - направление: 'col' || 'row'
     * @param {string|number} number - номер ряда/колонки
     * @returns {HTMLButtonElement}
     */
    static btnRender(direction, number) {
        if (direction === 'col') return this.#btnRender('Колонка', 'top', direction, number);
        else if (direction === 'row') return this.#btnRender('Ряд', 'left', direction, number);
        else alert('Ошибка при создании контрольной кнопки, btnRender');
    }

    /** Добавление событий на боковую/верхнюю кнопку 
     * @param {HTMLButtonElement} button 
     */
    static addEvent(button) {
        button.addEventListener('click', () => {
            if (Main.ACTION.type === 'pointer') return;

            /** direction - направление кнопки: row или col 
             * number - номер ряда или колонки
             */
            const { direction, number } = button.dataset;

            BackForwardAction.addToArrBackward();

            if (Main.ACTION.menu === 'cell') {
                document.querySelectorAll(`.cell[data-${direction}="${number}"]`).
                    forEach(cell => { Main.actionHandlerCell(cell) });
                BoardInfo.update(false);
            } else if (Main.ACTION.menu === 'col' || Main.ACTION.menu === 'row') {
                let cell = document.querySelector(`.cell[data-${Main.ACTION.menu}="${number}"]`);
                if (direction === 'col') Main.actionHandlerCol(cell);
                if (direction === 'row') Main.actionHandlerRow(cell);
                BoardInfo.update(true);
            } else alert('Ошибка контрольной кнопки');


        });
    }

    //##### Служебные методы #####//

    /** Верхний ряд кнопок для управления колонками 
     * @param {number} cellsCount 
    */
    static #colRender(cellsCount) {
        let controlRowTop = document.createElement('div');
        controlRowTop.classList.add('row-control-top');

        for (let col = 1; col <= cellsCount; col++) {
            controlRowTop.append(this.btnRender('col', col));
        }
        document.querySelector('.board').prepend(controlRowTop);
    }

    /** Боковые кнопки для управления рядами 
     * @param {NodeListOf<HTMLDivElement>} rows 
    */
    static #rowRender(rows) {
        rows.forEach(row => {
            row.prepend(this.btnRender('row', row.dataset.row));
        });
    }

    /** Создает кнопку
     *  
     * @param {string} text надпись на кнопке ("Колонка", "Ряд")
     * @param {string} style добавляемый класс к кнопке
     * @param {string} direction направление: 'col' || 'row'
     * @param {string|number} number номер ряда или колонки
     * @returns {HTMLButtonElement}
     */
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