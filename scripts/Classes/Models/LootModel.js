import { CellList } from "../Lists/CellList.js";
import { LootList } from "../Lists/LootList.js";
import { StoneList } from "../Lists/StoneList.js"; //?? при удалении возникает ошибка!!!
import { FallingModel } from "./MainModels/FallingModel.js";



export class LootModel extends FallingModel {

    list = 'loot';

    /**
     * @param {HTMLDivElement} loot 
     * @param {number} id 
     */
    constructor(loot, id) {
        super(loot, id, 120)

    }

    //#################################################################################
    /** Падение предмета
     * 
     * @returns {void}
     */
    fallDown() {
        // проверка, что предмет все еще существует
        if (!this.element || !LootList.getOne(this.id)) {
            console.error(this, LootList.getOne(this.id));
            return;
        }
        super.fallDown();
    }



    /** Падение предмета
     * 
     * @returns {void}
     */
    fallDownQQ() { // !!! старый метод
        // Предмет падает в клетку под собой, если она пустая. 
        // Если клетка с типом земля или стена, то предмет останавливается в текущей клетке.
        // Если в клетке другой предмет, то проверяются боковые клетки от предмета, 
        // если они свободны, предмет может скатиться вниз по диагонали.

        // проверка, что предмет все еще существует
        if (!this.element || !LootList.getOne(this.id)) {
            console.error(this, LootList.getOne(this.id));
            return;
        }

        let { row, col } = this.getCoordinates();

        // клетка под предметом, для падения вниз 
        let cellBottom = CellList.getOne(row + 1, col);

        if (!cellBottom) {
            this.fall = 0;
            return;
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