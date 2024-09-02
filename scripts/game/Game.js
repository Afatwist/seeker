// !!! Оптимизировать скрипт перемещения игрока и поля
// !!! методы победы и проигрыша поиск клетки финиша вынести в подготовку
import { Cell } from "./Cell.js";
import { Enemy } from "./Enemy.js";
import { Item } from "./Item.js";


/** Логика игры
 * @class Game
 */
export class Game {
    /** Количество клеток, которые игрок видит перед собой
     * @type {number}
     */
    static #horizonDeep

    /** Игрок
     * @type {HTMLElement} 
     */
    static #player

    /** Игровое поле
     * @type {HTMLElement} 
     */
    static #board

    /** Статус финиша
     * @type {Element} 
     */
    static #finish

    /** Все клетки на поле
     * @type {Cell}
     */
    static #CELL

    /** Все предметы на поле
     * @type {Item}
     */
    static #ITEM

    /** Все враги на поле
     * @type {Enemy}
     */
    static #ENEMY

    /** Начальные координаты поля
     * @type {{top: number, left: number}}
     */
    static #startCoordinates

    /** Координаты клетки
     * @typedef {Object} CellCoordinates
     * @property {number} row - Номер ряда
     * @property {number} col - Номер колонки
     */

    /** Модальное окно с результатом
    * @type {HTMLElement} 
    */
    static #modalResult

    /** Модальное окно с результатом
     * @type {HTMLElement} 
     */
    static #modalMap

    /** Блок Информации. Количество добычи на поле
     * @type {Element}
     */
    static #infoLootCount

    /** Блок Информации. Состояние финиша
     * @type {Element}
     */
    static #infoFinishStatus

    // ############################################

    /** Игровой процесс */
    static playing() {

        this.#prepare();
        this.#infoUpdate();

        document.addEventListener('keydown', (e) => {
            console.time('aaa')
            const action = this.#actionCheck(e.code);

            if (action) {

                const { playerCoords, boardCoords } = this.#newCoordinates(action);

                this.#playerMover(playerCoords);
                this.#boardMover(boardCoords);

                this.#ITEM.actions();
                this.#ENEMY.actions();

                this.#finishOpen();
                this.#infoUpdate();
                this.#gameWin();
                this.#gameOver();
            }
            console.timeEnd('aaa')
        });
    }

    // ############ ПОДГОТОВКА К ИГРЕ И ОБНОВЛЕНИЕ ИНФОРМАЦИИ ######
    /** Получение данных из DOM и настройки игры */
    static #prepare() {
        this.#horizonDeep = 5;
        this.#player = document.getElementById('player');
        this.#board = document.getElementById('board');

        this.#finish = document.querySelector('.finish-close') ||
            document.querySelector('.finish-open');

        this.#CELL = new Cell();
        this.#ITEM = new Item(this.#CELL, this.#player);
        this.#ENEMY = new Enemy(this.#CELL, this.#player);

        this.#modalResult = document.getElementById('modal-result');
        this.#modalMap = document.getElementById('modal-level_map');
        this.#infoLootCount = document.querySelector('.loot-count');
        this.#infoFinishStatus = document.querySelector('.finish-status');

        // Начальные координаты поля
        const startRect = this.#board.getBoundingClientRect();
        this.#startCoordinates = {
            top: startRect.top,
            left: startRect.left
        }
    }

    /** Обновление информационного блока в шапке игры */
    static #infoUpdate() {
        // количество добычи, оставшееся на поле
        this.#infoLootCount.textContent = this.#ITEM.lootCount;

        // состояние клетки финиша
        let status = this.#finish?.dataset.type;
        let info = '';

        if (status === 'finish-close') info = 'Финиш закрыт';
        else if (status === 'finish-open') info = 'Финиш открыт';
        else info = 'Игра без Финиша, просто соберите всю добычу';

        this.#infoFinishStatus.textContent = info;
    }

    // ############ ОБРАБОТКА НАЖАТИЯ КНОПОК И ПЕРЕМЕЩЕНИЕ ИГРОКА ######
    /** Определяет какая клавиша была нажата
     *  и возвращает игровое действие в зависимости от этого
     * 
     * @param {string} key KeyboardEvent.code
     * @returns {false | "down" | "up" | "left" | "right"}
     */
    static #actionCheck(key) {
        if (this.#modalResult.classList.contains('modal-show')) return false;
        if (this.#modalMap.classList.contains('modal-show')) return false;
        switch (key) {
            case 'KeyW': case 'ArrowUp': return 'up';
            case 'KeyS': case 'ArrowDown': return 'down';
            case 'KeyA': case 'ArrowLeft': return 'left';
            case 'KeyD': case 'ArrowRight': return 'right';
            default: return false;
        }
    }

    /** В зависимости от игрового действия
     * Определяет новые координаты для игрока и положение игрового поля
     * 
     * @param {string} action 
     * @returns 
     */
    static #newCoordinates(action) {

        // координаты для перемещения игрока
        let playerC = this.#getPlayerCoord();
        let stoneC = this.#getPlayerCoord();

        // координаты для перемещения игрового поля
        let horizonC = this.#getPlayerCoord();
        let boardC = this.#getBoardPosition();

        switch (action) {
            case 'down':
                playerC.row++;
                stoneC.row += 2;
                horizonC.row += this.#horizonDeep;
                boardC.top -= 60;
                break;
            case 'up':
                playerC.row--;
                stoneC.row -= 2;
                horizonC.row -= this.#horizonDeep;
                boardC.top += 60;
                break;
            case 'left':
                playerC.col--;
                stoneC.col -= 2;
                horizonC.col -= this.#horizonDeep;
                boardC.left += 60;
                break;
            case 'right':
                playerC.col++;
                stoneC.col += 2;
                horizonC.col += this.#horizonDeep;
                boardC.left -= 60;
                break;
            default: break;
        }
        return {
            playerCoords: { playerC, stoneC },
            boardCoords: { boardC, horizonC }
        }
    }

    /** Перемещение игрока в новую клетку
     * 
     * @param {*}  фишка игрока
     */
    static #playerMover(playerCoords) {
        const { playerC, stoneC } = playerCoords;

        let cell = document.querySelector(`.cell[data-row="${playerC.row}"][data-col="${playerC.col}"]`)

        if (cell) {
            if (cell.hasChildNodes()) {
                // клетки с предметами
                /** предмет в клетке */
                const item = cell.children[0]

                // Клетки с сокровищем
                if (item.dataset.type === 'loot') {
                    this.#ITEM.lootCollector(item)
                    cell.append(this.#player)
                }

                // Клетки с камнями
                if (item.dataset.type === 'hurdle') {

                    let cellNext = document.querySelector(`.cell[data-row="${stoneC.row}"][data-col="${stoneC.col}"]`)

                    if (this.#CELL.isFree(cellNext)) {
                        // камень можно подвинуть на пустую клетку
                        cellNext.append(item)
                        cell.append(this.#player)
                    } else {
                        // камень невозможно сдвинуть
                        cell.classList.add('item-not-moving')
                        setTimeout(() => {
                            cell.classList.remove('item-not-moving')
                        }, 700);
                    }
                }
            }

            // Пустая клетка
            if (this.#CELL.isFree(cell)) {
                cell.append(this.#player)
            }

            // Клетка с "Землей"
            if (cell.dataset.type === 'ground') {
                cell.classList.replace('ground', 'free')
                cell.append(this.#player)
                cell.dataset.type = 'free'
            }

            // Клетка-Стена
            if (cell.dataset.type === 'wall') {
                cell.classList.add('wall-border-red')
                setTimeout(() => {
                    cell.classList.remove('wall-border-red')
                }, 700);
            }

            if (cell.dataset.type === 'start') {
                cell.append(this.#player);
            }

            if (cell.dataset.type === 'finish-open') {
                cell.append(this.#player);
            }

            if (cell.dataset.type === 'finish-close') {
                cell.classList.add('wall-border-red')
                setTimeout(() => {
                    cell.classList.remove('wall-border-red')
                }, 700);
            }

        }
    }

    /** Перемещение игровой доски, при приближении игрока к краю зоны видимости
     * 
     * @param {obj} boardCoords - текущее расположение игровой доски и направление движения игрока
     */
    static #boardMover(boardCoords) {
        const { boardC, horizonC } = boardCoords

        let horizonCell = document.querySelector(`.cell[data-row="${horizonC.row}"][data-col="${horizonC.col}"]`)

        if (horizonCell) {
            let rect = horizonCell.getBoundingClientRect()

            let isVisible = rect.top >= this.#startCoordinates.top &&
                rect.left >= this.#startCoordinates.left &&
                rect.bottom <= window.innerHeight &&
                rect.right <= window.innerWidth

            // сдвигание поля в нужную сторону
            if (!isVisible) {
                this.#board.style.setProperty('top', `${boardC.top}px`)
                this.#board.style.setProperty('left', `${boardC.left}px`)
            }
        }
    }

    static #getBoardPosition() {
        const style = window.getComputedStyle(this.#board)
        return {
            top: parseInt(style.getPropertyValue('top')),
            left: parseInt(style.getPropertyValue('left'))
        }
    }

    /** Возвращает координаты клетки игрока
     * 
     * @returns {CellCoordinates}
     * - координаты клетки с игроком
    */
    static #getPlayerCoord() {
        // if (!this.#player.parentElement) return false;
        return this.#CELL.getCoordinates(this.#player.parentElement)
    }

    //#####################################//
    //##### Методы при окончании игры #####//
    //#####################################//

    /** Если собраны все сокровища, открывает клетку финиша для выхода из уровня
     */
    static #finishOpen() {
        // проверка наличия драгоценностей на поле
        if (this.#ITEM.lootCount > 0) return;

        if (this.#finish?.dataset.type === 'finish-close') {
            this.#finish.classList.replace('finish-close', 'finish-open');
            this.#finish.dataset.type = 'finish-open';
        }
    }

    /** При победе на уровне */
    static #gameWin() {
        // проверка, что игрок зашел на клетку "финиш" и он открыт
        let finishOpen = this.#player.parentElement?.classList.contains('finish-open');
        if (finishOpen || (this.#ITEM.lootCount === 0 && !this.#finish)) {
            setTimeout(() => {
                this.#modalResult.querySelector('.modal-content').innerHTML = '<p>ВЫ ВЫИГРАЛИ!</p>';
                this.#modalResult.classList.add('modal-show');

            }, 200);
        }
    }

    /** При проигрыше на уровне */
    static #gameOver() {
        if (this.#player.parentElement === null) {
            setTimeout(() => {
                this.#modalResult.querySelector('.next-level').style.display = 'none';

                this.#modalResult.querySelector('.modal-content').innerHTML = '<p>ВЫ ПРОИГРАЛИ!<br>ПОПРОБУЙТЕ ЕЩЕ РАЗ</p>';
                this.#modalResult.classList.add('modal-show');
            }, 200);
        }
    }
}