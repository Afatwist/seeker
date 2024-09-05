// Если предмет лежит в самом низу поля и клетки под ним нет, найти способ его пропускать в цикле action

import { Cell } from "./Cell.js";

/**
 * Класс Item работает со всеми предметами на поле
 */
export class Item {
    /** Экземпляр класса Item,
     * для единственного экземпляра во всем приложении
     * (паттерн Singleton)
     * @type {Item}
     */
    static #instance

    /** Все предметы на поле
     * @type {Array<HTMLDivElement>}
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
     * @type {HTMLDivElement}
     */
    #player

    /** Время в миллисекундах, за которое предмет падает в следующую клетку.
     * Чем меньше число, тем быстрее падение.
     * @type {number}
     */
    #fallSpeed


    /**
     * @param {Cell} cell - класс клеток
     * @param {HTMLDivElement} player - игрок на поле
     */
    constructor() {
        if (Item.#instance) return Item.#instance;
        Item.#instance = this;

        this.all = Array.from(document.querySelectorAll("[data-type='hurdle'], [data-type='loot']")).reverse();

        this.lootCount = this.all.filter(item => item.dataset.type === 'loot').length;

        this.#CELL = new Cell()
        this.#player = document.getElementById('player');

        this.#fallSpeed = 120;
    }

    /** Поведение предметов на поле */
    actions() {

        this.all.forEach(item => {
            // console.log(item, item.dataset)
            if (item.dataset.fall === '0') this.#itemFall(item);
        })
    }

    /** Падение предметов
     * 
     * @param {HTMLDivElement} item 
     * @returns {void}
     */
    #itemFall(item) {
        // Предмет падает в клетку под собой, если она пустая. 
        // Если клетка с типом земля или стена, то предмет останавливается в текущей клетке.
        // Если в летке враг или игрок, предмет убивает его, при условии, что высота падения более 1 клетки. (dataset.fall)
        // Если в клетке другой предмет, то проверяются боковые клетки от предмета, если они свободны, предмет может скатиться вниз по диагонали.


        // проверка, что предмет все еще существует
        if (!this.all.includes(item)) {
            console.log(item)
            return;
        }

        let { row, col } = this.#getItemCoord(item);

        // клетка под предметом, для падения вниз 
        let cellBottom = this.#CELL.getOne(row + 1, col);

        if (!cellBottom) {
            // console.log(cellBottom, item)
            item.dataset.fall = '0';
            return;
        }


        this.#itemLandingOnPlayer(item, cellBottom)

        // клетки справа, для скатывания направо
        let right = this.#CELL.getOne(row, col + 1);
        let rightBottom = this.#CELL.getOne(row + 1, col + 1);

        let rightSide = this.#CELL.isFree(right) && this.#CELL.isFree(rightBottom);


        // клетки слева, для скатывания налево
        let left = this.#CELL.getOne(row, col - 1);
        let leftBottom = this.#CELL.getOne(row + 1, col - 1);

        let leftSide = this.#CELL.isFree(left) && this.#CELL.isFree(leftBottom);

        // предмет лежит на другом предмете, т.е в клетке под предметом что-то есть, но не игрок
        let hasCellBottomItem = cellBottom.hasChildNodes() &&
            cellBottom.childNodes[0] !== this.#player;
        // console.log(hasCellBottomItem, cellBottom.hasChildNodes(), this.#CELL.innerItem(cellBottom) !== this.#player, item)
        // падение предмета
        if (this.#CELL.isFree(cellBottom)) this.#fallStep(item, cellBottom);
        else if (rightSide && hasCellBottomItem) this.#fallStep(item, rightBottom);
        else if (leftSide && hasCellBottomItem) this.#fallStep(item, leftBottom);
        else item.dataset.fall = '0';
    }

    /** перемещение предмета в указанную клетку
     * @param {HTMLDivElement} item 
     * @param {HTMLDivElement} targetCell
     */
    #fallStep(item, targetCell) {
        item.dataset.fall = parseInt(item.dataset.fall) + 1;
        targetCell.append(item);

        setTimeout(() => this.#itemFall(item), this.#fallSpeed);
    }

    /** Падение предмета на голову игрока
     *  
     * @param {Element} item 
     * @param {Element} cellBottom 
     * @returns 
     */
    #itemLandingOnPlayer(item, cellBottom) {

        if (!item || !cellBottom) return;
        //if (!cellBottom.hasChildNodes()) return;
        if (cellBottom.childNodes[0] !== this.#player) return;
        if (parseInt(item.dataset.fall) <= 1) return;


        if (item.dataset.type === 'hurdle') {
            cellBottom.dataset.type = 'die';
            cellBottom.classList.replace('free', 'player-die')
            this.#player.remove();
            return;
        }

        if (item.dataset.type === 'loot') {
            this.lootCollector(item);
        }
    }

    /** Удаление добычи с поля и из массива элементов,
     * уменьшение счетчика оставшихся элементов на поле
     * 
     * @param {HTMLDivElement} loot 
     */
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