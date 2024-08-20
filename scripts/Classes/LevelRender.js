import { Level } from "./Level.js";


/** Создание игрового поля по заданным размерам
 * @class LevelRender
 */
export class LevelRender {

    /** Объект с размерами поля: { "rows": num, "cols": num}
     * @type {obj}
     */
    static #boardSize; //: {obj:{ "rows": num, "cols": num }}

    /** Массив со списком объектов, каждый объект - данные о клетке
    * @type {array<obj>}
    */
    static #boardData;

    static #levelTitle;

    /** 
     * @property {string} название набора графики для текущего уровня
     */
    static #graphics_set;

    /** Описание клеток и предметов на поле */
    static #set_description;

    /** Устанавливает данные о текущем уровне
     * 
     * @param {typeof Level} levelData данные о размере поля и клетках
     * @returns {typeof LevelRender} экземпляр класса
     */
    static setData(levelData, set_description = false) {
        this.#levelTitle = levelData.title;
        this.#boardSize = levelData.board.size;
        this.#boardData = levelData.board.data.reverse();
        this.#graphics_set = levelData.graphics_set;
        this.#set_description = set_description;
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
        const game = document.getElementById('game');

        for (let r = 1; r <= this.#boardSize.rows; r++) {
            let row = this.#rowRender(r);
            for (let c = 1; c <= this.#boardSize.cols; c++) {

                let cell = this.#cellRender(r, c);
                row.append(cell);

            }
            board.append(row);
        }
        this.#setGraphicsSetStyle(isGame);

        if (isGame) {
            this.#addPlayer();

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

    /** Добавляет фишку игрока на игровое поле */
    static #addPlayer() {
        let player = document.createElement('div');
        player.classList.add('item', 'player');
        player.id = 'player';
        document.querySelector('.cell.start').append(player);
    }

    /** Генерирует клетку на игровом поле
     * 
     * @param {number} row - номер ряда
     * @param {number} col - номер колонки
     * @returns {HTMLDivElement}
     */
    static #cellRender(row, col) {
        let cell = document.createElement('div');
        let data = this.#getCellData(row, col);

        // this.#addCellDataset(data.cell.type);
        cell.classList.add(...data.cell.class);
        cell.dataset.type = data.cell.type;
        cell.dataset.row = row;
        cell.dataset.col = col;

        if (data.item) cell.append(this.#itemRender(data.item))

        return cell
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

    /** Добавляет атрибуты dataset
     * из файла описания графического набора
     * к клеткам и предметам на поле */
    /*   static #addCellDataset(cellType) {
         let test = this.#set_description.items.type.set.filter(item => item.type === cellType)[0]
         
          console.log(test)
          return this;
  
      } */

    /** Генерирует предмет для текущей клетки
     * 
     * @param {{  }} itemData - характеристики предмета
     * @returns {HTMLDivElement}
     */
    static #itemRender(itemData) {
        let item = document.createElement('div');

        item.classList.add(...itemData.class);
        item.dataset.type = itemData.type;

        if (['loot', 'hurdle'].includes(itemData.type)) {
            item.dataset.fall = 0;
        }

        if (['enemy'].includes(itemData.type)) {
            item.dataset.walk = 0;
        }

        return item;
    }
}