/** Шаблон для списков предметов */
export class MainList {

    /** Список Предметов
     * @type { Map<number, MainModel> }
     */
    static all = new Map()

    /** количество предметов, добавленных в список
     * @type {number}
     */
    static counter = 0

    /** Создать список 
     * @param {string} dataType тип предмета 
    */
    static makeList(dataType) {
        document.querySelectorAll(`[data-type='${dataType}']`).forEach(element => {
            this.set(element)
        });
    }

    /** Получить список всех предметов
     * 
     * @returns {Map<number, MainModel>}
     */
    static getAll() {
        return this.all
    }

    /** Получить один предмет по его идентификатору
     * 
     * @param {number|string} id 
     * @returns {MainModel | undefined}
     */
    static getOne(id) {
        return this.all.get(parseInt(id))
    }

    /** Удалить предмет из списка, по его идентификатору
     * 
     * @param {number|string} id 
     */
    static delete(id) {
        this.all.delete(parseInt(id))
    }

    /** Получить стартовое и текущее количество предметов на поле
     * 
     * @returns {counter: number, map: number}
     */
    static getCounter() {
        return { counter: this.counter, map: this.all.size }
    }
}