// !!! Оптимизировать скрипт перемещения игрока и поля
//  Добавить подсчет сделанных ходов
//  Добавить режим паузы при открытом модальном окне
//  сделать интерактивную карту а не из скриншота.


import { PlayerModel as Player } from "../Classes/Models/PlayerModel.js";
import { EnemyList } from "../Classes/Lists/EnemyList.js";
import { CellList } from "../Classes/Lists/CellList.js";
import { LootList } from "../Classes/Lists/LootList.js";
import { StoneList } from "../Classes/Lists/StoneList.js";
import { GameInfo } from "./GameInfo.js";
import { ListsActivator } from "../Classes/Lists/HelperForList.js";


/** Логика игры
 * @class Game
 */
export class Game {
    /** Количество клеток, которые игрок видит перед собой
     * @type {number}
     */
    static #horizonDeep

    /** Игровое поле
     * @type {HTMLDivElement}
     */
    static #board

    /**
     * @type {CSSStyleDeclaration}
     */
    static #boardStyle

    /** Начальные координаты поля
     * @type {{top: number, left: number}}
     */
    static #startCoordinates

    /** Высота окна в пикселях. Алиас для Window.innerHeight
     * @type {number}
     */
    static #windowHight

    /** Ширина окна в пикселях. Алиас для Window.innerWidth
     * @type {number}
     */
    static #windowWidth

    /** Модальное окно с результатом
    * @type {HTMLDivElement} 
    */
    static #modalResult

    /** Устанавливает паузу в игре
     * @type {boolean}
     */
    static pause = false;

    // ############################################

    /** Игровой процесс */
    static playing() {
        this.#prepare();
        GameInfo.update();

        document.addEventListener('keydown', (e) => {
            this.#gameOver();
            const action = this.#actionCheck(e.code);
            if (action && Player.alive && !Game.pause) {

                const { playerCoords, boardCoords } = this.#newCoordinates(action);

                Player.goTo(playerCoords);
                this.#boardMover(boardCoords);

                // console.time('aaa');
                this.#finishOpen();
                ListsActivator();
                // console.timeEnd('aaa');

                this.#gameWin();
                this.#gameOver();
            }
        });
    }

    // ############ ПОДГОТОВКА К ИГРЕ И ОБНОВЛЕНИЕ ИНФОРМАЦИИ ######
    /** Получение данных из DOM и настройки игры */
    static #prepare() {
        this.#horizonDeep = 5;
        this.#board = document.getElementById('board');


        Player.init();
        EnemyList.makeList();
        LootList.makeList();
        StoneList.makeList();
        GameInfo.init();


        this.#modalResult = document.getElementById('modal-result');

        // Начальные координаты поля
        const startRect = this.#board.getBoundingClientRect();
        this.#startCoordinates = {
            top: startRect.top,
            left: startRect.left
        }

        this.#windowHight = window.innerHeight;
        this.#windowWidth = window.innerWidth;
        this.#boardStyle = window.getComputedStyle(this.#board);
    }


    /** Определяет какая клавиша была нажата
     *  и возвращает игровое действие в зависимости от этого
     * 
     *  При открытом модальном окне кнопки блокируются
     * 
     * @param {string} key KeyboardEvent.code
     * @returns {"up" | "down" | "left" | "right" | false }
     */
    static #actionCheck(key) {
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
        let playerC = Player.getCoordinates();
        let stoneC = Player.getCoordinates();

        // координаты для перемещения игрового поля
        let horizonC = Player.getCoordinates();
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

    /** Перемещение игровой доски, при приближении игрока к краю зоны видимости
     * 
     * @param {obj} boardCoords - текущее расположение игровой доски и направление движения игрока
     */
    static #boardMover(boardCoords) {
        const { boardC, horizonC } = boardCoords;

        let horizonCell = CellList.getOne(horizonC.row, horizonC.col);

        if (horizonCell) {
            let rect = horizonCell.element.getBoundingClientRect()

            let isVisible = rect.top >= this.#startCoordinates.top &&
                rect.left >= this.#startCoordinates.left &&
                rect.bottom <= this.#windowHight &&
                rect.right <= this.#windowWidth

            // сдвигание поля в нужную сторону
            if (!isVisible) {
                this.#board.style.setProperty('top', `${boardC.top}px`)
                this.#board.style.setProperty('left', `${boardC.left}px`)
            }
        }
    }

    /** Получить текущее положение игрового поля
     * 
     * @returns {{ top: number, left: number }}
     */
    static #getBoardPosition() {
        return {
            top: parseInt(this.#boardStyle.getPropertyValue('top')),
            left: parseInt(this.#boardStyle.getPropertyValue('left'))
        }
    }


    // ############## МЕТОДЫ ПРИ ОКОНЧАНИИ ИГРЫ ###########
    /** Если собраны все сокровища, открывает клетку финиша для выхода из уровня
     */
    static #finishOpen() {
        // проверка наличия драгоценностей на поле
        if (LootList.getCounter().map > 0) return;

        if (GameInfo.finish?.type === 'finish-close') {
            GameInfo.finish.classReplace(['finish-close'], ['finish-open']);
            GameInfo.finish.type = 'finish-open';
        }
    }

    /** При победе на уровне */
    static #gameWin() {
        if (Player.cell.type === 'finish-open' ||
            (LootList.getCounter().map === 0 && !GameInfo.finish)) {
            Game.pause = true;
            setTimeout(() => {
                this.#modalResult.querySelector('.modal-content').innerHTML = '<p>ВЫ ВЫИГРАЛИ!</p>';
                this.#modalResult.classList.add('modal-show');
            }, 200);
        }
    }

    /** При проигрыше на уровне */
    static #gameOver() {
        if (!Player.alive) {
            Game.pause = true;
            setTimeout(() => {
                this.#modalResult.querySelector('.next-level').style.display = 'none';

                this.#modalResult.querySelector('.modal-content').innerHTML = '<p>ВЫ ПРОИГРАЛИ!<br>ПОПРОБУЙТЕ ЕЩЕ РАЗ</p>';
                this.#modalResult.classList.add('modal-show');
            }, 200);
        }
    }
}