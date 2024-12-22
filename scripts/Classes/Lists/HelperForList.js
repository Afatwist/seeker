import { GameInfo } from "../../game/GameInfo.js";
import { CellList } from "./CellList.js";
import { EnemyList } from "./EnemyList.js";
import { LootList } from "./LootList.js";
import { StoneList } from "./StoneList.js";
export function ListsActivator() {
    StoneList.actions();
    LootList.actions();
    EnemyList.actions();
    GameInfo.update();
    CellList.cellChecker();
}
//# sourceMappingURL=HelperForList.js.map