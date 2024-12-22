// import { CellList } from "../../Lists/CellList.js";
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

    /** Текущая родительская клетка */
    cell!: CellModel

    /** Быстрый доступ к списку всех объектов данного типа */
    list!: ItemList

    /** Создание новой модели Объекта/предмета */
    constructor(element: HTMLDivElement, id: ID) {
        super(element, id);

        // Object.setPrototypeOf(this, MainModel.prototype)
    }

    /** Начальная инициализация клетки */
    cellInit(cell: CellModel): void {
        if (!this.cell) {
            this.cell = cell;
            cell.itemSet(this);
        }
    }

    /** Получить координаты предмета */
    getCoordinates(): ICoordinates {
        return {
            row: this.cell.row,
            col: this.cell.col
        }
    }

    /** Переместить предмет в указанную клетку */
    pushToCell(cell: CellModel): void {
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
    remove(): void {
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