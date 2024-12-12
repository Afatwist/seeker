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
    constructor(loot, id, cell) {
        super(loot, id, 120);
        this.cellInit(cell);
    }

    //#################################################################################
    /** Падение предмета
     * 
     * @returns {void}
     */
    fallDown() {
        // проверка, что предмет все еще существует
        if (!this.element || !LootList.getOne(this.id)) {
            console.error('такого лута уже нет', this, LootList.getOne(this.id));
            return;
        }
        super.fallDown();
    }
}