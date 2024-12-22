// import { CellList } from "../Lists/CellList.js";
import { StoneList } from "../Lists/StoneList.js";
import { CellModel } from "./CellModel.js";
// import { EnemyModel } from "./EnemyModel.js";
import { FallingModel } from "./MainModels/FallingModel.js";
// import { PlayerModel, Player } from "./PlayerModel.js";

/** Класс Камней.
 * 
 * Камень при падении с большой высоты может убить Игрока или Врага.
 * 
 * Для этого Камень должен пролететь минимум 2 клетки перед ударом.
 * 
 */
export class StoneModel extends FallingModel {

    list: ItemList = 'stone';

    /** Создание нового Камня
     * @param stone - HTML-элемент камня
     * @param id - ID - уникальный номер врага в списке врагов
     * @param cell - Модель клетки, в которой находится враг 
     */
    constructor(stone: HTMLDivElement, id: ID, cell: CellModel) {
        super(stone, id, 120);
        this.cellInit(cell);
    }

    /** Падение предметов */
    fallDown(): void {
        // проверка, что предмет все еще существует
        if (!this.element || !StoneList.getOne(this.id)) {
            console.error('Такого камня уже нет', this, StoneList.getOne(this.id));
            return;
        }
        super.fallDown();
    }
}