import { CellList } from "../Lists/CellList.js"
import { EnemyList } from "../Lists/EnemyList.js"
import { CellModel } from "./CellModel.js"
import { Player } from "./PlayerModel.js"
import { StoneModel } from "./StoneModel.js"
import { LootModel } from "./LootModel.js"
import { ObjectModel } from "./MainModels/ObjectModel.js"
import { ListsActivator } from "../Lists/HelperForList.js"
import { Game } from "../../game/Game.js"


// ! Исправить метод distance

export class EnemyModel extends ObjectModel {
    list: ItemList = 'enemy';

    /** Показывает, активность врага
     * 
     * Вначале для всех false, если враг может двигаться, то меняется на true
     */
    active: boolean = false;

    /** Показывает, что враг убит. После гибели будет true
     * !!! временный костыль
     * @type {boolean}
     */
    killed: boolean = false

    /** Предыдущая клетка */
    previousCell: CellModel | null

    /** Дистанция до игрока */
    #distance: number = 1000;

    /** Создание нового Врага
     * @param enemy - HTML-элемент врага
     * @param id - ID - уникальный номер врага в списке врагов
     * @param cell - Модель клетки, в которой находится враг 
     */
    constructor(enemy: HTMLDivElement, id: ID, cell: CellModel) {
        super(enemy, id);
        this.cellInit(cell);

        this.active = false;
        this.previousCell = null;

        this.distanceUpdate();
        this.picChanger();
    }

    /** Обновить значение дистанции от предмета до игрока */
    distanceUpdate(): void {
        if (!Player.alive) {
            // !!!!временное решение
            this.#distance = 100000
            console.error('Игрок погиб, но враги продолжают двигаться');
            return
        }

        this.#distance = CellList.distance(this.getCoordinates(), Player.getCoordinates());
    }

    /** Гибель врага */
    die(): void {
        let { row, col } = this.getCoordinates();
        const cellSet = CellList.getSetSquare(row, col);

        cellSet.forEach(cell => {

            if (cell.classContains('all', 'none')) return;

            if (cell.itemHas()) {
                let child = cell.itemGet();

                if (child === Player) Player.die();
                else if (child instanceof LootModel) child.remove();
                else if (child instanceof StoneModel) child.remove();
                else if (child instanceof EnemyModel) {

                    if (child.id === this.id) {
                        this.killed = true;
                        this.remove();
                    } else child.die();

                } else console.error('При гибели врага, предмет в клетке не определен', child);
            }

            cell.type = 'free'
            cell.element.dataset.type = 'free'; //!!! удалить потом эту строку
            cell.classReplace(['ground', 'wall'], ['fire'])

            setTimeout(() => {
                cell.classReplace(['fire'], ['free'])
            }, 300);
        });

        setTimeout(ListsActivator, 300);
    }

    /** Обычное поведение врага, когда игрок далеко или до него невозможно добраться
     * Возвращает новую клетку для перемещения если она есть
     */
    #walk(): CellModel | null {
        let cells = this.#cellsAround();

        if (cells.length > 1) {
            cells = cells.filter(cell => cell !== this.previousCell);
        }

        let index = Math.floor(Math.random() * cells.length);

        return cells[index];
    }

    /** Если игрок подходит близко к врагу, у врага включается режим охоты,
     * и он перемещается в ближайшую клетку к игроку
     */
    #hunt(): CellModel | null {
        if (this.#distance > 20) return null;

        /** Шаг между текущей клеткой и игроком */
        interface IStep {
            cell: CellModel
            distance?: number
            way: CellModel[]
        }

        /** Создает Шаг от текущей клетки к игроку 
         * @param cell текущая клетка 
         * @param way путь между стартовой и текущей клетками 
         */
        const stepMaker = (cell: CellModel, way: CellModel[] = []): IStep => {
            // let cellCoord = {
            //     row: cell.row,
            //     col: cell.col
            // };

            return {
                cell: cell,
                // distance: CellList.distance(cellCoord, Player.getCoordinates()),
                way: way
            }
        }

        /** Проверяет наличие Шага в указанном массиве.
         * Если находит, то проверяет длины пути и заменяет на более короткий.
         * @param step - текущий Шаг
         * @param array - массив с Шагами
         * @param mode - нужно ли оптимизировать путь от начальной клетки к текущему шагу
         */
        const isStepInArray = (step: IStep, array: IStep[], mode: boolean): boolean => {
            for (const element of array) {
                if (element.cell === step.cell) {
                    if (mode && element.way.length > step.way.length) element.way = step.way;
                    return true;
                }
            }
            return false;
        }

        /** Тестовый массив для добавления проверенных клеток */
        const cellChecked: CellModel[] = [];

        /** Очередь шагов на проверку */
        const stepsQueue: IStep[] = [stepMaker(this.cell)]

        /** Массив проверенных шагов */
        const stepsReady: IStep[] = [];

        /** Путь между врагом и игроком */
        const finalPath: CellModel[] = [];

        /**  временный параметр, защита от бесконечного цикла */
        let iterationW = 0; // !!!
        let iterationF = 0; // !!!

        loop_while: while (stepsQueue.length > 0) {

            // !!!защита от зависания для тестов
            iterationW++
            if (iterationW > 500) {
                console.log('error full iterations');
                break;
            }

            /** Текущий проверяемый Шаг */
            let checkingStep: IStep = stepsQueue.shift()!;
            stepsReady.push(checkingStep);

            /** Массив клеток смежных c проверяемой */
            let cellsSet: CellModel[] = CellList.getSetCross(checkingStep.cell.row, checkingStep.cell.col);

            // перемешивание клеток для эффекта случайности
            for (let i = cellsSet.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [cellsSet[i], cellsSet[j]] = [cellsSet[j], cellsSet[i]];
            }

            loop_forOf: for (const cell of cellsSet) {

                // если такая клетка уже проверялась, то пропускаю, 
                // для поля 10*10 получается 100 итераций, вместо 345.
                if (cellChecked.includes(cell)) continue loop_forOf;
                cellChecked.push(cell);

                iterationF++; // !!! ДЛЯ ТЕСТА

                /** Путь к текущей клетке от стартовой */
                let path = checkingStep.way.slice();
                path.push(checkingStep.cell);

                // Если игрок находится в этой клетке
                if (cell.hasPlayer()) {
                    path.push(cell);
                    if (finalPath.length === 0) finalPath.push(...path);
                    else if (finalPath.length >= path.length) {
                        // ?? в эту зону скрипт вообще не заходит
                        finalPath.length = 0;
                        finalPath.push(...path);
                        console.log("Путь переписан");
                    }

                    // ?? не останавливать цикл для поиска оптимального пути
                    if (finalPath.length > 3) break loop_while;

                } else if (cell.isFree()) {



                    let step = stepMaker(cell, path);
                    // Если такого шага еще нет в очереди и среди готовых, добавляю в очередь
                    if (!(isStepInArray(step, stepsQueue, true) || isStepInArray(step, stepsReady, false))) {
                        stepsQueue.push(step);
                    }


                }
            }

            // ??? нужна ли эта сортировка?
            // при включении сортировки, надо включить свойство distance при создании шага
            // stepsQueue.sort((a, b) => b.distance - a.distance);
        }
        // console.log(stepsQueue.length, stepsReady.length)
        // console.log('Количество итераций циклов while и for:', { iterationW, iterationF });
        // console.log('количество проверенных клеток', cellChecked.length);

        if (finalPath.length < 20) return finalPath[1];
        return null;
    }

    /** Возвращает доступные для перемещения клетки вокруг врага */
    #cellsAround(): CellModel[] {
        let { row, col } = this.getCoordinates();

        return CellList.getSetCross(row, col).filter(cell => {
            if (cell.type !== 'free') return false;
            if (cell.itemHas() && !cell.hasPlayer()) return false;
            return true
        })
    }

    /** Меняет изображение врага в зависимости от дистанции до игрока */
    picChanger(): void {
        if (this.#distance < 3) {
            this.classReplace(['enemy-walk', 'enemy-wary'], ['enemy-hunt']);
        } else if (this.#distance < 5) {
            this.classReplace(['enemy-hunt', 'enemy-walk'], ['enemy-wary']);
        } else {
            this.classReplace(['enemy-hunt', 'enemy-wary'], ['enemy-walk']);
        }
    }

    /** Поведение врага на поле */
    activity(): void {

        this.active = true;

        if (this.killed) return;

        if (!this.element || !EnemyList.getOne(this.id)) {
            console.error(`Враг с id: ${this.id} был уничтожен и удален из списка, но скрипт продолжается`,
                `Значение killed: ${this.killed}`);
        }

        let nextCell = this.#hunt() || this.#walk();

        if (!nextCell) {
            this.active = false;
            return;
        }

        if (nextCell.hasPlayer()) {
            Player.die();
            this.classAdd('enemy-killer');
            return;
        }

        this.previousCell = this.cell;
        this.pushToCell(nextCell);
        ListsActivator();

        this.distanceUpdate();
        this.picChanger();

        setTimeout(() => {
            if (Game.pause || !Player.alive) {
                this.active = false;
                return
            };
            this.activity();
        }, 500);

    }
}