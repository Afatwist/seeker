import { CellList } from "../Classes/Lists/CellList.js";
import { LootList } from "../Classes/Lists/LootList.js";
export class GameInfo {
    static #lootCount;
    static #finishStatus;
    static init() {
        this.#lootCount = document.querySelector('.loot-count');
        this.#finishStatus = document.querySelector('.finish-status');
    }
    static update() {
        this.#updateLootCount();
        this.#updateFinisStatus();
    }
    static #updateLootCount() {
        this.#lootCount.textContent = LootList.getCounter().map;
    }
    static #updateFinisStatus() {
        let info = '';
        if (CellList.finish?.type === 'finish-close')
            info = 'Финиш закрыт';
        else if (CellList.finish?.type === 'finish-open')
            info = 'Финиш открыт';
        else
            info = 'Игра без Финиша, просто соберите всю добычу';
        this.#finishStatus.textContent = info;
    }
}
//# sourceMappingURL=GameInfo.js.map