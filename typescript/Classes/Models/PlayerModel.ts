import { CellList } from "../Lists/CellList.js";
import { LootList } from "../Lists/LootList.js";
import { CellModel } from "./CellModel.js"
import { LootModel } from "./LootModel.js";
import { StoneModel } from "./StoneModel.js";

export class PlayerModel {

    /** HTML-элемент игрока на поле   */
    element: HTMLDivElement | undefined = undefined;

    /** Живой или нет игрок */
    alive: boolean = true;

    /** Текущая родительская клетка */
    cell: CellModel | undefined

    /** Ряд, в котором находится игрок */
    row: number | undefined

    /** Колонка, в которой находится игрок */
    col: number | undefined

    /** Инициализация фишки игрока
     * @param {CellModel} cellModel 
     */
    init(cellModel: CellModel): void {
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
    goTo(playerCoords: { playerC: ICoordinates, stoneC: ICoordinates }): void {
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
                cell.element.append(this.element as Node);
            }

            // Клетка Финиш-открыт
            if (cell.type === 'finish-open') {
                cell.element.append(this.element as Node);
            }

            // Клетка Финиш-закрыт
            if (cell.type === 'finish-close') cell.classAddTemp(['wall-border-red']);
        }
    }

    /** Переместить игрока в указанную клетку, обновить значения координат игрока
     * 
     * @param {CellModel} cell 
     */
    pushToCell(cell: CellModel): void {
        this.cell!.item = null;
        cell.itemSet(this);
        this.cell = cell;
        this.row = cell.row;
        this.col = cell.col;
    }

    /** Возвращает координаты клетки игрока */
    getCoordinates(): ICoordinates {
        return {
            row: this.row!,
            col: this.col!
        }
    }

    /** Гибель игрока
     * !!! оптимизировать метод!!!
     * 
     */
    die(): void {
        this.cell!.type = 'die';
        this.cell!.classReplace(['free'], ['player-die']);
        this.element!.remove();
        this.alive = false;
    }
}

/** Фишка Игрока */
export const Player = new PlayerModel;