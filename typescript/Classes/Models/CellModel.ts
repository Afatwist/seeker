import { MainModel } from "./MainModels/MainModel.js"
import { PlayerModel, Player } from "./PlayerModel.js"
import { EnemyModel } from "./EnemyModel.js"
import { LootModel } from "./LootModel.js"
import { StoneModel } from "./StoneModel.js"


/** Клетка на поле.
 * 
 * На клетке может находится только ОДИН предмет или игрок. 
 */
export class CellModel extends MainModel {
    /** Ряд клетки */
    row: number

    /** Колонка клетки */
    col: number

    /** Тип клетки (ее dataset.type) */
    type: CellType

    /** Предмет в клетке */
    item: null | PlayerModel | EnemyModel | StoneModel | LootModel

    /** Создание экземпляра клетки
     * 
     * @param {HTMLDivElement} cell 
     * @param {number} row
     * @param {number} col 
     */
    constructor(cell: HTMLDivElement, row: number, col: number) {

        super(cell, CellModel.idMaker(row, col));
        this.row = row;
        this.col = col;
        this.type = cell.dataset.type as CellType;
        this.element = cell;
        this.item = null
    }

    /** Проверяет, что клетка существует и пуста, 
     * т.е у нее тип 'free' и в ней нет других предметов или игрока
     */
    isFree(): boolean {
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
    static idMaker(row: string | number, col: string | number): string {
        return `row_${row}#col_${col}`;
    }

    /** Задать новый dataset.type 
     * @param {CellType} value 
     */
    setType(value: CellType): void {
        this.element.dataset.type = value;
        this.type = value;
    }

    //################ Операции с предметами в клетке #################

    /** Проверяет наличие игрока в клетке */
    hasPlayer(): boolean {
        return this.item === Player;
    }

    /** Проверяет наличие предмета в клетке */
    itemHas(): boolean {
        return this.item ? true : false
    }

    /** Возвращает предмет из клетки, если он есть */
    itemGet(): PlayerModel | EnemyModel | StoneModel | LootModel | null {
        return this.item
    }

    /** Удалить предмет из клетки, а так же из DOM*/
    itemRemove(): void {
        this.item?.element?.remove()
        this.item = null;
        //this.itemGet()?.remove()
    }

    /** Поместить предмет в клетку */
    itemSet(item: any): void {

        if (!this.itemHas()) {
            item.cell.item = null
            this.element.appendChild(item.element);
            this.item = item;

        } else {
            console.error(this, item, 'в этой клетке уже есть предмет!');
        }
    }
}