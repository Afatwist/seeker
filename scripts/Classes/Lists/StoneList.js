import { StoneModel } from "../Models/StoneModel.js";
export class StoneList {
    static #all = new Map();
    static #counter = 0;
    static set(stone, cell) {
        const item = new StoneModel(stone, this.#counter, cell);
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
        this.#all.delete(parseInt(id));
    }
    static getCounter() {
        return { counter: this.#counter, map: this.#all.size };
    }
    static actions() {
        this.#all.forEach(item => {
            if (item.fall === 0)
                item.fallDown();
            ;
        });
    }
}
//# sourceMappingURL=StoneList.js.map