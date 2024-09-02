import { Cell } from "./Cell.js";

/**
 * Класс Item работает со всеми предметами на поле
 */
export class Item {
    /** Все предметы на поле
     * @type {Array<Element>}
     */
    all

    /** Количество добычи на поле
     * @type {number}
     */
    lootCount

    /** Все клетки на поле
     * @type {Cell}
     */
    #CELL

    /** Игрок
     * @type {Element}
     */
    #player


    /**
     * @param {Cell} cell - класс клеток
     * @param {Element} player - игрок на поле
     */
    constructor(cell, player) {
        this.all = Array.from(document.querySelectorAll("[data-type='hurdle'], [data-type='loot']")).reverse();

        this.lootCount = this.all.filter(item => item.dataset.type === 'loot').length;

        this.#CELL = cell
        this.#player = player;
    }

    /** Поведение предметов на поле */
    actions() {
        this.all.forEach(item => {
            if (item.dataset.fall === '0') this.#itemFall(item);
        })
    }

    /** Падение предметов
     * 
     * @param {*} item 
     * @returns {void}
     */
    #itemFall(item) {

        // проверка, что предмет все еще существует
        if (!this.all.includes(item)) return;

        let { row, col } = this.#getItemCoord(item);

        // клетка под предметом, для падения вниз 
        // console.log()
        let cellBottom = this.#CELL.getOne(row + 1, col)
        // let cellBottom = document.querySelector(`.cell[data-row="${row + 1}"][data-col="${col}"]`);
        if (!cellBottom) { item.dataset.fall = '0'; return }
        //return

        this.#itemLandingOnPlayer(item, cellBottom)

        // клетки справа, для скатывания направо
        let right = this.#CELL.getOne(row, col + 1)
        //  document.querySelector(`.cell[data-row="${row}"][data-col="${col + 1}"]`);
        let rightBottom = this.#CELL.getOne(row + 1, col + 1)
        //document.querySelector(`.cell[data-row="${row + 1}"][data-col="${col + 1}"]`);
        let rightSide = this.#CELL.isFree(right) && this.#CELL.isFree(rightBottom);


        // клетки слева, для скатывания налево
        let left = this.#CELL.getOne(row, col - 1)
        //document.querySelector(`.cell[data-row="${row}"][data-col="${col - 1}"]`);
        let leftBottom = this.#CELL.getOne(row + 1, col - 1)
        //document.querySelector(`.cell[data-row="${row + 1}"][data-col="${col - 1}"]`);
        let leftSide = this.#CELL.isFree(left) && this.#CELL.isFree(leftBottom);

        // предмет лежит на другом предмете, т.е в клетке под предметом что-то есть, но не игрок
        let hasCellBottomItem = cellBottom.hasChildNodes() &&
            cellBottom.childNodes[0] !== this.#player;

        /** перемещение предмета в указанную клетку */
        const fallStep = (item, targetCell) => {
            item.dataset.fall = parseInt(item.dataset.fall) + 1;
            targetCell.append(item);

            setTimeout(() => this.#itemFall(item), 120);
        }

        // падение предмета
        if (this.#CELL.isFree(cellBottom)) fallStep(item, cellBottom);
        else if (rightSide && hasCellBottomItem) fallStep(item, rightBottom);
        else if (leftSide && hasCellBottomItem) fallStep(item, leftBottom);
        else item.dataset.fall = '0';
    }

    /** Падение предмета на голову игрока
     *  
     * @param {Element} item 
     * @param {Element} cellBottom 
     * @returns 
     */
    #itemLandingOnPlayer(item, cellBottom) {

        if (!item || !cellBottom) return
        if (!cellBottom.hasChildNodes()) return
        if (cellBottom.childNodes[0] !== this.#player) return


        if (item.dataset.type === 'hurdle' && parseInt(item.dataset.fall) > 1) {
            cellBottom.dataset.type = 'die';
            cellBottom.classList.replace('free', 'player-die')
            this.#player.remove();
            return;
        }

        if (item.dataset.type === 'loot' && parseInt(item.dataset.fall) > 1) {
            this.lootCollector(item);
        }
    }

    lootCollector(loot) {
        loot.remove()
        let index = this.all.indexOf(loot)
        this.all.splice(index, 1)

        this.lootCount--
    }

    // /** Возвращает координаты клетки игрока
    //  * 
    //  * @returns {CellCoordinates}
    //  * - координаты клетки с игроком
    // */
    // #getPlayerCoord() {
    //     // if (!this.#player.parentElement) return false;
    //     return this.#CELL.getCoordinates(this.#player.parentElement)
    // }

    /** Возвращает координаты клетки с предметом
     * @param {Element} item - предмет
     * @returns {CellCoordinates}
     * - координаты клетки с предметом
     */
    #getItemCoord(item) {
        // if (!item.parentElement) return false;
        return this.#CELL.getCoordinates(item.parentElement)
    }


}