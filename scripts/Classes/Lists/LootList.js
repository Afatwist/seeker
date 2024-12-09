import { LootModel } from "../Models/LootModel.js";
import { CellList } from "./CellList.js";
import { CellModel } from "../Models/CellModel.js";

/**
 * Список добычи на поле
 */
export class LootList {

    /** список добычи
     * @type { Map<number, LootModel> }
     */
    static #all = new Map()

    /** количество добычи, добавленной в список
     * @type {number}
     */
    static #counter = 0

    /** Создать список добычи */
    static makeList() {
        Array.from(document.querySelectorAll("[data-type='loot']")).reverse().forEach(loot => {
            this.#set(loot)
        });
    }

    /** Добавить добычу в список
     * 
     * @param {Element} loot 
     */
    static #set(loot) {
        const item = new LootModel(loot, this.#counter);
        this.#all.set(item.id, item);
        this.#counter++
    }

    /** Получить полный список добычи на поле
     * 
     * @returns { Map<number, LootModel> }
     */
    static getAll() {
        return this.#all
    }

    /**
     * 
     * @param {number|string} id 
     * @returns {LootModel|undefined}
     */
    static getOne(id) {
        return this.#all.get(parseInt(id))
    }

    /** Удалить добычу ОТЛИЧАЕТСЯ ОТ МЕТОДА В СПИСКЕ ВРАГОВ
     * 
     * @param {number|string} id 
     */
    static delete(id) {
        this.getOne(id)?.element.remove();
        this.#all.delete(parseInt(id));
    }

    static getCounter() {
        return {
            /** стартовое количество добычи на поле */
            counter: this.#counter,
            /** оставшееся количество добычи */
            map: this.#all.size
        }
    }

    // ##############################################
    /** Поведение предметов на поле */
    static actions() {
        this.#all.forEach(item => {
            if (item.fall === 0) item.fallDown();
        });
    }
}