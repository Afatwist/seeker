import { CellList } from "../Classes/Lists/CellList.js";
import { LootList } from "../Classes/Lists/LootList.js";
// import { CellModel } from "../Classes/Models/CellModel.js";

export class GameInfo {

    /** Блок Информации. Количество добычи на поле */
    static #lootCount: HTMLSpanElement

    /** Блок Информации. Состояние финиша */
    static #finishStatus: HTMLSpanElement

    /** Инициализация класса GameInfo */
    static init(): void {
        this.#lootCount = document.querySelector('.loot-count')!;
        this.#finishStatus = document.querySelector('.finish-status')!;
    }

    /** Обновление информационного блока в шаке страницы */
    static update(): void {
        this.#updateLootCount();
        this.#updateFinisStatus();
    }

    /** Обновление информации о добыче */
    static #updateLootCount(): void {
        this.#lootCount.textContent = LootList.getCounter().map as unknown as string;
    }

    /** Обновление информации о клетке Финиш */
    static #updateFinisStatus(): void {
        let info = '';

        if (CellList.finish?.type === 'finish-close') info = 'Финиш закрыт';
        else if (CellList.finish?.type === 'finish-open') info = 'Финиш открыт';
        else info = 'Игра без Финиша, просто соберите всю добычу';

        this.#finishStatus.textContent = info;
    }
}