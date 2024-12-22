// !!! Оптимизировать скрипт перемещения игрока и поля
//  Добавить подсчет сделанных ходов
//  Добавить режим паузы при открытом модальном окне
//  сделать интерактивную карту а не из скриншота.


import { Player } from "../Classes/Models/PlayerModel.js";
// import { EnemyList } from "../Classes/Lists/EnemyList.js";
import { CellList } from "../Classes/Lists/CellList.js";
import { LootList } from "../Classes/Lists/LootList.js";
// import { StoneList } from "../Classes/Lists/StoneList.js";
import { GameInfo } from "./GameInfo.js";
import { ListsActivator } from "../Classes/Lists/HelperForList.js";


/** Логика игры
 * @class Game
 */
export class Game {
    /** Количество клеток, которые игрок видит перед собой */
    static #horizonDeep: number

    /** Игровое поле */
    static #board: HTMLDivElement

    /** Стили игрового поля */
    static #boardStyle: CSSStyleDeclaration

    /** Начальные координаты поля */
    static #startCoordinates: { top: number; left: number; }

    /** Высота окна в пикселях. Алиас для Window.innerHeight */
    static #windowHight: number

    /** Ширина окна в пикселях. Алиас для Window.innerWidth */
    static #windowWidth: number

    /** Модальное окно с результатом */
    static #modalResult: HTMLDivElement

    /** Устанавливает паузу в игре */
    static pause: boolean = false;

    // ############################################

    /** Игровой процесс */
    static playing(): void {
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
    static #prepare(): void {
        this.#horizonDeep = 5;
        this.#board = document.getElementById('board')! as HTMLDivElement;


        GameInfo.init();


        this.#modalResult = document.getElementById('modal-result')! as HTMLDivElement;

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
     */
    static #actionCheck(key: string): ActionDirection {
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
     * @param action направление движения игрока 
     */
    static #newCoordinates(action: ActionDirection) {

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
     * @param boardCoords - текущее расположение игровой доски и направление движения игрока
     */
    static #boardMover(boardCoords: { boardC: IBoardPosition; horizonC: ICoordinates }): void {
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

    /** Получить текущее положение игрового поля */
    static #getBoardPosition(): IBoardPosition {
        return {
            top: parseInt(this.#boardStyle.getPropertyValue('top')),
            left: parseInt(this.#boardStyle.getPropertyValue('left'))
        }
    }


    // ############## МЕТОДЫ ПРИ ОКОНЧАНИИ ИГРЫ ###########
    /** Если собраны все сокровища, открывает клетку финиша для выхода из уровня */
    static #finishOpen(): void {
        // проверка наличия драгоценностей на поле
        if (LootList.getCounter().map > 0) return;

        if (CellList.finish?.type === 'finish-close') {
            CellList.finish.classReplace(['finish-close'], ['finish-open']);
            CellList.finish.type = 'finish-open';
        }
    }

    /** При победе на уровне */
    static #gameWin(): void {
        if (Player.cell?.type === 'finish-open' ||
            (LootList.getCounter().map === 0 && !CellList.finish)) {
            Game.pause = true;
            setTimeout(() => {
                this.#modalResult.querySelector('.modal-content')!.innerHTML = '<p>ВЫ ВЫИГРАЛИ!</p>';
                this.#modalResult.classList.add('modal-show');
            }, 200);
        }
    }

    /** При проигрыше на уровне */
    static #gameOver() {
        if (!Player.alive) {
            Game.pause = true;
            setTimeout(() => {
                this.#modalResult.querySelector<HTMLDivElement>('.next-level')!.style.display = 'none';

                this.#modalResult.querySelector('.modal-content')!.innerHTML = '<p>ВЫ ПРОИГРАЛИ!<br>ПОПРОБУЙТЕ ЕЩЕ РАЗ</p>';
                this.#modalResult.classList.add('modal-show');
            }, 200);
        }
    }
}