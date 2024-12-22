import { EnemyModel } from "../Models/EnemyModel.js";
export class EnemyList {
    static #all = new Map();
    static #counter = 0;
    static set(enemy, cell) {
        const item = new EnemyModel(enemy, this.#counter, cell);
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
        this.#all.forEach(enemy => {
            enemy.distanceUpdate();
            enemy.picChanger();
            if (!enemy.active)
                enemy.activity();
        });
    }
}
//# sourceMappingURL=EnemyList.js.map