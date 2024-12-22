import { CellList } from "../Lists/CellList.js";
import { LootList } from "../Lists/LootList.js";
import { LootModel } from "./LootModel.js";
import { StoneModel } from "./StoneModel.js";
export class PlayerModel {
    element = undefined;
    alive = true;
    cell;
    row;
    col;
    init(cellModel) {
        this.element = document.createElement('div');
        this.element.classList.add('item', 'player');
        this.cell = cellModel;
        cellModel.itemSet(this);
        this.row = this.cell.row;
        this.col = this.cell.col;
    }
    goTo(playerCoords) {
        const { playerC, stoneC } = playerCoords;
        let cell = CellList.getOne(playerC.row, playerC.col);
        if (cell) {
            if (cell.itemHas()) {
                const item = cell.itemGet();
                if (item instanceof LootModel) {
                    LootList.delete(item.id);
                    cell.itemRemove();
                    this.pushToCell(cell);
                }
                if (item instanceof StoneModel) {
                    let cellNext = CellList.getOne(stoneC.row, stoneC.col);
                    if (cellNext?.isFree()) {
                        item.pushToCell(cellNext);
                        this.pushToCell(cell);
                    }
                    else {
                        cell.classAddTemp(['item-not-moving']);
                    }
                }
            }
            if (cell.isFree())
                this.pushToCell(cell);
            if (cell.type === 'ground') {
                cell.classReplace(['ground'], ['free']);
                cell.element.dataset.type = 'free';
                cell.type = 'free';
                this.pushToCell(cell);
            }
            if (cell.type === 'wall')
                cell.classAddTemp(['wall-border-red']);
            if (cell.type === 'start') {
                cell.element.append(this.element);
            }
            if (cell.type === 'finish-open') {
                cell.element.append(this.element);
            }
            if (cell.type === 'finish-close')
                cell.classAddTemp(['wall-border-red']);
        }
    }
    pushToCell(cell) {
        this.cell.item = null;
        cell.itemSet(this);
        this.cell = cell;
        this.row = cell.row;
        this.col = cell.col;
    }
    getCoordinates() {
        return {
            row: this.row,
            col: this.col
        };
    }
    die() {
        this.cell.type = 'die';
        this.cell.classReplace(['free'], ['player-die']);
        this.element.remove();
        this.alive = false;
    }
}
export const Player = new PlayerModel;
//# sourceMappingURL=PlayerModel.js.map