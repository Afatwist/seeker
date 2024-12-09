import { MainModel } from "./MainModels/MainModel.js"
import { PlayerModel as Player } from "./PlayerModel.js"
import { EnemyModel } from "./EnemyModel.js"
import { LootModel } from "./LootModel.js"
import { StoneModel } from "./StoneModel.js"


/** Клетка на поле.
 * 
 * На клетке может находится только ОДИН предмет или игрок.
 * 
 */
export class CellModel extends MainModel {
    /** Ряд клетки
     * @type {number}
     */
    row

    /** Колонка клетки
     * @type {number}
     */
    col

    /** Тип клетки (ее dataset.type)
     * @type {string}
     */
    type

    /** Предмет в клетке
     * @type {null|Player|EnemyModel|StoneModel|LootModel}
     */
    item

    /** Создание экземпляра клетки
     * 
     * @param {HTMLDivElement} cell 
     */
    constructor(cell) {
        let elemRow = parseInt(cell.dataset.row);
        let elemCol = parseInt(cell.dataset.col);

        super(cell, CellModel.idMaker(elemRow, elemCol));

        this.row = elemRow;
        this.col = elemCol;
        this.type = cell.dataset.type;
        this.element = cell;
        this.item = null
    }

    //!!! удалить
    /** Получить координаты клетки
     *  
     * @returns {{ 
     * row: number;
     * col: number; 
     * }}
     */
    __getCoordinates() {
        return {
            row: this.row,
            col: this.col
        }
    }

    /** Проверяет, что клетка существует и пуста, 
     * т.е у нее тип 'free' и в ней нет других предметов или игрока
     * 
     * @returns {boolean}
     */
    isFree() {
        if (!this) return false;
        if (!['free', 'start', 'finish-close', 'finish-open'].includes(this.type)) return false;
        if (this.itemHas()) return false;
        return true
    }

    /** Генерирует ID по указанным координатам
     * 
     * @param {string|number} row номер ряда
     * @param {string|number} col номер колонки
     * @returns {string}
     */
    static idMaker(row, col) {
        return `row_${row}#col_${col}`;
    }

    /** Задать новый dataset.type 
     * @param {string} value 
     */
    setType(value) {
        this.element.dataset.type = value
        this.type = value
    }

    //################ Операции с предметами в клетке #################

    /** Проверяет наличие игрока в клетке
     * @returns {boolean} 
     */
    hasPlayer() {
        return this.item === Player;
    }

    /** Проверяет наличие предмета в клетке
     * 
     * @returns {boolean}
     */
    itemHas() {
        return this.item ? true : false
    }

    /** Возвращает предмет из клетки, если он есть
     * 
     * @returns {Player|EnemyModel|StoneModel|LootModel|null}
     */
    itemGet() {
        return this.item
    }

    /** Удалить предмет из клетки, а так же из DOM*/
    itemRemove() {
        this.item?.element?.remove()
        this.item = null;
        //this.itemGet()?.remove()
    }

    /** Поместить предмет в клетку
     * 
     * @param {Player|EnemyModel|StoneModel|LootModel} item 
     */
    itemSet(item) {

        if (!this.itemHas()) {
            item.cell.item = null
            this.element.appendChild(item.element);
            this.item = item;
        } else {
            console.error(this, item, 'в этой клетке уже есть предмет!');
        }
    }
}