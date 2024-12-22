import { CellList } from "./Lists/CellList.js";
import { EnemyList } from "./Lists/EnemyList.js";
import { LootList } from "./Lists/LootList.js";
import { StoneList } from "./Lists/StoneList.js";
import { Player } from "./Models/PlayerModel.js";
export class LevelRender {
    static #boardSize;
    static #boardData;
    static #levelTitle;
    static #graphics_set;
    static setData(levelData) {
        this.#levelTitle = levelData.title;
        this.#boardSize = levelData.board.size;
        this.#boardData = levelData.board.data.reverse();
        this.#graphics_set = levelData.graphics_set;
        return this;
    }
    static make(isGame = false) {
        const board = document.getElementById('board');
        for (let r = 1; r <= this.#boardSize.rows; r++) {
            let row = this.#rowRender(r);
            for (let c = 1; c <= this.#boardSize.cols; c++) {
                let data = this.#getCellData(r, c);
                let cell = this.#cellRender(data);
                let cellModel = CellList.set(cell, r, c);
                if (data.item)
                    this.#itemRender(data.item, cellModel);
                if (cellModel.type === 'start' && isGame)
                    Player.init(cellModel);
                row.append(cell);
            }
            board.append(row);
        }
        this.#setGraphicsSetStyle(isGame);
        if (isGame) {
            const game = document.getElementById('game');
            document.querySelector('.level-title').textContent = this.#levelTitle;
            let boardH = board.getBoundingClientRect().height;
            let boardW = board.getBoundingClientRect().width;
            let gameH = game.getBoundingClientRect().height;
            let gameW = game.getBoundingClientRect().width;
            if (boardH < gameH && boardW < gameW) {
                game.classList.add('game-center');
            }
            else if (boardH < gameH) {
                game.classList.add('game-center', 'game-center-horizontal');
            }
            else if (boardW < gameW) {
                game.classList.add('game-center', 'game-center-vertical');
            }
        }
    }
    static #setGraphicsSetStyle(isGame) {
        let link = isGame ? '' : '../';
        let css = document.createElement('link');
        css.rel = "stylesheet";
        css.href = `${link}../sources/graphics_set/${this.#graphics_set}/style.css`;
        document.head.append(css);
    }
    static #cellRender(data) {
        let cell = document.createElement('div');
        cell.classList.add(...data.cell.class);
        cell.dataset.type = data.cell.type;
        return cell;
    }
    static #rowRender(rowNumber) {
        let row = document.createElement('div');
        row.classList.add('row');
        row.dataset.row = rowNumber;
        return row;
    }
    static #getCellData(row, col) {
        let { coord, cell, item } = this.#boardData.pop();
        if (row !== coord.row || col !== coord.col) {
            alert('Ошибка при создании игрового поля!');
            throw new Error(`Ошибка при создании игрового поля!
             Полученные данные для:
             ряд: ${coord.row}, колонка: ${coord.col}
             не соответствуют координатам текущей клетки:
             ряд: ${row}, колонка: ${col}`);
        }
        return { coord, cell, item };
    }
    static #itemRender(itemData, cellModel) {
        let item = document.createElement('div');
        item.classList.add(...itemData.class);
        item.dataset.type = itemData.type;
        switch (itemData.type) {
            case 'enemy':
                EnemyList.set(item, cellModel);
                break;
            case 'loot':
                LootList.set(item, cellModel);
                break;
            case 'hurdle':
                StoneList.set(item, cellModel);
                break;
            default:
                break;
        }
        return item;
    }
}
//# sourceMappingURL=LevelRender.js.map