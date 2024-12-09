import { LootModel } from "../Models/LootModel.js";
import { CellList } from "./CellList.js";
import { CellModel } from "../Models/CellModel.js";

/**
 * Список добычи на поле
 */
export class LootList {

    /** список добычи
     * @type { Map<number, LootModel> }
     */
    static #all = new Map()

    /** количество добычи, добавленной в список
     * @type {number}
     */
    static #counter = 0

    /** Создать список добычи */
    static makeList() {
        Array.from(document.querySelectorAll("[data-type='loot']")).reverse().forEach(loot => {
            this.#set(loot)
        });
    }

    /** Добавить добычу в список
     * 
     * @param {Element} loot 
     */
    static #set(loot) {
        const item = new LootModel(loot, this.#counter);
        this.#all.set(item.id, item);
        this.#counter++
    }

    /** Получить полный список добычи на поле
     * 
     * @returns { Map<number, LootModel> }
     */
    static getAll() {
        return this.#all
    }

    /**
     * 
     * @param {number|string} id 
     * @returns {LootModel|undefined}
     */
    static getOne(id) {
        return this.#all.get(parseInt(id))
    }

    /** Удалить добычу ОТЛИЧАЕТСЯ ОТ МЕТОДА В СПИСКЕ ВРАГОВ
     * 
     * @param {number|string} id 
     */
    static delete(id) {
        this.getOne(id)?.element.remove();
        this.#all.delete(parseInt(id));
    }

    static getCounter() {
        return {
            /** стартовое количество добычи на поле */
            counter: this.#counter,
            /** оставшееся количество добычи */
            map: this.#all.size
        }
    }

    // ##############################################
    /** Поведение предметов на поле */
    static actions() {
        this.#all.forEach(item => {
            // console.log(item, item.dataset.fall)
            if (item.fall === 0) item.fallDown();
        })
    }

    /** Падение предметов
    * 
    * @param {LootModel} item 
    * @returns {void}
    */
    static #itemFall(item) {
        // Предмет падает в клетку под собой, если она пустая. 
        // Если клетка с типом земля или стена, то предмет останавливается в текущей клетке.
        // Если в клетке другой предмет, то проверяются боковые клетки от предмета, 
        // если они свободны, предмет может скатиться вниз по диагонали.

        // проверка, что предмет все еще существует
        if (!item.element || !this.#all.has(item.id)) {
            console.error(item, this.#all.has(item.id))
            return;
        }

        let { row, col } = item.getCoordinates();

        // клетка под предметом, для падения вниз 
        let cellBottom = CellList.getOne(row + 1, col);

        if (!cellBottom) {
            item.fall = 0;
            return;
        }

        // this.#itemLandingOnPlayer(item, cellBottom)

        let rightBottom = this.rightSideCell(row, col);

        let leftBottom = this.leftSideCell(row, col);

        // предмет лежит на другом предмете, т.е в клетке под предметом что-то есть, но не игрок
        let hasCellBottomItem = cellBottom.itemHas() && !cellBottom.hasPlayer();

        // падение предмета
        if (cellBottom.isFreeNew()) this.#fallStep(item, cellBottom);
        else if (rightBottom && hasCellBottomItem) this.#fallStep(item, rightBottom);
        else if (leftBottom && hasCellBottomItem) this.#fallStep(item, leftBottom);
        else item.fall = 0;

    }

    /** Падение предмета на голову игрока
     *  
     * @param {LootModel} item 
     * @param {CellModel} cellBottom 
     */
    static #itemLandingOnPlayer(item, cellBottom) {
        if (!item || !cellBottom) return;
        //if (!cellBottom.hasChildNodes()) return;
        if (!cellBottom.hasPlayer()) return;
        if (item.fall <= 1) return;

        // console.log(item);

        this.delete(item.id);




        // if (item.dataset.type === 'hurdle') {
        //     cellBottom.dataset.type = 'die';
        //     cellBottom.classList.replace('free', 'player-die')
        //     this.#player.remove();
        //     return;
        // }

        // if (item.dataset.type === 'loot') {
        //     this.lootCollector(item);
        // }
    }

    /** перемещение предмета в указанную клетку
     * @param {LootModel} item 
     * @param {CellModel} targetCell
     */
    static #fallStep(item, targetCell) {

        item.fall += 1;
        item.pushToCell(targetCell);
        setTimeout(() => this.#itemFall(item), item.fallSpeed);
        this.actions();
    }

    /** Получить клетку для скатывания направо
     * 
     * @param {number} row - ряд предмета
     * @param {number} col - колонка предмета
     * @returns {CellModel|false}
     */
    static rightSideCell(row, col) {
        let right = CellList.getOne(row, col + 1);
        let rightBottom = CellList.getOne(row + 1, col + 1);

        return right?.isFreeNew() && rightBottom?.isFreeNew() ? rightBottom : false;

    }

    /** Получить клетку для скатывания налево
     * 
     * @param {number} row - ряд предмета
     * @param {number} col - колонка предмета
     * @returns {CellModel|false}
     */
    static leftSideCell(row, col) {
        let left = CellList.getOne(row, col - 1);
        let leftBottom = CellList.getOne(row + 1, col - 1);

        return left?.isFreeNew() && leftBottom?.isFreeNew() ? leftBottom : false;
    }

}