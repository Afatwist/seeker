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

    static #startCoordinates

    /** Массив всех клеток с камнями на поле
     * @type {Array<Element>}
     */
    static #itemsArr

    /** Массив врагов на поле
     * @type {Array<Element>}
     */
    static #enemiesArr

    static #modalResult


    /** Координаты клетки
     * @typedef {Object} CellCoordinates
     * @property {number} row - Номер ряда
     * @property {number} col - Номер колонки
     */


    /** Игровой процесс */
    static playing() {
        this.#prepare();
        this.#infoUpdate();
        // this.#enemyWalk();
        document.addEventListener('keydown', (e) => {
            const action = this.#actionCheck(e.code);

            if (action) {
                const { playerCoords, boardCoords } = this.#newCoordinates(action);

                this.#playerMover(playerCoords);
                this.#boardMover(boardCoords);
                // до сюда проверил
                // console.log(this.#itemsArr)
                this.#itemsArr.forEach(item => {
                    if (item.dataset.fall === '0') this.#itemFall(item);
                })

                this.#enemiesArr.forEach(enemy => {
                    if (enemy.dataset.walk === '0') this.#enemyAction(enemy)
                })



                this.#finishOpen();
                this.#infoUpdate();
                this.#gameWin();
                this.#gameOver();
            }

        });
    }

    /** Получение данных из DOM и настройки игры
     */
    static #prepare() {
        this.#horizonDeep = 5;
        this.#player = document.getElementById('player');
        this.#board = document.getElementById('board');
        this.#modalResult = document.getElementById('modal-result');

        // Начальные координаты поля
        const startCoordinatesRect = document.querySelector(`.cell[data-row="1"][data-col="1"]`).getBoundingClientRect();
        this.#startCoordinates = {
            top: startCoordinatesRect.top,
            left: startCoordinatesRect.left
        }

        this.#itemsArr = Array.from(document.querySelectorAll("[data-type='hurdle'], [data-type='loot']"));
        this.#enemiesArr = Array.from(document.querySelectorAll("[data-type='enemy']"));
    }

    static #infoUpdate() {
        document.querySelector('.loot-count').textContent = document.querySelectorAll('.item[data-type="loot"]').length;

        let finishStatus = document.querySelector('.finish-status');


        if (document.querySelector('.finish-close')) {
            finishStatus.textContent = 'Финиш закрыт';
        } else if (document.querySelector('.finish-open')) {
            finishStatus.textContent = 'Финиш открыт';
        } else {
            finishStatus.textContent = 'Игра без Финиша, просто соберите всю добычу';
        }

    }

    /** Определяет какая клавиша была нажата
     *  и возвращает игровое действие в зависимости от этого
     * 
     * @param {string} key KeyboardEvent.code
     * @returns {false | "down" | "up" | "left" | "right"}
     */
    static #actionCheck(key) {
        switch (key) {
            case 'KeyS': case 'ArrowDown': return 'down';
            case 'KeyW': case 'ArrowUp': return 'up';
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
                    this.#lootCollector(item)
                    cell.append(this.#player)
                }

                // Клетки с камнями
                if (item.dataset.type === 'hurdle') {

                    let cellNext = document.querySelector(`.cell[data-row="${stoneC.row}"][data-col="${stoneC.col}"]`)

                    if (this.#isCellFree(cellNext)) {
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
            if (this.#isCellFree(cell)) {
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



    /** Проверяет клетки под предметом, а также по сторонам от предмета и, если есть пустая, перемещает в нее предмет
     * 
     * @param {Element} item - предмет
     */
    static #itemFall(item) {
        // проверка, что предмет все еще существует
        if (!this.#itemsArr.includes(item)) return;

        let { row, col } = this.#getItemCoord(item);

        // клетка под предметом, для падения вниз
        let cellBottom = document.querySelector(`.cell[data-row="${row + 1}"][data-col="${col}"]`);
        if (!cellBottom) { item.dataset.fall = '0'; return }

        this.#itemLandingOnPlayer(item, cellBottom)

        // клетки справа, для скатывания направо
        let right = document.querySelector(`.cell[data-row="${row}"][data-col="${col + 1}"]`);
        let rightBottom = document.querySelector(`.cell[data-row="${row + 1}"][data-col="${col + 1}"]`);
        let rightSide = this.#isCellFree(right) && this.#isCellFree(rightBottom);


        // клетки слева, для скатывания налево
        let left = document.querySelector(`.cell[data-row="${row}"][data-col="${col - 1}"]`);
        let leftBottom = document.querySelector(`.cell[data-row="${row + 1}"][data-col="${col - 1}"]`);
        let leftSide = this.#isCellFree(left) && this.#isCellFree(leftBottom);

        // предмет лежит на другом предмете, т.е в клетке под предметом что-то есть, но не игрок
        let hasCellBottomItem = cellBottom.hasChildNodes() &&
            cellBottom.childNodes[0] !== this.#player;

        /** перемещение предмета в указанную клетку */
        const fallStep = (item, targetCell) => {
            item.dataset.fall = parseInt(item.dataset.fall) + 1;
            targetCell.append(item);

            setTimeout(() => this.#itemFall(item), 120);
        }

        // падение предмета
        if (this.#isCellFree(cellBottom)) fallStep(item, cellBottom);
        else if (rightSide && hasCellBottomItem) fallStep(item, rightBottom);
        else if (leftSide && hasCellBottomItem) fallStep(item, leftBottom);
        else item.dataset.fall = '0';
    }

    /** Падение предмета на голову игрока
     *  
     * @param {Element} item 
     * @param {Element} cellBottom 
     * @returns 
     */
    static #itemLandingOnPlayer(item, cellBottom) {

        if (!item || !cellBottom) return
        if (!cellBottom.hasChildNodes()) return
        if (cellBottom.childNodes[0] !== this.#player) return


        if (item.dataset.type === 'hurdle' && parseInt(item.dataset.fall) > 1) {
            cellBottom.dataset.type = 'die';
            cellBottom.classList.replace('free', 'player-die')
            this.#player.remove();
            return;
        }

        if (item.dataset.type === 'loot' && parseInt(item.dataset.fall) > 1) {
            this.#lootCollector(item);
        }
    }



    static #lootCollector(loot) {
        loot.remove()
        let index = this.#itemsArr.indexOf(loot)
        this.#itemsArr.splice(index, 1)
    }


    /** Возвращает координаты клетки игрока
     * 
     * @returns {CellCoordinates}
     * - координаты клетки с игроком
     */
    static #getPlayerCoord() {
        return this.#getCellCoord(this.#player.parentElement)
    }


    /** Возвращает координаты клетки с предметом
     *  @param {Element} item - предмет
     * @returns {CellCoordinates}
     * - координаты клетки с предметом
     */
    static #getItemCoord(item) {
        return this.#getCellCoord(item.parentElement)
    }


    /** Возвращает координаты указанной клетки
     * 
     * @param {Element} cell 
     * @returns {CellCoordinates}
     * - координаты клетки
     */
    static #getCellCoord(cell) {
        return {
            row: parseInt(cell?.dataset.row),
            col: parseInt(cell?.dataset.col),
        }
    }


    /** Проверяет, что клетка существует и пуста, 
     * т.е у нее тип 'free' и в ней нет других предметов или игрока
     * 
     * @param {Element | null} cell 
     * @returns {boolean}
     */
    static #isCellFree(cell) {
        if (!cell) return false
        if (!['free', 'start', 'finish-close', 'finish-open'].includes(cell.dataset.type)) return false
        if (cell.hasChildNodes()) return false

        return true
    }


    static #getBoardPosition() {
        const style = window.getComputedStyle(this.#board)
        return {
            top: parseInt(style.getPropertyValue('top')),
            left: parseInt(style.getPropertyValue('left'))
        }
    }

    //####################################//
    //######### Поведение врагов #########//
    //####################################//

    /** Поведение врага на поле
     * 
     * @param {Element} enemy враг
     * @param {Element | null} prevCell клетка, в которой враг был раньше
     * @returns 
     */
    static #enemyAction(enemy, prevCell = null) {
        // console.log(enemy)
        if (!enemy || !this.#enemiesArr.includes(enemy)) return;

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

        setTimeout(() => this.#enemyAction(enemy, currentCell), 500);
    }

    /** Обычное поведение врага, когда игрок далеко.
     * Возвращает новую клетку для перемещения если она есть
     * 
     * @param {Element} enemy враг
     * @param {Element | null} prevCell клетка, в которой враг находился раньше 
     * @returns {Element | null}
     */
    static #enemyWalkCell(enemy, prevCell = null) {
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
    static #enemyHuntCell(enemy) {
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
    static #enemyCellsAround(enemy) {
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
    static #enemyDistance(cell) {
        let { row, col } = this.#getCellCoord(cell);
        let playerCoords = this.#getPlayerCoord();
        let distance = Math.floor(Math.hypot(row - playerCoords.row, col - playerCoords.col));
        return distance
    }

    /** Меняет изображение врага в зависимости от расстояния до игрока
     * 
     * @param {Element} enemy 
     */
    static #enemyPicChanger(enemy) {
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

    static #enemyDie(enemy) {
        let { row, col } = this.#getItemCoord(enemy);
        let item = document.querySelector(`.cell[data-row="${row - 1}"][data-col="${col}"]`)?.children[0]

        if (item?.dataset.type !== 'hurdle') return

        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                let cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
                if (!cell) continue;
                if (cell.classList.contains('none')) continue;
                if (cell.hasChildNodes()) cell.removeChild(cell.firstChild);

                cell.dataset.type = 'free';
                cell.classList.remove('ground', 'wall')
                cell.classList.add('fire');

                setTimeout(() => {
                    cell.classList.replace('fire', 'free');
                }, 300);
            }
        }
        this.#itemsArr.splice(this.#itemsArr.indexOf(item), 1);
        this.#enemiesArr.splice(this.#enemiesArr.indexOf(enemy), 1);
    }

    //#####################################//
    //##### Методы при окончании игры #####//
    //#####################################//

    /** Если собраны все сокровища, открывает клетку финиша для выхода из уровня
     */
    static #finishOpen() {
        // проверка наличия драгоценностей на поле
        let loots = this.#itemsArr.every(item => item.dataset.type !== 'loot');
        if (!loots) return

        let finish = document.querySelector('.finish-close');
        if (finish) {
            finish.classList.replace('finish-close', 'finish-open');
            finish.dataset.type = 'finish-open';
        }
    }

    /** При победе на уровне */
    static #gameWin() {
        // если клетки финиша нет, то победа происходит после сбора всей добычи
        let lootsNotExists = this.#itemsArr.every(item => item.dataset.type !== 'loot')
        let finishCellNotExists = !(document.querySelector('.cell.finish-close') ||
            document.querySelector('.cell.finish-open'))

        // проверка, что игрок зашел на клетку "финиш" и он открыт
        let finish = this.#player.parentElement?.classList.contains('finish-open')
        if (finish || (lootsNotExists && finishCellNotExists)) {
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
                this.#modalResult.querySelector('.modal-content').innerHTML = '<p>ВЫ ПРОИГРАЛИ!<br>ПОПРОБУЙТЕ ЕЩЕ РАЗ</p>';
                this.#modalResult.classList.add('modal-show');
            }, 200);
        }
    }
}