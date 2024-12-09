import { CellList } from "../Classes/Lists/CellList.js";
import { LootList } from "../Classes/Lists/LootList.js";
import { CellModel } from "../Classes/Models/CellModel.js";

export class GameInfo {

    /** Блок Информации. Количество добычи на поле
     * @type {HTMLSpanElement}
     */
    static #lootCount

    /** Блок Информации. Состояние финиша
     * @type {HTMLSpanElement}
     */
    static #finishStatus

    /** Клетка финиш
     * @type {CellModel|undefined} 
     */
    static finish

    /** Инициализация класса GameInfo */
    static init() {
        this.#lootCount = document.querySelector('.loot-count');
        this.#finishStatus = document.querySelector('.finish-status');

        let finishCell = document.querySelector('.finish-close') ||
            document.querySelector('.finish-open');
        if (finishCell) {
            let { row, col } = finishCell.dataset;
            this.finish = CellList.getOne(row, col);
        }
    }

    /** Обновление информационного блока в шаке страницы */
    static update() {
        this.#updateLootCount();
        this.#updateFinisStatus();
    }

    /** Обновление информации о добыче */
    static #updateLootCount() {
        this.#lootCount.textContent = LootList.getCounter().map;
    }

    /** Обновление информации о клетке Финиш */
    static #updateFinisStatus() {
        let info = '';

        if (this.finish?.type === 'finish-close') info = 'Финиш закрыт';
        else if (this.finish?.type === 'finish-open') info = 'Финиш открыт';
        else info = 'Игра без Финиша, просто соберите всю добычу';

        this.#finishStatus.textContent = info;
    }
}