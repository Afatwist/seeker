import { EnemyList } from "../../Lists/EnemyList.js";
import { LootList } from "../../Lists/LootList.js";
import { StoneList } from "../../Lists/StoneList.js";
import { MainModel } from "./MainModel.js";
export class ObjectModel extends MainModel {
    cell;
    list;
    constructor(element, id) {
        super(element, id);
    }
    cellInit(cell) {
        if (!this.cell) {
            this.cell = cell;
            cell.itemSet(this);
        }
    }
    getCoordinates() {
        return {
            row: this.cell.row,
            col: this.cell.col
        };
    }
    pushToCell(cell) {
        this.cell.item = null;
        cell.itemSet(this);
        this.cell = cell;
    }
    remove() {
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
//# sourceMappingURL=ObjectModel.js.map