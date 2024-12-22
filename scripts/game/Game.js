import { Player } from "../Classes/Models/PlayerModel.js";
import { CellList } from "../Classes/Lists/CellList.js";
import { LootList } from "../Classes/Lists/LootList.js";
import { GameInfo } from "./GameInfo.js";
import { ListsActivator } from "../Classes/Lists/HelperForList.js";
export class Game {
    static #horizonDeep;
    static #board;
    static #boardStyle;
    static #startCoordinates;
    static #windowHight;
    static #windowWidth;
    static #modalResult;
    static pause = false;
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
                this.#finishOpen();
                ListsActivator();
                this.#gameWin();
                this.#gameOver();
            }
        });
    }
    static #prepare() {
        this.#horizonDeep = 5;
        this.#board = document.getElementById('board');
        GameInfo.init();
        this.#modalResult = document.getElementById('modal-result');
        const startRect = this.#board.getBoundingClientRect();
        this.#startCoordinates = {
            top: startRect.top,
            left: startRect.left
        };
        this.#windowHight = window.innerHeight;
        this.#windowWidth = window.innerWidth;
        this.#boardStyle = window.getComputedStyle(this.#board);
    }
    static #actionCheck(key) {
        switch (key) {
            case 'KeyW':
            case 'ArrowUp': return 'up';
            case 'KeyS':
            case 'ArrowDown': return 'down';
            case 'KeyA':
            case 'ArrowLeft': return 'left';
            case 'KeyD':
            case 'ArrowRight': return 'right';
            default: return false;
        }
    }
    static #newCoordinates(action) {
        let playerC = Player.getCoordinates();
        let stoneC = Player.getCoordinates();
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
        };
    }
    static #boardMover(boardCoords) {
        const { boardC, horizonC } = boardCoords;
        let horizonCell = CellList.getOne(horizonC.row, horizonC.col);
        if (horizonCell) {
            let rect = horizonCell.element.getBoundingClientRect();
            let isVisible = rect.top >= this.#startCoordinates.top &&
                rect.left >= this.#startCoordinates.left &&
                rect.bottom <= this.#windowHight &&
                rect.right <= this.#windowWidth;
            if (!isVisible) {
                this.#board.style.setProperty('top', `${boardC.top}px`);
                this.#board.style.setProperty('left', `${boardC.left}px`);
            }
        }
    }
    static #getBoardPosition() {
        return {
            top: parseInt(this.#boardStyle.getPropertyValue('top')),
            left: parseInt(this.#boardStyle.getPropertyValue('left'))
        };
    }
    static #finishOpen() {
        if (LootList.getCounter().map > 0)
            return;
        if (CellList.finish?.type === 'finish-close') {
            CellList.finish.classReplace(['finish-close'], ['finish-open']);
            CellList.finish.type = 'finish-open';
        }
    }
    static #gameWin() {
        if (Player.cell?.type === 'finish-open' ||
            (LootList.getCounter().map === 0 && !CellList.finish)) {
            Game.pause = true;
            setTimeout(() => {
                this.#modalResult.querySelector('.modal-content').innerHTML = '<p>ВЫ ВЫИГРАЛИ!</p>';
                this.#modalResult.classList.add('modal-show');
            }, 200);
        }
    }
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
//# sourceMappingURL=Game.js.map