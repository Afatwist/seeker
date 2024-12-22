import { CellList } from "../Lists/CellList.js";
import { EnemyList } from "../Lists/EnemyList.js";
import { Player } from "./PlayerModel.js";
import { StoneModel } from "./StoneModel.js";
import { LootModel } from "./LootModel.js";
import { ObjectModel } from "./MainModels/ObjectModel.js";
import { ListsActivator } from "../Lists/HelperForList.js";
import { Game } from "../../game/Game.js";
export class EnemyModel extends ObjectModel {
    list = 'enemy';
    active = false;
    killed = false;
    previousCell;
    #distance = 1000;
    constructor(enemy, id, cell) {
        super(enemy, id);
        this.cellInit(cell);
        this.active = false;
        this.previousCell = null;
        this.distanceUpdate();
        this.picChanger();
    }
    distanceUpdate() {
        if (!Player.alive) {
            this.#distance = 100000;
            console.error('Игрок погиб, но враги продолжают двигаться');
            return;
        }
        this.#distance = CellList.distance(this.getCoordinates(), Player.getCoordinates());
    }
    die() {
        let { row, col } = this.getCoordinates();
        const cellSet = CellList.getSetSquare(row, col);
        cellSet.forEach(cell => {
            if (cell.classContains('all', 'none'))
                return;
            if (cell.itemHas()) {
                let child = cell.itemGet();
                if (child === Player)
                    Player.die();
                else if (child instanceof LootModel)
                    child.remove();
                else if (child instanceof StoneModel)
                    child.remove();
                else if (child instanceof EnemyModel) {
                    if (child.id === this.id) {
                        this.killed = true;
                        this.remove();
                    }
                    else
                        child.die();
                }
                else
                    console.error('При гибели врага, предмет в клетке не определен', child);
            }
            cell.type = 'free';
            cell.element.dataset.type = 'free';
            cell.classReplace(['ground', 'wall'], ['fire']);
            setTimeout(() => {
                cell.classReplace(['fire'], ['free']);
            }, 300);
        });
        setTimeout(ListsActivator, 300);
    }
    #walk() {
        let cells = this.#cellsAround();
        if (cells.length > 1) {
            cells = cells.filter(cell => cell !== this.previousCell);
        }
        let index = Math.floor(Math.random() * cells.length);
        return cells[index];
    }
    #hunt() {
        if (this.#distance > 20)
            return null;
        const stepMaker = (cell, way = []) => {
            return {
                cell: cell,
                way: way
            };
        };
        const isStepInArray = (step, array, mode) => {
            for (const element of array) {
                if (element.cell === step.cell) {
                    if (mode && element.way.length > step.way.length)
                        element.way = step.way;
                    return true;
                }
            }
            return false;
        };
        const cellChecked = [];
        const stepsQueue = [stepMaker(this.cell)];
        const stepsReady = [];
        const finalPath = [];
        let iterationW = 0;
        let iterationF = 0;
        loop_while: while (stepsQueue.length > 0) {
            iterationW++;
            if (iterationW > 500) {
                console.log('error full iterations');
                break;
            }
            let checkingStep = stepsQueue.shift();
            stepsReady.push(checkingStep);
            let cellsSet = CellList.getSetCross(checkingStep.cell.row, checkingStep.cell.col);
            for (let i = cellsSet.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [cellsSet[i], cellsSet[j]] = [cellsSet[j], cellsSet[i]];
            }
            loop_forOf: for (const cell of cellsSet) {
                if (cellChecked.includes(cell))
                    continue loop_forOf;
                cellChecked.push(cell);
                iterationF++;
                let path = checkingStep.way.slice();
                path.push(checkingStep.cell);
                if (cell.hasPlayer()) {
                    path.push(cell);
                    if (finalPath.length === 0)
                        finalPath.push(...path);
                    else if (finalPath.length >= path.length) {
                        finalPath.length = 0;
                        finalPath.push(...path);
                        console.log("Путь переписан");
                    }
                    if (finalPath.length > 3)
                        break loop_while;
                }
                else if (cell.isFree()) {
                    let step = stepMaker(cell, path);
                    if (!(isStepInArray(step, stepsQueue, true) || isStepInArray(step, stepsReady, false))) {
                        stepsQueue.push(step);
                    }
                }
            }
        }
        if (finalPath.length < 20)
            return finalPath[1];
        return null;
    }
    #cellsAround() {
        let { row, col } = this.getCoordinates();
        return CellList.getSetCross(row, col).filter(cell => {
            if (cell.type !== 'free')
                return false;
            if (cell.itemHas() && !cell.hasPlayer())
                return false;
            return true;
        });
    }
    picChanger() {
        if (this.#distance < 3) {
            this.classReplace(['enemy-walk', 'enemy-wary'], ['enemy-hunt']);
        }
        else if (this.#distance < 5) {
            this.classReplace(['enemy-hunt', 'enemy-walk'], ['enemy-wary']);
        }
        else {
            this.classReplace(['enemy-hunt', 'enemy-wary'], ['enemy-walk']);
        }
    }
    activity() {
        this.active = true;
        if (this.killed)
            return;
        if (!this.element || !EnemyList.getOne(this.id)) {
            console.error(`Враг с id: ${this.id} был уничтожен и удален из списка, но скрипт продолжается`, `Значение killed: ${this.killed}`);
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
                return;
            }
            ;
            this.activity();
        }, 500);
    }
}
//# sourceMappingURL=EnemyModel.js.map