import { CellModel } from "../Models/CellModel.js";
import { EnemyModel } from "../Models/EnemyModel.js"


/** Список всех врагов на поле */
export class EnemyList {

    /** список врагов
     * @type { Map<number, EnemyModel> }
     */
    static #all = new Map()

    /** количество врагов, добавленных в список
     * @type {number}
     */
    static #counter = 0


    /** Добавить врага в список
     * 
     * @param {HTMLDivElement} enemy
     * @param {CellModel} cell 
     */
    static set(enemy, cell) {
        const item = new EnemyModel(enemy, this.#counter, cell);
        this.#all.set(item.id, item);
        this.#counter++
    }

    /** Получить список всех врагов
     * 
     * @returns {Map<number, EnemyModel>}
     */
    static getAll() {
        return this.#all
    }

    /** Получить одного врага по его идентификатору
     * 
     * @param {number|string} id 
     * @returns {EnemyModel | undefined}
     */
    static getOne(id) {
        return this.#all.get(parseInt(id))
    }

    /** Удалить врага из списка, по его идентификатору
     * 
     * @param {number|string} id 
     */
    static delete(id) {
        this.#all.delete(parseInt(id))
    }

    static getCounter() {
        return { counter: this.#counter, map: this.#all.size }
    }

    /** Активировать всех врагов на поле */
    static actions() {
        this.#all.forEach(enemy => {
            enemy.distanceUpdate();
            enemy.picChanger();
            if (!enemy.active) enemy.activity();
        });
    }
}