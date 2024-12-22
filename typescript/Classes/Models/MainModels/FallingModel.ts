import { Game } from "../../../game/Game.js";
import { CellList } from "../../Lists/CellList.js";
import { ListsActivator } from "../../Lists/HelperForList.js";
// import { LootList } from "../../Lists/LootList.js";
// import { StoneList } from "../../Lists/StoneList.js";
import { CellModel } from "../CellModel.js";
import { EnemyModel } from "../EnemyModel.js";
import { Player } from "../PlayerModel.js";
import { StoneModel } from "../StoneModel.js";
import { ObjectModel } from "./ObjectModel.js";

/** Родительский класс для классов падающих предметов:
 * * Камни
 * * Добыча
 */
export class FallingModel extends ObjectModel {

    /** Количество клеток, которые пролетел предмет */
    fall: number

    /** Время в миллисекундах, за которое предмет падает в следующую клетку.
     * Чем меньше число, тем быстрее падение.
     */
    fallSpeed: number

    /** Создание падающей модели: камни или добыча
     * @param element 
     * @param id - id объекта в соответствующем списке
     * @param fallSpeed - Время в миллисекундах, за которое предмет падает в следующую клетку.
     * Чем меньше число, тем быстрее падение
     */
    constructor(element: HTMLDivElement, id: ID, fallSpeed: number) {
        super(element, id);
        this.fall = 0;
        this.fallSpeed = fallSpeed;
    }

    /** Перемещение предмета в указанную клетку */
    fallStep(targetCell: CellModel): void {
        this.fall += 1;
        this.pushToCell(targetCell);

        setTimeout(() => {
            if (Game.pause || !Player.alive) {
                this.fall = 0;
                return
            };
            this.fallDown()

        }, this.fallSpeed);

        ListsActivator();
    }

    /** Получить клетку для скатывания направо 
     * @param row - ряд предмета
     * @param col - колонка предмета
     */
    rightSideCell(row: number, col: number): CellModel | false {
        let right = CellList.getOne(row, col + 1);
        let rightBottom = CellList.getOne(row + 1, col + 1);

        return right?.isFree() && rightBottom?.isFree() ? rightBottom : false;

    }

    /** Получить клетку для скатывания налево
     * @param {number} row - ряд предмета
     * @param {number} col - колонка предмета
     */
    leftSideCell(row: number, col: number): CellModel | false {
        let left = CellList.getOne(row, col - 1);
        let leftBottom = CellList.getOne(row + 1, col - 1);

        return left?.isFree() && leftBottom?.isFree() ? leftBottom : false;
    }

    /** Падение предмета */
    fallDown(): void {
        // Предмет падает в клетку под собой, если она пустая. 
        // Если клетка с типом земля или стена, то предмет останавливается в текущей клетке.
        // Если в летке враг или игрок, предмет убивает его, при условии, что высота падения более 1 клетки. (this.fall)
        // Если в клетке другой предмет, то проверяются боковые клетки от предмета, если они свободны, предмет может скатиться вниз по диагонали.

        let { row, col } = this.getCoordinates();

        // клетка под предметом, для падения вниз 
        let cellBottom: CellModel | undefined = CellList.getOne(row + 1, col);

        if (!cellBottom) {
            this.fall = 0;
            return;
        }

        if (this instanceof StoneModel) {
            if (cellBottom.itemHas() && this.fall > 1) {
                let item = cellBottom.itemGet();
                if (item === Player) {
                    Player.die();
                    return;
                }
                if (item instanceof EnemyModel) {
                    item.die();
                    return;
                }
            }
        }

        let rightBottom = this.rightSideCell(row, col);

        let leftBottom = this.leftSideCell(row, col);

        // предмет лежит на другом предмете, т.е в клетке под предметом что-то есть, но не игрок
        let hasCellBottomItem = cellBottom.itemHas() && !cellBottom.hasPlayer();

        // падение предмета
        if (cellBottom.isFree()) this.fallStep(cellBottom);
        else if (rightBottom && hasCellBottomItem) this.fallStep(rightBottom);
        else if (leftBottom && hasCellBottomItem) this.fallStep(leftBottom);
        else this.fall = 0;
    }
}