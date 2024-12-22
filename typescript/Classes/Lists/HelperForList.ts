import { GameInfo } from "../../game/GameInfo.js";
import { CellList } from "./CellList.js";
import { EnemyList } from "./EnemyList.js";
import { LootList } from "./LootList.js";
import { StoneList } from "./StoneList.js";


/** Объединенный метод для активации всех предметов на поле и 
 * обновления информации в шапке страницы
 * 
 * Метод: List.actions()
 */
export function ListsActivator() {
    StoneList.actions()
    LootList.actions()
    EnemyList.actions()

    GameInfo.update()

    CellList.cellChecker() // !!! временный метод для поиска ошибок

}