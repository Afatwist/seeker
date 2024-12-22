// import { CellList } from "./CellList.js";
import { CellModel } from "../Models/CellModel.js";
import { StoneModel } from "../Models/StoneModel.js";

/** Список камней на поле */
export class StoneList {

    /** список Камней */
    static #all: Map<ID, StoneModel> = new Map()

    /** количество камней, добавленной в список */
    static #counter: number = 0


    /** Добавить камень в список 
     * @param stone HTML-элемент Камня
     * @param cell модель Клетки
     */
    static set(stone: HTMLDivElement, cell: CellModel): void {
        const item = new StoneModel(stone, this.#counter, cell);
        this.#all.set(item.id, item);
        this.#counter++
    }

    /** Получить полный список камней на поле */
    static getAll(): Map<ID, StoneModel> {
        return this.#all
    }

    /** Получить Камень по ID 
     * @param id ID камня в списке
     */
    static getOne(id: ID): StoneModel | undefined {
        return this.#all.get(parseInt(id as string))
    }

    /** Удалить Камень ОТЛИЧАЕТСЯ ОТ МЕТОДА В СПИСКЕ ВРАГОВ 
     * @param id ID Камня 
     */
    static delete(id: ID): void {
        this.#all.delete(parseInt(id as string));
    }

    /** Получить счетчик Камней
     * * counter - количество камней в начале игры
     * * map - текущее количество камней на поле
     */
    static getCounter(): { counter: number, map: number } {
        return { counter: this.#counter, map: this.#all.size }
    }


    /** Поведение предметов на поле */
    static actions(): void {
        this.#all.forEach(item => {
            // console.log(item)
            if (item.fall === 0) item.fallDown();
            ;
        })
    }
}