import { BackForwardAction } from "./BackForwardAction.js";
import { BoardInfo } from "./BoardInfo.js";
import { Main } from "./Main.js";

/** Создает Кнопки сверху и слева от поля с клетками
 * для применения выбранного действия ко всему ряду или колонке
 * 
 */
export class ControlBtn {
    /** Создание верхних и боковых кнопок для управления всей колонкой или рядом */
    static make(): void {
        /** Все ряды на поле */
        let rows = document.querySelectorAll<HTMLDivElement>('.row');
        /** Количество клеток в ряду */
        let cellsCount = rows[0].querySelectorAll('.cell').length;

        this.#colRender(cellsCount);
        this.#rowRender(rows);

    }

    /** Создание кнопки для управления всей колонкой/рядом 
     * @param {string} direction - направление: 'col' || 'row'
     * @param {string|number} number - номер ряда/колонки
     */
    static btnRender(direction: string, number: string | number): HTMLButtonElement | void {
        if (direction === 'col') return this.#btnRender('Колонка', 'top', direction, number);
        else if (direction === 'row') return this.#btnRender('Ряд', 'left', direction, number);
        else alert('Ошибка при создании контрольной кнопки, btnRender');
    }

    /** Добавление событий на боковую/верхнюю кнопку */
    static addEvent(button: HTMLButtonElement): void {
        button.addEventListener('click', () => {
            if (Main.ACTION!.type === 'pointer') return;

            /** direction - направление кнопки: row или col 
             * number - номер ряда или колонки
             */
            const { direction, number } = button.dataset;

            BackForwardAction.addToArrBackward();

            if (Main.ACTION!.menu === 'cell') {
                document.querySelectorAll<HTMLDivElement>(`.cell[data-${direction}="${number}"]`).
                    forEach(cell => { Main.actionHandlerCell(cell) });
                BoardInfo.update(false);
            } else if (Main.ACTION!.menu === 'col' || Main.ACTION!.menu === 'row') {
                let cell = document.querySelector(`.cell[data-${Main.ACTION!.menu}="${number}"]`);
                if (direction === 'col') Main.actionHandlerCol(cell as HTMLDivElement);
                if (direction === 'row') Main.actionHandlerRow(cell as HTMLDivElement);
                BoardInfo.update(true);
            } else alert('Ошибка контрольной кнопки');


        });
    }

    //##### Служебные методы #####//

    /** Верхний ряд кнопок для управления колонками */
    static #colRender(cellsCount: number): void {
        let controlRowTop = document.createElement('div');
        controlRowTop.classList.add('row-control-top');

        for (let col = 1; col <= cellsCount; col++) {
            // let btn = 
            controlRowTop.append(this.btnRender('col', col) as HTMLButtonElement);
        }
        document.querySelector('.board')!.prepend(controlRowTop);
    }

    /** Боковые кнопки для управления рядами 
     * @param rows 
    */
    static #rowRender(rows: NodeListOf<HTMLDivElement>) {
        rows.forEach(row => {
            row.prepend(this.btnRender('row', row.dataset.row as string) as HTMLButtonElement);
        });
    }

    /** Создает кнопку
     * @param text надпись на кнопке ("Колонка", "Ряд")
     * @param style добавляемый класс к кнопке
     * @param direction направление: 'col' || 'row'
     * @param number номер ряда или колонки
     */
    static #btnRender(text: string, style: string, direction: string, number: string | number): HTMLButtonElement {
        let button = document.createElement('button');

        button.innerText = `${text}: ${number}`;
        button.classList.add('control-button', `control-button-${style}`);

        button.dataset.direction = direction;
        button.dataset.number = number as string;

        this.addEvent(button);
        return button;
    }
}