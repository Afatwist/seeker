import { Main } from "./Main.js";

/** Информация о поле в шапке страницы, обновление data-данных клеток и контрольных кнопок */
export class BoardInfo {

    /** Игровое поле */
    static #board: HTMLDivElement;

    /** Ряды клеток на поле */
    static #rows: HTMLCollectionOf<HTMLDivElement>;

    //####### Информация о размерах поля #######//

    /** Поле с информацией о количестве рядов */
    static #infoRow: HTMLSpanElement;

    /** Поле с информацией о количестве рядов */
    static #infoCol: HTMLSpanElement;

    //####### Информация о предметах на поле #######//

    /** Поле с информацией о количестве добычи на поле */
    static #infoLoot: HTMLSpanElement;

    /** Поле с информацией о количестве препятствий на поле */
    static #infoHurdle: HTMLSpanElement;

    /** Поле с информацией о количестве врагов на поле */
    static #infoEnemy: HTMLSpanElement;

    //####### Информация о Финише #######//

    /** Поле с информацией о клетке "Финиш" */
    static #infoFinish: HTMLSpanElement;

    /** Кнопка "Финиш Открыт" в боковом меню */
    static #btnFinishOpen: HTMLDivElement;

    /** Кнопка "Финиш Закрыт" в боковом меню */
    static #btnFinishClose: HTMLDivElement;

    //####### Информация о Старте #######//

    /** Поле с информацией о клетке "Старт" */
    static #infoStart: HTMLSpanElement;

    /** Кнопка "Старт" в боковом меню */
    static #btnStart: HTMLDivElement;

    //####### Верхние и Боковые кнопки на поле #######//
    /** Верхние кнопки на поле */
    static #btnControlTop: HTMLCollectionOf<HTMLButtonElement>;

    /** Верхние кнопки на поле */
    static #btnControlLeft: HTMLCollectionOf<HTMLButtonElement>;

    /** Подготовка данных */
    static init(): typeof BoardInfo {
        this.#board = document.getElementById('board') as HTMLDivElement;
        this.#rows = document.getElementsByClassName('row') as HTMLCollectionOf<HTMLDivElement>;

        this.#infoRow = document.getElementById('info-row') as HTMLSpanElement;
        this.#infoCol = document.getElementById('info-col') as HTMLSpanElement;

        this.#infoLoot = document.getElementById('info-loot') as HTMLSpanElement;
        this.#infoHurdle = document.getElementById('info-hurdle') as HTMLSpanElement;
        this.#infoEnemy = document.getElementById('info-enemy') as HTMLSpanElement;

        this.#infoFinish = document.getElementById('info-finish') as HTMLSpanElement;
        this.#btnFinishOpen = document.querySelector('.button-in-groupe.finish-open') as HTMLDivElement;
        this.#btnFinishClose = document.querySelector('.button-in-groupe.finish-close') as HTMLDivElement;

        this.#infoStart = document.getElementById('info-start') as HTMLSpanElement;
        this.#btnStart = document.querySelector('.button-in-groupe.start') as HTMLDivElement;

        this.#btnControlTop = document.getElementsByClassName('control-button-top') as HTMLCollectionOf<HTMLButtonElement>;
        this.#btnControlLeft = document.getElementsByClassName('control-button-left') as HTMLCollectionOf<HTMLButtonElement>;
        return this;
    }

    /** Обновление информации о предметах и размерах на поле
     * 
     * Обновление data-атрибутов клеток и боковых/верхних кнопок на поле
     * @param isResize при изменении размеров поля указать true для обновления данных клеток
     */
    static update(isResize: boolean): void {
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
    static #size(): void {
        let cols = this.#rows[0].getElementsByClassName('cell');

        this.#infoRow.innerText = this.#rows.length as unknown as string;
        this.#infoCol.innerText = cols.length as unknown as string;

        Main.LEVEL.setBoardSize(this.#rows.length, cols.length);
    }

    /** Информация о предметах на поле: добыча, препятствия, противник */
    static #items(): void {
        let loots = this.#board.querySelectorAll('.item[data-type="loot"]');
        let hurdle = this.#board.querySelectorAll('.item[data-type="hurdle"]');
        let enemy = this.#board.querySelectorAll('.item[data-type="enemy"]');

        this.#infoLoot.innerText = loots.length as unknown as string;
        this.#infoHurdle.innerText = hurdle.length as unknown as string;
        this.#infoEnemy.innerText = enemy.length as unknown as string;
    }

    /** Информация о клетке "Финиш" */
    static #finish(): void {
        const cellFinishClose = document.querySelector('.cell.finish-close') as HTMLDivElement;
        const cellFinishOpen = document.querySelector('.cell.finish-open') as HTMLDivElement;
        /** Клетки Финиш на поле */
        const cellFinish = cellFinishOpen || cellFinishClose;


        if (cellFinish) {
            this.#infoFinish.innerText = 'ряд: ' + cellFinish.dataset.row + '; колонка: ' + cellFinish.dataset.col;
            this.#infoFinish.classList.remove('info-pointer-alert');
            this.#btnFinishOpen.classList.add('btn-pointer-disabled');
            this.#btnFinishClose.classList.add('btn-pointer-disabled');
            if (Main.ACTION?.item === 'finish-open' || Main.ACTION?.item === 'finish-close') {
                Main.ACTION = null;
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
    static #start(): void {
        /** Клетка Старт на поле */
        const cellStart = document.querySelector('.cell.start') as HTMLDivElement;

        if (cellStart) {
            this.#infoStart.innerText = 'ряд: ' + cellStart.dataset.row + '; колонка: ' + cellStart.dataset.col;
            this.#infoStart.classList.remove('info-pointer-alert');
            this.#btnStart.classList.add('btn-pointer-disabled');
            if (Main.ACTION?.item === 'start') {
                Main.ACTION = null;
                this.#btnStart.classList.remove('active-action');
            }
        } else {
            this.#btnStart.classList.remove('btn-pointer-disabled');
            this.#infoStart.innerText = "Добавьте клетку Старт!";
            this.#infoStart.classList.add('info-pointer-alert');
        }
    }

    /** Обновление атрибутов data-row, data-col и title у клеток и рядов */
    static #cellsData(): void {
        [...this.#rows].forEach((row, r) => {
            row.dataset.row = r + 1 as unknown as string;
            row.querySelectorAll<HTMLDivElement>('.cell').forEach((cell, c) => {
                cell.dataset.row = r + 1 as unknown as string;
                cell.dataset.col = c + 1 as unknown as string;
                cell.title = `ряд = ${cell.dataset.row} : колонка = ${cell.dataset.col}`;
            })
        })
    }

    /** Обновление верхних и боковых кнопок */
    static #controlBtn(): void {
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
            btnTop.dataset.number = i + 1 as unknown as string;
        });

        [...this.#btnControlLeft].forEach((btnLeft, i) => {
            btnLeft.innerText = `Ряд: ${i + 1}`;
            btnLeft.dataset.number = i + 1 as unknown as string;
        });
    }
}