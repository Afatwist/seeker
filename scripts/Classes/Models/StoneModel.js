import { CellList } from "../Lists/CellList.js";
import { StoneList } from "../Lists/StoneList.js";
import { EnemyModel } from "./EnemyModel.js";
import { FallingModel } from "./MainModels/FallingModel.js";
import { PlayerModel as Player } from "./PlayerModel.js";

/** Класс Камней.
 * 
 * Камень при падении с большой высоты может убить Игрока или Врага.
 * 
 * Для этого Камень должен пролететь минимум 2 клетки перед ударом.
 * 
 */
export class StoneModel extends FallingModel {

    list = 'stone';

    /**
     * @param {HTMLDivElement} element 
     * @param {number} id 
     */
    constructor(element, id) {
        super(element, id, 120);
    }

    /** Падение предметов */
    fallDown() {
        // проверка, что предмет все еще существует
        if (!this.element || !StoneList.getOne(this.id)) {
            console.error(this, StoneList.getOne(this.id));
            return;
        }
        super.fallDown();
    }

    /** Падение предметов */ //!!! Старый метод
    fallDownQQ() {
        // Предмет падает в клетку под собой, если она пустая. 
        // Если клетка с типом земля или стена, то предмет останавливается в текущей клетке.
        // Если в летке враг или игрок, предмет убивает его, при условии, что высота падения более 1 клетки. (dataset.fall)
        // Если в клетке другой предмет, то проверяются боковые клетки от предмета, если они свободны, предмет может скатиться вниз по диагонали.

        // проверка, что предмет все еще существует
        if (!this.element || !StoneList.getOne(this.id)) {
            console.error(this, StoneList.getOne(this.id));
            return;
        }

        let { row, col } = this.getCoordinates();

        // клетка под предметом, для падения вниз 
        let cellBottom = CellList.getOne(row + 1, col);

        if (!cellBottom) {
            this.fall = 0;
            return;
        }


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