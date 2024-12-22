import { StoneList } from "../Lists/StoneList.js";
import { FallingModel } from "./MainModels/FallingModel.js";
export class StoneModel extends FallingModel {
    list = 'stone';
    constructor(stone, id, cell) {
        super(stone, id, 120);
        this.cellInit(cell);
    }
    fallDown() {
        if (!this.element || !StoneList.getOne(this.id)) {
            console.error('Такого камня уже нет', this, StoneList.getOne(this.id));
            return;
        }
        super.fallDown();
    }
}
//# sourceMappingURL=StoneModel.js.map