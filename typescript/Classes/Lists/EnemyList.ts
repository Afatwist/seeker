import { CellModel } from "../Models/CellModel.js";
import { EnemyModel } from "../Models/EnemyModel.js"


/** Список всех врагов на поле */
export class EnemyList {

    /** список врагов */
    static #all: Map<ID, EnemyModel> = new Map()

    /** количество врагов, добавленных в список */
    static #counter: number = 0


    /** Добавить врага в список
     * 
     * @param enemy HTML-элемент врага
     * @param cell Модель клетки
     */
    static set(enemy: HTMLDivElement, cell: CellModel): void {
        const item = new EnemyModel(enemy, this.#counter, cell);
        this.#all.set(item.id, item);
        this.#counter++
    }

    /** Получить список всех врагов */
    static getAll(): Map<ID, EnemyModel> {
        return this.#all
    }

    /** Получить одного врага по его идентификатору 
     * @param id ID врага 
     */
    static getOne(id: ID): EnemyModel | undefined {
        return this.#all.get(parseInt(id as string))
    }

    /** Удалить врага из списка, по его идентификатору 
     * @param id ID врага
     */
    static delete(id: ID): void {
        this.#all.delete(parseInt(id as string));
    }

    /** Получить счетчик Врагов
     * * counter - количество врагов в начале игры
     * * map - текущее количество врагов на поле
     */
    static getCounter(): { counter: number, map: number } {
        return { counter: this.#counter, map: this.#all.size }
    }

    /** Активировать всех врагов на поле */
    static actions(): void {
        this.#all.forEach(enemy => {
            enemy.distanceUpdate();
            enemy.picChanger();
            if (!enemy.active) enemy.activity();
        });
    }
}