import { CellModel } from "../Models/CellModel.js";

/** Список всех клеток на поле */
export class CellList {

    /** Полный список всех клеток на поле
     * @type {Map<string, CellModel>} 
     * - string - id клетки 
     * - CellModel - объект содержащий данные клетки и сам HTMLElement клетки
     */
    static #all = new Map();

    /** клетка Финиш
     * @type {CellModel | null}
     */
    static finish = null;

    /** Добавить клетку в список
     * 
     * @param {HTMLDivElement} cell
     * @param {number} row
     * @param {number} col  
     * @returns {CellModel}
     * 
     */
    static set(cell, row, col) {
        const item = new CellModel(cell, row, col);
        this.#all.set(item.id, item);

        if (item.type === 'finish-open' || item.type === 'finish-close') this.finish = item;
        return item;
    }

    /** Полный список всех клеток на поле
     * @type {Map<string, CellModel>} 
     * - string - id клетки 
     * - CellModel - объект содержащий данные клетки и сам HTMLElement клетки
     */
    static getAll() {
        return this.#all;
    }

    /** Возвращает CellModel с указанными координатами
     * 
     * @param {string|number} row номер ряда
     * @param {string|number} col номер колонки
     * @returns {CellModel | undefined}
     */
    static getOne(row, col) {
        return this.#all.get(CellModel.idMaker(row, col));
    }

    /** Возвращает Набор клеток: [верхнюю, нижнюю, левую, правую]
     * относительно текущих координат
     * @param {number} row 
     * @param {number} col 
     * @returns {CellModel[]}
     */
    static getSetCross(row, col) {
        return [
            this.getOne(row - 1, col),
            this.getOne(row + 1, col),
            this.getOne(row, col - 1),
            this.getOne(row, col + 1)
        ].filter(cell => cell instanceof CellModel);
    }

    /** Возвращает Набор клеток в виде квадрата 3*3 с текущей клеткой в центре
     * @param {number} row 
     * @param {number} col 
     * @returns {CellModel[]}
     * 
     */
    static getSetSquare(row, col) {
        // координаты клеток
        // -1,-1    -1,0   -1,+1
        //  0,-1     0,0    0,+1
        //  +1,-1   +1,0   +1,+1
        return [
            this.getOne(row - 1, col - 1),
            this.getOne(row - 1, col),
            this.getOne(row - 1, col + 1),

            this.getOne(row, col - 1),
            this.getOne(row, col),
            this.getOne(row, col + 1),

            this.getOne(row + 1, col - 1),
            this.getOne(row + 1, col),
            this.getOne(row + 1, col + 1)
        ].filter(cell => cell instanceof CellModel);
    }

    /** Возвращает предмет на поле по указанным координатам если он есть
     * !!! удалить
     * @param {number | string} row
     * @param {number | string} col
     * @returns {HTMLDivElement | false}
     */
    static ___itemGet(row, col) {
        let cell = this.getOne(row, col);
        return cell && cell.element.hasChildNodes() ?
            cell.element.childNodes[0] :
            false
    }

    /** Кратчайшее расстояние между клетками
     * 
     * @param {{row:number, col:number}} coord_1 
     * @param {{row:number, col:number}} coord_2 
     * @returns {number}
     */
    static distance(coord_1, coord_2) {
        return Math.floor(Math.hypot(coord_1.row - coord_2.row, coord_1.col - coord_2.col));
    }

    //!!! удалить после тестов
    /** Временный метод
     * 
     * Проверяет что предмет в клетке на поле и в свойстве клетки item совпадают
     */
    static cellChecker() {
        this.#all.forEach(cell => {
            let item = cell.item?.element;
            let child = cell.element.children[0]

            if (item !== child) {
                console.error('ошибка в клетке', cell, 'предмет', item, 'html-элемент в клетке', child)
            }
        })
    }
}