import { CellList } from "../Lists/CellList.js";
import { LootList } from "../Lists/LootList.js";
import { CellModel } from "./CellModel.js"
import { LootModel } from "./LootModel.js";
import { StoneModel } from "./StoneModel.js";

export class PlayerModel {

    /** HTML-элемент игрока на поле
     * @type {HTMLDivElement|undefined}
     */
    static element = undefined;

    /** Живой или нет игрок
     * @type {boolean}
     */
    static alive = true;

    /** Текущая родительская клетка
     * @type {CellModel}
     */
    static cell

    /** Ряд, в котором находится игрок 
     * @type {number}
     */
    static row

    /** Колонка, в которой находится игрок 
     * @type {number}
     */
    static col

    /** Инициализация фишки игрока
     * @param {CellModel} cellModel 
     */
    static init(cellModel) {
        this.element = document.createElement('div');
        this.element.classList.add('item', 'player');


        this.cell = cellModel;
        cellModel.itemSet(this);

        this.row = this.cell.row;
        this.col = this.cell.col;
    }

    //###########################################################################
    //###########################################################################

    /** Переход по указанным координатам
     * 
     * @param {{ playerC: { row: number, col: number },
     *  stoneC: { row: number, col: number }} playerCoords 
     */
    static goTo(playerCoords) {
        const { playerC, stoneC } = playerCoords;

        let cell = CellList.getOne(playerC.row, playerC.col);

        if (cell) {

            if (cell.itemHas()) {
                // клетки с предметами
                /** предмет в клетке */
                const item = cell.itemGet();
                // console.log(item, cell);

                // Клетки с сокровищем
                if (item instanceof LootModel) {
                    LootList.delete(item.id);
                    cell.itemRemove();
                    this.pushToCell(cell);
                }

                // Клетки с камнями
                if (item instanceof StoneModel) {
                    let cellNext = CellList.getOne(stoneC.row, stoneC.col);

                    if (cellNext?.isFree()) {
                        item.pushToCell(cellNext);
                        this.pushToCell(cell);
                    } else {
                        // камень невозможно сдвинуть
                        cell.classAddTemp(['item-not-moving']);
                    }
                }
            }

            // Пустая клетка
            if (cell.isFree()) this.pushToCell(cell);

            // Клетка с "Землей"
            if (cell.type === 'ground') {
                cell.classReplace(['ground'], ['free']);
                cell.element.dataset.type = 'free';
                cell.type = 'free';
                this.pushToCell(cell);
            }

            // Клетка-Стена
            if (cell.type === 'wall') cell.classAddTemp(['wall-border-red']);

            // Клетка Старт
            if (cell.type === 'start') {
                cell.element.append(this.element);
            }

            // Клетка Финиш-открыт
            if (cell.type === 'finish-open') {
                cell.element.append(this.element);
            }

            // Клетка Финиш-закрыт
            if (cell.type === 'finish-close') cell.classAddTemp(['wall-border-red']);
        }
    }

    /** Переместить игрока в указанную клетку, обновить значения координат игрока
     * 
     * @param {CellModel} cell 
     */
    static pushToCell(cell) {
        this.cell.item = null;
        cell.itemSet(this);
        this.cell = cell;
        this.row = cell.row;
        this.col = cell.col;
    }

    /** Возвращает координаты клетки игрока
     * 
     * @returns {{ row: number, col: number }}
     */
    static getCoordinates() {
        return {
            row: this.row,
            col: this.col
        }
    }

    /** Гибель игрока
     * !!! оптимизировать метод!!!
     * 
     */
    static die() {
        this.cell.type = 'die';
        this.cell.classReplace(['free'], ['player-die']);
        this.element.remove();
        this.alive = false;
    }
}