import { CellList } from "./CellList.js";
import { CellModel } from "../Models/CellModel.js";
import { StoneModel } from "../Models/StoneModel.js";

/** Список камней на поле */
export class StoneList {

    /** список добычи
     * @type { Map<number, StoneModel> }
     */
    static #all = new Map()

    /** количество добычи, добавленной в список
     * @type {number}
     */
    static #counter = 0

    /** Создать список добычи */
    static makeList() {
        Array.from(document.querySelectorAll("[data-type='hurdle']")).reverse().forEach(hurdle => {
            this.#set(hurdle)
        });
    }

    /** Добавить добычу в список
     * 
     * @param {Element} stone
     */
    static #set(stone) {
        const item = new StoneModel(stone, this.#counter);
        this.#all.set(item.id, item);
        this.#counter++
    }

    /** Получить полный список добычи на поле
     * 
     * @returns { Map<number, StoneModel> }
     */
    static getAll() {
        return this.#all
    }

    /**
     * 
     * @param {number|string} id 
     * @returns {StoneModel|undefined}
     */
    static getOne(id) {
        return this.#all.get(parseInt(id))
    }

    /** Удалить добычу ОТЛИЧАЕТСЯ ОТ МЕТОДА В СПИСКЕ ВРАГОВ
     * 
     * @param {number|string} id 
     */
    static delete(id) {
        this.#all.delete(parseInt(id))
    }

    // static getCounter() {
    //     return {
    //         /** стартовое количество добычи на поле */
    //         counter: this.#counter,
    //         /** оставшееся количество добычи */
    //         map: this.#all.size
    //     }
    // }


    /** Поведение предметов на поле */
    static actions() {
        this.#all.forEach(item => {
            // console.log(item)
            if (item.fall === 0) item.fallDown();
            ;
        })
    }
}