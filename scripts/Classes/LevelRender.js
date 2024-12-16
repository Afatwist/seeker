import { Level } from "./Level.js";
import { CellList } from "./Lists/CellList.js";
import { EnemyList } from "./Lists/EnemyList.js";
import { LootList } from "./Lists/LootList.js";
import { StoneList } from "./Lists/StoneList.js";
import { CellModel } from "./Models/CellModel.js";
import { PlayerModel as Player } from "./Models/PlayerModel.js";

/** Генерирование игрового поля из Объекта с данными.
 * 
 * Создание списков с объектами поле. 
 */
export class LevelRender {

    /** Размеры поля
     * @type {{
     * rows: number,
     * cols: number
     * }}
     */
    static #boardSize;

    /** Массив со списком объектов, каждый объект - данные о клетке
    * @type {array<obj>}
    */
    static #boardData;

    /** Название уровня
     * @type {string}
     */
    static #levelTitle;

    /** ID текущего уровня
     * @type {number}
     */
    static #id

    /** Название набора графики для текущего уровня
     * @type {string} 
     */
    static #graphics_set;


    /** Устанавливает данные о текущем уровне     * 
     * @param {Level} levelData данные о размере поля и клетках
     * @returns {typeof LevelRender} экземпляр класса
     */
    static setData(levelData) {
        this.#id = levelData.id;
        this.#levelTitle = levelData.title;
        this.#boardSize = levelData.board.size;
        this.#boardData = levelData.board.data.reverse();
        this.#graphics_set = levelData.graphics_set;
        return this;
    }

    /** Создает игровое поле для текущего уровня
     * @param {boolean} isGame -
     * - true - подготовить поле к игре
     * - false - поле будет создано для конструктора
     * @returns {void}
     */
    static make(isGame = false) {
        const board = document.getElementById('board');

        for (let r = 1; r <= this.#boardSize.rows; r++) {
            let row = this.#rowRender(r);
            for (let c = 1; c <= this.#boardSize.cols; c++) {


                let data = this.#getCellData(r, c);
                data.row = r;
                data.col = c;

                let cell = this.#cellRender(data);
                let cellModel = CellList.set(cell, r, c); // добавление клетки в список

                if (data.item) this.#itemRender(data.item, cellModel);

                if (cellModel.type === 'start' && isGame) Player.init(cellModel);

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
            } else if (boardH < gameH) {
                game.classList.add('game-center', 'game-center-horizontal');
            } else if (boardW < gameW) {
                game.classList.add('game-center', 'game-center-vertical');
            }
        }
    }

    /** Подключение файла стилей для текущего уровня */
    static #setGraphicsSetStyle(isGame) {
        let link = isGame ? '' : '../';
        let css = document.createElement('link');
        css.rel = "stylesheet";
        css.href = `${link}../sources/graphics_set/${this.#graphics_set}/style.css`;

        document.head.append(css);
    }

    /** Генерирует клетку на игровом поле
     * 
     * @param {number} row - номер ряда
     * @param {number} col - номер колонки
     * @returns {HTMLDivElement}
     */
    static #cellRender(data) {
        let cell = document.createElement('div');

        cell.classList.add(...data.cell.class);
        cell.dataset.type = data.cell.type;

        return cell;
    }

    /** Генерирует ряд на игровом поле
     * 
     * @param {number} rowNumber - номер ряда
     * @returns {HTMLDivElement}
     */
    static #rowRender(rowNumber) {
        let row = document.createElement('div')
        row.classList.add('row')
        row.dataset.row = rowNumber
        return row
    }

    /** Получает характеристики для текущей клетки
     * 
     * @param {number} row - номер ряда
     * @param {number} col - номер колонки
     * @returns {{ cell: {}, item: {}}|Error} 
     * - данные клетки или ошибка при неудаче
     */
    static #getCellData(row, col) {
        let { coord, cell, item } = this.#boardData.pop()
        if (row !== coord.row || col !== coord.col) {
            alert('Ошибка при создании игрового поля!')
            throw new Error(`Ошибка при создании игрового поля!
             Полученные данные для:
             ряд: ${cellData.row}, колонка: ${cellData.col}
             не соответствуют координатам текущей клетки:
             ряд: ${row}, колонка: ${col}`);
        }
        return { cell, item }
    }

    /** Генерирует предмет для текущей клетки
     * 
     * @param {{  }} itemData - характеристики предмета
     * @param {CellModel} cellModel клетка предмета
     * @returns {HTMLDivElement}
     */
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