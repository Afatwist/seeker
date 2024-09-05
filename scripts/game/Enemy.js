import { Cell } from "./Cell.js";
import { Item } from "./Item.js";

export class Enemy {
    /** Все противники на поле
     * @type {Array<Element>}
     */
    all

    /**
     * @type {Cell}
     */
    #CELL

    /** Игрок
     * @type {HTMLDivElement}
     */
    #player

    #ITEM
    /**
     * @param {Cell} cell - класс клеток
     * @param {HTMLDivElement} player - игрок на поле 
     */
    constructor() {
        this.all = Array.from(document.querySelectorAll("[data-type='enemy']"));

        this.#player = document.getElementById('player');
        this.#CELL = new Cell();
        this.#ITEM = new Item()
    }

    actions() {
        this.all.forEach(item => {
            if (item.dataset.walk === '0') this.#enemyAction(item);
        })
    }




    /** Поведение врага на поле
     * 
     * @param {Element} enemy враг
     * @param {Element | null} prevCell клетка, в которой враг был раньше
     * @returns 
     */
    #enemyAction(enemy, prevCell = null) {
        if (!enemy || !this.all.includes(enemy)) return;

        let currentCell = enemy.parentElement;
        enemy.dataset.walk = '1';
        this.#enemyPicChanger(enemy);
        this.#enemyDie(enemy);
        let nextCell = this.#enemyHuntCell(enemy) || this.#enemyWalkCell(enemy, prevCell);

        if (!nextCell) {
            enemy.dataset.walk = '0';
            return;
        }

        if (nextCell.children[0] === this.#player) {
            nextCell.dataset.type = 'die';
            nextCell.classList.replace('free', 'player-die');
            enemy.classList.add('enemy-killer');
            this.#player.remove();
            return;
        }
        nextCell.append(enemy);

        setTimeout(() => {
            // if (this.#modalResult.classList.contains('modal-show') || this.#modalMap.classList.contains('modal-show')) {
            //     enemy.dataset.walk = '0';
            //     return
            // }
            this.#enemyAction(enemy, currentCell)
        }, 500);
    }

    /** Обычное поведение врага, когда игрок далеко.
     * Возвращает новую клетку для перемещения если она есть
     * 
     * @param {Element} enemy враг
     * @param {Element | null} prevCell клетка, в которой враг находился раньше 
     * @returns {Element | null}
     */
    #enemyWalkCell(enemy, prevCell = null) {
        let cells = this.#enemyCellsAround(enemy);
        if (cells.length > 1) {
            cells = cells.filter(cell => cell !== prevCell);
        }
        let index = Math.floor(Math.random() * cells.length);
        return cells[index];
    }

    /** Если игрок подходит близко к врагу, у врага включается режим охоты,
     * и он перемещается в ближайшую клетку к игроку
     * 
     * @param {Element} enemy враг
     * @returns {Element | null}
     */
    #enemyHuntCell(enemy) {
        if (this.#enemyDistance(enemy.parentElement) > 3) return false;
        let cells = this.#enemyCellsAround(enemy)
        if (cells.length > 1) {
            cells = cells.sort((a, b) => this.#enemyDistance(a) -
                this.#enemyDistance(b))
        }
        return cells[0];
    }

    /** Возвращает доступные для перемещения клетки вокруг врага
     * 
     * @param {Element} enemy враг
     * @returns {Array<Element | null>}
     */
    #enemyCellsAround(enemy) {
        let { row, col } = this.#getItemCoord(enemy);
        let cells = [
            document.querySelector(`.cell[data-row="${row - 1}"][data-col="${col}"]`),
            document.querySelector(`.cell[data-row="${row + 1}"][data-col="${col}"]`),
            document.querySelector(`.cell[data-row="${row}"][data-col="${col - 1}"]`),
            document.querySelector(`.cell[data-row="${row}"][data-col="${col + 1}"]`)
        ].filter(cell => {
            if (!cell) return false
            if (cell.dataset.type !== 'free') return false
            if (cell.hasChildNodes()) {
                if (cell.children[0] !== this.#player) return false
            }
            return true
        })

        return cells
    }

    /** Определяет расстояние от указанной клетки до игрока
     * 
     * @param {Element} cell 
     * @returns {number}
     */
    #enemyDistance(cell) {
        let { row, col } = this.#CELL.getCoordinates(cell);
        let playerCoords = this.#getPlayerCoord();
        let distance = Math.floor(Math.hypot(row - playerCoords.row, col - playerCoords.col));
        return distance
    }

    /** Меняет изображение врага в зависимости от расстояния до игрока
     * 
     * @param {Element} enemy 
     */
    #enemyPicChanger(enemy) {
        let distance = this.#enemyDistance(enemy.parentElement)
        if (distance < 3) {
            enemy.classList.remove('enemy-walk', 'enemy-wary');
            enemy.classList.add('enemy-hunt');
        } else if (distance < 5) {
            enemy.classList.remove('enemy-hunt', 'enemy-walk');
            enemy.classList.add('enemy-wary');
        } else {
            enemy.classList.remove('enemy-hunt', 'enemy-wary');
            enemy.classList.add('enemy-walk');
        }
    }

    #enemyDie(enemy) {
        let { row, col } = this.#getItemCoord(enemy);
        let item = document.querySelector(`.cell[data-row="${row - 1}"][data-col="${col}"]`)?.children[0]

        if (item?.dataset.type !== 'hurdle') return

        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                let cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);

                if (!cell) continue;
                if (cell.classList.contains('none')) continue;

                if (cell.hasChildNodes()) {
                    let child = cell.firstChild
                    let childType = child.dataset.type;
                    if(childType === 'loot') {
                        this.#ITEM.lootCollector(child)
                    }
                    if (childType === 'hurdle') {
                        // this.#itemsArr.splice(this.#itemsArr.indexOf(item), 1);
                        child.dataset.type = childType + '-remove'; 
                        cell.removeChild(child);

                    }
                    else if (childType === 'enemy') {
                        // console.log(child)

                        // this.#enemyDie(child)
                    }

                    
                }

                cell.dataset.type = 'free';
                cell.classList.remove('ground', 'wall')
                cell.classList.add('fire');

                setTimeout(() => {
                    cell.classList.replace('fire', 'free');
                }, 300);
            }
        }
        this.all.splice(this.all.indexOf(enemy), 1);
        enemy.remove();
        // console.log(enemy, this.all)
    }





    /** Возвращает координаты клетки с предметом
     * @param {Element} item - предмет
     * @returns {CellCoordinates}
     * - координаты клетки с предметом
     */
    #getItemCoord(item) {
        // if (!item.parentElement) return false;
        return this.#CELL.getCoordinates(item.parentElement)
    }
    /** Возвращает координаты клетки игрока
     * 
     * @returns {CellCoordinates}
     * - координаты клетки с игроком
    */
    #getPlayerCoord() {
        // if (!this.#player.parentElement) return false;
        return this.#CELL.getCoordinates(this.#player.parentElement)
    }

}