import { CellList } from "../../Lists/CellList.js";
import { EnemyList } from "../../Lists/EnemyList.js";
import { LootList } from "../../Lists/LootList.js";
import { StoneList } from "../../Lists/StoneList.js";
import { CellModel } from "../CellModel.js";
import { MainModel } from "./MainModel.js";

/** Шаблон для предметов расположенных в клетках на поле.
 * 
 * Родительский класс для Падающих предметов (добыча и камни)
 */
export class ObjectModel extends MainModel {

    /** Текущая родительская клетка
     * @type {CellModel}
     */
    cell

    /** Быстрый доступ к списку всех объектов данного типа
     * @type {StoneList|LootList|EnemyList}
     */
    list

    /**
     * @param {HTMLDivElement} element 
     * @param {number | string} id 
     */
    constructor(element, id) {
        super(element, id)

        let { row, col } = element.parentElement.dataset;
        this.cell = CellList.getOne(row, col);

        this.cell.item = this;
    }

    /** Получить координаты предмета
     * 
     * @returns {{ row: number, col: number }}
     */
    getCoordinates() {
        return {
            row: this.cell.row,
            col: this.cell.col
        }
    }

    /** Переместить предмет в указанную клетку
     * 
     * @param {CellModel} cell 
     */
    pushToCell(cell) {
        this.cell.item = null;
        cell.itemSet(this);
        this.cell = cell;
    }

    /** Удаляет объект из соответствующего списка объектов
     * 
     * Удаляет HTML-элемент объекта из игрового поля
     * 
     * Задает родительской клетке объекта значение null для свойства item
     */
    remove() {
        setTimeout(() => this.element.remove(), 0);
        this.cell.item = null;

        switch (this.list) {
            case 'stone':
                StoneList.delete(this.id);
                break;
            case 'loot':
                LootList.delete(this.id);
                break;
            case 'enemy':
                EnemyList.delete(this.id);
                break;

            default:
                console.error('Неопознанный тип класса при удалении');
                break;
        }
    }
}