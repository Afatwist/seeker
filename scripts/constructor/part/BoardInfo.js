import { Main } from "./Main.js";

/** Информация о поле в шапке страницы, обновление data-данных клеток и контрольных кнопок */
export class BoardInfo {

    /** Игровое поле
     * @type {HTMLDivElement}
     */
    static #board;

    /** Ряды клеток на поле
     * @type {HTMLCollectionOf<HTMLDivElement>}
     */
    static #rows;

    //####### Информация о размерах поля #######//

    /** Поле с информацией о количестве рядов
     * @type {HTMLSpanElement}
     */
    static #infoRow;

    /** Поле с информацией о количестве рядов
     * @type {HTMLSpanElement}
     */
    static #infoCol;

    //####### Информация о предметах на поле #######//

    /** Поле с информацией о количестве добычи на поле
 * @type {HTMLSpanElement}
 */
    static #infoLoot;

    /** Поле с информацией о количестве препятствий на поле
     * @type {HTMLSpanElement}
     */
    static #infoHurdle;

    /** Поле с информацией о количестве врагов на поле
     * @type {HTMLSpanElement}
     */
    static #infoEnemy;

    //####### Информация о Финише #######//

    /** Поле с информацией о клетке "Финиш"
     * @type {HTMLSpanElement}
     */
    static #infoFinish;

    /** Кнопка "Финиш Открыт" в боковом меню
     * @type {HTMLDivElement}
     */
    static #btnFinishOpen;

    /** Кнопка "Финиш Закрыт" в боковом меню
     * @type {HTMLDivElement}
     */
    static #btnFinishClose;

    //####### Информация о Старте #######//

    /** Поле с информацией о клетке "Старт"
    * @type {HTMLSpanElement}
    */
    static #infoStart;

    /** Кнопка "Старт" в боковом меню
     * @type {HTMLDivElement}
     */
    static #btnStart;

    //####### Верхние и Боковые кнопки на поле #######//
    /** Верхние кнопки на поле
     * @type {HTMLCollectionOf<HTMLButtonElement>}
     */
    static #btnControlTop;

    /** Верхние кнопки на поле
     * @type {HTMLCollectionOf<HTMLButtonElement>}
     */
    static #btnControlLeft;

    /** Подготовка данных
     * @returns {typeof BoardInfo} 
     */
    static init() {
        this.#board = document.getElementById('board');
        this.#rows = document.getElementsByClassName('row');

        this.#infoRow = document.getElementById('info-row');
        this.#infoCol = document.getElementById('info-col');

        this.#infoLoot = document.getElementById('info-loot');
        this.#infoHurdle = document.getElementById('info-hurdle');
        this.#infoEnemy = document.getElementById('info-enemy');

        this.#infoFinish = document.getElementById('info-finish');
        this.#btnFinishOpen = document.querySelector('.button-in-groupe.finish-open');
        this.#btnFinishClose = document.querySelector('.button-in-groupe.finish-close');

        this.#infoStart = document.getElementById('info-start');
        this.#btnStart = document.querySelector('.button-in-groupe.start');

        this.#btnControlTop = document.getElementsByClassName('control-button-top');
        this.#btnControlLeft = document.getElementsByClassName('control-button-left');
        return this;
    }

    /** Обновление информации о предметах и размерах на поле
     * 
     * Обновление data-атрибутов клеток и боковых/верхних кнопок на поле
     * @param {boolean} isResize при изменении размеров поля указать true для обновления данных клеток
     */
    static update(isResize) {
        console.time('aaa')

        this.#items();
        this.#finish();
        this.#start();

        if (isResize) {
            this.#size();
            this.#cellsData();
            this.#controlBtn();
        }
        console.timeEnd('aaa')
    }

    /** обновление Информации о размерах поля */
    static #size() {
        let cols = this.#rows[0].getElementsByClassName('cell');

        this.#infoRow.innerText = this.#rows.length;
        this.#infoCol.innerText = cols.length;

        Main.LEVEL.setBoardSize(this.#rows.length, cols.length);
    }

    /** Информация о предметах на поле: добыча, препятствия, противник */
    static #items() {
        let loots = this.#board.querySelectorAll('.item[data-type="loot"]');
        let hurdle = this.#board.querySelectorAll('.item[data-type="hurdle"]');
        let enemy = this.#board.querySelectorAll('.item[data-type="enemy"]');

        this.#infoLoot.innerText = loots.length;
        this.#infoHurdle.innerText = hurdle.length;
        this.#infoEnemy.innerText = enemy.length;
    }

    /** Информация о клетке "Финиш" */
    static #finish() {
        const cellFinishClose = document.querySelector('.cell.finish-close');
        const cellFinishOpen = document.querySelector('.cell.finish-open');
        /** Клетки Финиш на поле */
        const cellFinish = cellFinishOpen || cellFinishClose;


        if (cellFinish) {
            this.#infoFinish.innerText = 'ряд: ' + cellFinish.dataset.row + '; колонка: ' + cellFinish.dataset.col;
            this.#infoFinish.classList.remove('info-pointer-alert');
            this.#btnFinishOpen.classList.add('btn-pointer-disabled');
            this.#btnFinishClose.classList.add('btn-pointer-disabled');
            if (Main.ACTION?.item === 'finish-open' || Main.ACTION?.item === 'finish-close') {
                Main.ACTION = '';
                this.#btnFinishClose.classList.remove('active-action');
                this.#btnFinishOpen.classList.remove('active-action');
            }
        } else {
            this.#btnFinishOpen.classList.remove('btn-pointer-disabled');
            this.#btnFinishClose.classList.remove('btn-pointer-disabled');
            this.#infoFinish.innerText = "Добавьте клетку Финиш!";
            this.#infoFinish.classList.add('info-pointer-alert');
        }
    }

    /** Информация о клетке "Старт" */
    static #start() {
        /** Клетка Старт на поле */
        const cellStart = document.querySelector('.cell.start');

        if (cellStart) {
            this.#infoStart.innerText = 'ряд: ' + cellStart.dataset.row + '; колонка: ' + cellStart.dataset.col;
            this.#infoStart.classList.remove('info-pointer-alert');
            this.#btnStart.classList.add('btn-pointer-disabled');
            if (Main.ACTION?.item === 'start') {
                Main.ACTION = '';
                this.#btnStart.classList.remove('active-action');
            }
        } else {
            this.#btnStart.classList.remove('btn-pointer-disabled');
            this.#infoStart.innerText = "Добавьте клетку Старт!";
            this.#infoStart.classList.add('info-pointer-alert');
        }
    }

    /** Обновление атрибутов data-row, data-col и title у клеток и рядов */
    static #cellsData() {
        [...this.#rows].forEach((row, r) => {
            row.dataset.row = r + 1;
            row.querySelectorAll('.cell').forEach((cell, c) => {
                cell.dataset.row = r + 1;
                cell.dataset.col = c + 1;
                cell.title = `ряд = ${cell.dataset.row} : колонка = ${cell.dataset.col}`;
            })
        })
    }

    /** Обновление верхних и боковых кнопок */
    static #controlBtn() {
        // let col = 1;
        // for (const btnTop of this.#btnControlTop) {
        //     btnTop.innerText = `Колонка: ${col}`;
        //     btnTop.dataset.number = col;
        //     col++;
        // }

        // for (let col = 0; col < this.#btnControlTop.length; col++) {
        //     console.log(this.#btnControlTop[col]);
        // }

        [...this.#btnControlTop].forEach((btnTop, i) => {
            btnTop.innerText = `Колонка: ${i + 1}`;
            btnTop.dataset.number = i + 1;
        });

        [...this.#btnControlLeft].forEach((btnLeft, i) => {
            btnLeft.innerText = `Ряд: ${i + 1}`;
            btnLeft.dataset.number = i + 1;
        });
    }
}