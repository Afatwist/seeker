import { LootModel } from "../Models/LootModel.js";
// import { CellList } from "./CellList.js";
import { CellModel } from "../Models/CellModel.js";

/**
 * Список добычи на поле
 */
export class LootList {

    /** Список Добычи на поле */
    static #all: Map<ID, LootModel> = new Map();

    /** Количество Добычи, добавленной в список */
    static #counter: number = 0


    /** Добавить добычу в список 
     * @param loot - HTML-элемент Добычи
     * @param cell - модель Клетки
     */
    static set(loot: HTMLDivElement, cell: CellModel): void {
        const item = new LootModel(loot, this.#counter, cell);
        this.#all.set(item.id, item);
        this.#counter++
    }

    /** Получить полный список добычи на поле */
    static getAll(): Map<ID, LootModel> {
        return this.#all
    }

    /** Получить модель Добычи по ID
     * @param  id номер Добычи в списке
     */
    static getOne(id: ID): LootModel | undefined {
        return this.#all.get(parseInt(id as string))
    }

    /** Удалить добычу ОТЛИЧАЕТСЯ ОТ МЕТОДА В СПИСКЕ ВРАГОВ
     * 
     * @param id ID Добычи в списке 
     */
    static delete(id: ID): void {
        this.getOne(id)?.element.remove();
        this.#all.delete(parseInt(id as string));
    }

    /** Получить счетчик Добычи
     * * counter - количество добычи в начале игры
     * * map - текущее количество добычи на поле
     */
    static getCounter(): { counter: number, map: number } {
        return { counter: this.#counter, map: this.#all.size }
    }

    // ##############################################
    /** Поведение предметов на поле */
    static actions(): void {
        this.#all.forEach(item => {
            if (item.fall === 0) item.fallDown();
        });
    }
}