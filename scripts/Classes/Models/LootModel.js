import { LootList } from "../Lists/LootList.js";
import { StoneList } from "../Lists/StoneList.js";
import { FallingModel } from "./MainModels/FallingModel.js";
export class LootModel extends FallingModel {
    list = 'loot';
    constructor(loot, id, cell) {
        super(loot, id, 120);
        this.cellInit(cell);
    }
    fallDown() {
        if (!this.element || !LootList.getOne(this.id)) {
            console.error('такой добычи уже нет', this, LootList.getOne(this.id));
            return;
        }
        super.fallDown();
    }
}
if (false) {
    StoneList.getOne(0);
}
//# sourceMappingURL=LootModel.js.map