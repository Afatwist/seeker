import { CellList } from "./CellList.js";
import { CellModel } from "../Models/CellModel.js";
import { StoneModel } from "../Models/StoneModel.js";

/** Список камней на поле */
export class StoneList {

    /** список добычи
     * @type { Map<number, StoneModel> }
     */
    static #all = new Map()

    /** количество добычи, добавленной в список
     * @type {number}
     */
    static #counter = 0

    /** Создать список добычи */
    static makeList() {
        Array.from(document.querySelectorAll("[data-type='hurdle']")).reverse().forEach(hurdle => {
            this.#set(hurdle)
        });
    }

    /** Добавить добычу в список
     * 
     * @param {Element} stone
     */
    static #set(stone) {
        const item = new StoneModel(stone, this.#counter);
        this.#all.set(item.id, item);
        this.#counter++
    }

    /** Получить полный список добычи на поле
     * 
     * @returns { Map<number, StoneModel> }
     */
    static getAll() {
        return this.#all
    }

    /**
     * 
     * @param {number|string} id 
     * @returns {StoneModel|undefined}
     */
    static getOne(id) {
        return this.#all.get(parseInt(id))
    }

    /** Удалить добычу ОТЛИЧАЕТСЯ ОТ МЕТОДА В СПИСКЕ ВРАГОВ
     * 
     * @param {number|string} id 
     */
    static delete(id) {
        this.#all.delete(parseInt(id))
    }

    // static getCounter() {
    //     return {
    //         /** стартовое количество добычи на поле */
    //         counter: this.#counter,
    //         /** оставшееся количество добычи */
    //         map: this.#all.size
    //     }
    // }


    /** Поведение предметов на поле */
    static actions() {
        this.#all.forEach(item => {
            // console.log(item)
            if (item.fall === 0) item.fallDown();
            ;
        })
    }
    // ##############################################
    /** Падение предметов
    * 
    * @param {StoneModel} item 
    * @returns {void}
    */
    static #itemFall(item) {
        // Предмет падает в клетку под собой, если она пустая. 
        // Если клетка с типом земля или стена, то предмет останавливается в текущей клетке.
        // Если в летке враг или игрок, предмет убивает его, при условии, что высота падения более 1 клетки. (dataset.fall)
        // Если в клетке другой предмет, то проверяются боковые клетки от предмета, если они свободны, предмет может скатиться вниз по диагонали.
        // if (!item) console.log(item);
        // let currCell = item.cell
        // console.log(currCell);

        // проверка, что предмет все еще существует
        if (!item.element || !this.#all.has(item.id)) {
            console.error('Ошибка, камень был уничтожен, но продолжает падать', item, this.#all.has(item.id))
            return;
        }



        // if (!this.all.includes(item)) {
        //     console.log(item)
        //     return;
        // }

        let { row, col } = item.getCoordinates();

        // клетка под предметом, для падения вниз 
        let cellBottom = CellList.getOne(row + 1, col);

        // let cellBottom = this.#CELL.getOne(row + 1, col);

        if (!cellBottom) {
            console.log(cellBottom, item)
            item.fall = 0;
            return;
        }

        this.#itemLandingOnPlayer(item, cellBottom)

        // клетки справа, для скатывания направо
        let right = CellList.getOne(row, col + 1);
        let rightBottom = CellList.getOne(row + 1, col + 1);
        let rightSide = right?.isFree() && rightBottom?.isFree();


        // клетки слева, для скатывания налево
        let left = CellList.getOne(row, col - 1);
        let leftBottom = CellList.getOne(row + 1, col - 1);
        let leftSide = left?.isFree() && leftBottom?.isFree();

        // предмет лежит на другом предмете, т.е в клетке под предметом что-то есть, но не игрок
        let hasCellBottomItem = cellBottom.itemHas() && !cellBottom.hasPlayer()
        // console.log(hasCellBottomItem, cellBottom.hasChildNodes(), this.#CELL.innerItem(cellBottom) !== this.#player, item)

        // падение предмета
        if (cellBottom.isFreeNew()) this.#fallStep(item, cellBottom);
        else if (rightSide && hasCellBottomItem) this.#fallStep(item, rightBottom);
        else if (leftSide && hasCellBottomItem) this.#fallStep(item, leftBottom);
        else item.fall = 0;
    }

    /** Падение предмета на голову игрока
     *  
     * @param {StoneModel} item 
     * @param {CellModel} cellBottom 
     */
    static #itemLandingOnPlayer(item, cellBottom) {
        if (!item || !cellBottom) return;
        //if (!cellBottom.hasChildNodes()) return;
        if (!cellBottom.hasPlayer()) return;
        if (item.fall <= 1) return;

        // console.log(item);



        cellBottom.type = 'die';
        cellBottom.classReplace(['free'], ['player-die']);
        document.getElementById('player').remove();
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
     * @param {StoneModel} item 
     * @param {CellModel} targetCell
     */
    static #fallStep(item, targetCell) {

        item.fall += 1;
        item.pushToCell(targetCell);
        setTimeout(() => this.#itemFall(item), item.fallSpeed);
        this.actions();
    }
}