import { Main } from "./Main.js";
export class BoardInfo {
    static #board;
    static #rows;
    static #infoRow;
    static #infoCol;
    static #infoLoot;
    static #infoHurdle;
    static #infoEnemy;
    static #infoFinish;
    static #btnFinishOpen;
    static #btnFinishClose;
    static #infoStart;
    static #btnStart;
    static #btnControlTop;
    static #btnControlLeft;
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
    static update(isResize) {
        console.time('aaa');
        this.#items();
        this.#finish();
        this.#start();
        if (isResize) {
            this.#size();
            this.#cellsData();
            this.#controlBtn();
        }
        console.timeEnd('aaa');
    }
    static #size() {
        let cols = this.#rows[0].getElementsByClassName('cell');
        this.#infoRow.innerText = this.#rows.length;
        this.#infoCol.innerText = cols.length;
        Main.LEVEL.setBoardSize(this.#rows.length, cols.length);
    }
    static #items() {
        let loots = this.#board.querySelectorAll('.item[data-type="loot"]');
        let hurdle = this.#board.querySelectorAll('.item[data-type="hurdle"]');
        let enemy = this.#board.querySelectorAll('.item[data-type="enemy"]');
        this.#infoLoot.innerText = loots.length;
        this.#infoHurdle.innerText = hurdle.length;
        this.#infoEnemy.innerText = enemy.length;
    }
    static #finish() {
        const cellFinishClose = document.querySelector('.cell.finish-close');
        const cellFinishOpen = document.querySelector('.cell.finish-open');
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
        }
        else {
            this.#btnFinishOpen.classList.remove('btn-pointer-disabled');
            this.#btnFinishClose.classList.remove('btn-pointer-disabled');
            this.#infoFinish.innerText = "Добавьте клетку Финиш!";
            this.#infoFinish.classList.add('info-pointer-alert');
        }
    }
    static #start() {
        const cellStart = document.querySelector('.cell.start');
        if (cellStart) {
            this.#infoStart.innerText = 'ряд: ' + cellStart.dataset.row + '; колонка: ' + cellStart.dataset.col;
            this.#infoStart.classList.remove('info-pointer-alert');
            this.#btnStart.classList.add('btn-pointer-disabled');
            if (Main.ACTION?.item === 'start') {
                Main.ACTION = null;
                this.#btnStart.classList.remove('active-action');
            }
        }
        else {
            this.#btnStart.classList.remove('btn-pointer-disabled');
            this.#infoStart.innerText = "Добавьте клетку Старт!";
            this.#infoStart.classList.add('info-pointer-alert');
        }
    }
    static #cellsData() {
        [...this.#rows].forEach((row, r) => {
            row.dataset.row = r + 1;
            row.querySelectorAll('.cell').forEach((cell, c) => {
                cell.dataset.row = r + 1;
                cell.dataset.col = c + 1;
                cell.title = `ряд = ${cell.dataset.row} : колонка = ${cell.dataset.col}`;
            });
        });
    }
    static #controlBtn() {
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
//# sourceMappingURL=BoardInfo.js.map