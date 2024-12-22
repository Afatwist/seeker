import { Game } from "../../../game/Game.js";
import { CellList } from "../../Lists/CellList.js";
import { ListsActivator } from "../../Lists/HelperForList.js";
import { EnemyModel } from "../EnemyModel.js";
import { Player } from "../PlayerModel.js";
import { StoneModel } from "../StoneModel.js";
import { ObjectModel } from "./ObjectModel.js";
export class FallingModel extends ObjectModel {
    fall;
    fallSpeed;
    constructor(element, id, fallSpeed) {
        super(element, id);
        this.fall = 0;
        this.fallSpeed = fallSpeed;
    }
    fallStep(targetCell) {
        this.fall += 1;
        this.pushToCell(targetCell);
        setTimeout(() => {
            if (Game.pause || !Player.alive) {
                this.fall = 0;
                return;
            }
            ;
            this.fallDown();
        }, this.fallSpeed);
        ListsActivator();
    }
    rightSideCell(row, col) {
        let right = CellList.getOne(row, col + 1);
        let rightBottom = CellList.getOne(row + 1, col + 1);
        return right?.isFree() && rightBottom?.isFree() ? rightBottom : false;
    }
    leftSideCell(row, col) {
        let left = CellList.getOne(row, col - 1);
        let leftBottom = CellList.getOne(row + 1, col - 1);
        return left?.isFree() && leftBottom?.isFree() ? leftBottom : false;
    }
    fallDown() {
        let { row, col } = this.getCoordinates();
        let cellBottom = CellList.getOne(row + 1, col);
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
        let hasCellBottomItem = cellBottom.itemHas() && !cellBottom.hasPlayer();
        if (cellBottom.isFree())
            this.fallStep(cellBottom);
        else if (rightBottom && hasCellBottomItem)
            this.fallStep(rightBottom);
        else if (leftBottom && hasCellBottomItem)
            this.fallStep(leftBottom);
        else
            this.fall = 0;
    }
}
//# sourceMappingURL=FallingModel.js.map