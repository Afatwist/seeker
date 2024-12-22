// import { CellList } from "../Lists/CellList.js";
import { LootList } from "../Lists/LootList.js";
import { StoneList } from "../Lists/StoneList.js" //?? при удалении возникает ошибка!!!
import { CellModel } from "./CellModel.js";
import { FallingModel } from "./MainModels/FallingModel.js";



export class LootModel extends FallingModel {

    list: ItemList = 'loot';

    /** Создание новой Добычи
     * @param loot - HTML-элемент добычи
     * @param id - ID - уникальный номер врага в списке врагов
     * @param cell - Модель клетки, в которой находится враг 
     */
    constructor(loot: HTMLDivElement, id: ID, cell: CellModel) {
        super(loot, id, 120);
        this.cellInit(cell);
    }

    //#################################################################################
    /** Падение предмета */
    fallDown(): void {
        // проверка, что предмет все еще существует
        if (!this.element || !LootList.getOne(this.id)) {
            console.error('такой добычи уже нет', this, LootList.getOne(this.id));
            return;
        }
        super.fallDown();
    }



}
//!!!!######################################################
/** эта дичь нужна только для устранения ошибки импорта StoneList!*/
if (false) {
    StoneList.getOne(0);
}