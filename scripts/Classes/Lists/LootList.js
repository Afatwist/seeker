import { LootModel } from "../Models/LootModel.js";
export class LootList {
    static #all = new Map();
    static #counter = 0;
    static set(loot, cell) {
        const item = new LootModel(loot, this.#counter, cell);
        this.#all.set(item.id, item);
        this.#counter++;
    }
    static getAll() {
        return this.#all;
    }
    static getOne(id) {
        return this.#all.get(parseInt(id));
    }
    static delete(id) {
        this.getOne(id)?.element.remove();
        this.#all.delete(parseInt(id));
    }
    static getCounter() {
        return { counter: this.#counter, map: this.#all.size };
    }
    static actions() {
        this.#all.forEach(item => {
            if (item.fall === 0)
                item.fallDown();
        });
    }
}
//# sourceMappingURL=LootList.js.map