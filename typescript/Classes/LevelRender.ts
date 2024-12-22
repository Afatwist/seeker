// import { Level } from "./Level.js";
import { CellList } from "./Lists/CellList.js";
import { EnemyList } from "./Lists/EnemyList.js";
import { LootList } from "./Lists/LootList.js";
import { StoneList } from "./Lists/StoneList.js";
import { CellModel } from "./Models/CellModel.js";
import { Player } from "./Models/PlayerModel.js";

/** Генерирование игрового поля из Объекта с данными.
 * 
 * Создание списков с объектами поле. 
 */
export class LevelRender {

    /** Размеры поля */
    static #boardSize: IBoardSize;

    /** Массив со списком объектов, каждый объект - данные о клетке*/
    static #boardData: IDataForCoord[];

    /** Название уровня */
    static #levelTitle: string;

    /** ID текущего уровня */
    // static #id: number;

    /** Название набора графики для текущего уровня */
    static #graphics_set: string;


    /** Устанавливает данные о текущем уровне 
     * @param levelData данные о размере поля и клетках
     */
    static setData(levelData: ILevelData): LevelRender {
        // this.#id = levelData.id;
        this.#levelTitle = levelData.title;
        this.#boardSize = levelData.board.size;
        this.#boardData = levelData.board.data.reverse();
        this.#graphics_set = levelData.graphics_set;
        return this;
    }

    /** Создает игровое поле для текущего уровня
     * @param isGame -
     * - true - подготовить поле к игре
     * - false - поле будет создано для конструктора
     */
    static make(isGame: boolean = false): void {
        const board = document.getElementById('board')!;

        for (let r = 1; r <= this.#boardSize.rows; r++) {
            let row = this.#rowRender(r);
            for (let c = 1; c <= this.#boardSize.cols; c++) {


                let data = this.#getCellData(r, c);

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
            const game = document.getElementById('game')!;

            document.querySelector('.level-title')!.textContent = this.#levelTitle;

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
    static #setGraphicsSetStyle(isGame: boolean): void {
        let link = isGame ? '' : '../';
        let css = document.createElement('link');
        css.rel = "stylesheet";
        css.href = `${link}../sources/graphics_set/${this.#graphics_set}/style.css`;

        document.head.append(css);
    }

    /** Генерирует клетку на игровом поле */
    static #cellRender(data: IDataForCoord): HTMLDivElement {
        let cell = document.createElement('div');

        cell.classList.add(...data.cell.class);
        cell.dataset.type = data.cell.type;

        return cell;
    }

    /** Генерирует ряд на игровом поле 
     * @param rowNumber - номер ряда
     */
    static #rowRender(rowNumber: number): HTMLDivElement {
        let row = document.createElement('div')
        row.classList.add('row')
        row.dataset.row = rowNumber as unknown as string
        return row
    }

    /** Получает характеристики для текущей клетки 
     * @param row - номер ряда
     * @param col - номер колонки
     * @returns {{ cell: {}, item: {}}|Error} 
     * - данные клетки или ошибка при неудаче
     */
    static #getCellData(row: number, col: number): IDataForCoord {
        let { coord, cell, item } = this.#boardData.pop() as IDataForCoord
        if (row !== coord.row || col !== coord.col) {
            alert('Ошибка при создании игрового поля!')
            throw new Error(`Ошибка при создании игрового поля!
             Полученные данные для:
             ряд: ${coord.row}, колонка: ${coord.col}
             не соответствуют координатам текущей клетки:
             ряд: ${row}, колонка: ${col}`);
        }
        return { coord, cell, item }
    }

    /** Генерирует предмет для текущей клетки 
     * @param itemData - характеристики предмета
     * @param cellModel клетка предмета
     */
    static #itemRender(itemData: IDataItem, cellModel: CellModel): HTMLDivElement {
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