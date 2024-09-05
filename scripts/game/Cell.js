/** Класс Cell работает с клетками на игровом поле
 * @class Cell
 */
export class Cell {
    /** Экземпляр класса Cell,
     * для единственного экземпляра во всем приложении
     * (паттерн Singleton)
     * @type {Cell}
     */
    static #instance

    /** Все клетки на игровом поле
     * @type {NodeListOf<HTMLDivElement>}
     */
    #all

    /** Все клетки на поле в виде списка
     * @type {{"coordinates" : "cell"}}
     * - "coordinates" - координаты клетки в виде `row_${row}#col_${col}`
     * - "cell" - Element - клетка на поле
     */
    #list

    constructor() {
        if (Cell.#instance) return Cell.#instance;
        Cell.#instance = this;

        this.#all = document.querySelectorAll('.cell');
        this.#list = this.#makeCellsList();
    }

    /** Все клетки на игровом поле 
     * @returns {NodeListOf<Element>}
     */
    getAll() {
        return this.#all;
    }

    /** Все клетки на поле в виде списка
     * @type {{"coordinates" : "cell"}}
     * - "coordinates" - координаты клетки в виде `row_${row}#col_${col}`
     * - "cell" - Element - клетка на поле
     */
    getList() {
        return this.#list
    }

    /** Возвращает клетку из списка, если она там есть
     * @param {string | number} row 
     * @param {string | number} col 
     * @returns {Element | undefined}
     */
    getOne(row, col) {
        let key = this.#key(row, col);
        return this.#list[key];
    }

    /** Возвращает координаты указанной клетки
     * @param {Element} cell 
     * @returns {{row: number, col: number}}
     * - row - ряд
     * - col - колонка
     */
    getCoordinates(cell) {
        return {
            row: parseInt(cell?.dataset.row),
            col: parseInt(cell?.dataset.col),
        }
    }

    /** Проверяет, что клетка существует и пуста, 
     * т.е у нее тип 'free' и в ней нет других предметов или игрока
     * 
     * @param {Element | null} cell 
     * @returns {boolean}
     */
    isFree(cell) {
        if (!cell) return false
        if (!['free', 'start', 'finish-close', 'finish-open'].includes(cell.dataset.type)) return false
        if (cell.hasChildNodes()) return false

        return true
    }

    /** Возвращает предмет в клетке если он есть
     * 
     * @param {Element | null} cell 
     * @returns {HTMLDivElement | false}
     */
    innerItem(cell) {
        if (cell.hasChildNodes()) return cell.childNodes[0]
        return false
    }


    //############## Служебные методы #######################

    /** Список клеток */
    #makeCellsList() {
        const object = {};
        this.#all.forEach(cell => {
            let key = this.#key(cell.dataset.row, cell.dataset.col);
            object[key] = cell;
        });
        return object;
    }

    /** создает ключ для поиска клетки в списке 
     * @param {string|number} row 
     * @param {string | number} col 
     * @returns {string} координаты клетки
     */
    #key(row, col) {
        return `row_${row}#col_${col}`;
    }
}