import { MainModel } from "../../Models/MainModels/MainModel.js";

/** Шаблон для списков предметов */
export class MainList {

    /** Список Предметов */
    protected static all: Map<ID, MainModel> = new Map()

    /** количество предметов, добавленных в список */
    protected static counter: number = 0

    /** Создать список 
     * @param {string} dataType тип предмета 
    */
    static makeList(dataType: string) {
        document.querySelectorAll(`[data-type='${dataType}']`).forEach(element => {
            console.log(element);

            // this.set(element)
        });
    }


    /** Получить список всех предметов */
    static getAll(): Map<ID, MainModel> {
        return this.all
    }

    /** Получить один предмет по его идентификатору
     * @param id ID предмета
     */
    static getOne(id: ID): MainModel | undefined {
        return this.all.get(parseInt(id as string));
    }

    /** Удалить предмет из списка, по его идентификатору 
     * @param id ID  предмета
     */
    static delete(id: ID) {
        this.all.delete(parseInt(id as string))
    }

    /** Получить счетчик Камней
     * * counter - количество камней в начале игры
     * * map - текущее количество камней на поле
     */
    static getCounter(): { counter: number, map: number } {
        return { counter: this.counter, map: this.all.size }
    }
}