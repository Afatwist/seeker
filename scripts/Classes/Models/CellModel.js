import { MainModel } from "./MainModels/MainModel.js";
import { Player } from "./PlayerModel.js";
export class CellModel extends MainModel {
    row;
    col;
    type;
    item;
    constructor(cell, row, col) {
        super(cell, CellModel.idMaker(row, col));
        this.row = row;
        this.col = col;
        this.type = cell.dataset.type;
        this.element = cell;
        this.item = null;
    }
    isFree() {
        if (!this)
            return false;
        if (!['free', 'start', 'finish-close', 'finish-open'].includes(this.type))
            return false;
        if (this.itemHas())
            return false;
        return true;
    }
    static idMaker(row, col) {
        return `row_${row}#col_${col}`;
    }
    setType(value) {
        this.element.dataset.type = value;
        this.type = value;
    }
    hasPlayer() {
        return this.item === Player;
    }
    itemHas() {
        return this.item ? true : false;
    }
    itemGet() {
        return this.item;
    }
    itemRemove() {
        this.item?.element?.remove();
        this.item = null;
    }
    itemSet(item) {
        if (!this.itemHas()) {
            item.cell.item = null;
            this.element.appendChild(item.element);
            this.item = item;
        }
        else {
            console.error(this, item, 'в этой клетке уже есть предмет!');
        }
    }
}
//# sourceMappingURL=CellModel.js.map