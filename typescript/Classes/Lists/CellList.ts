import { CellModel } from "../Models/CellModel.js";

/** Список всех клеток на поле */
export class CellList {

    /** Полный список всех клеток на поле
     * - string - id клетки 
     * - CellModel - объект содержащий данные клетки и сам HTMLElement клетки
     */
    static #all: Map<ID, CellModel> = new Map();

    /** клетка Финиш */
    static finish: CellModel | null = null;

    /** Добавить клетку в список
     * 
     * @param cell HTML-элемент клетки
     * @param row номер ряда
     * @param col номер колонки
     */
    static set(cell: HTMLDivElement, row: number, col: number): CellModel {
        const item = new CellModel(cell, row, col);
        this.#all.set(item.id, item);

        if (item.type === 'finish-open' || item.type === 'finish-close') this.finish = item;
        return item;
    }

    /** Полный список всех клеток на поле
     * - ID - id клетки 
     * - CellModel - объект содержащий данные клетки и сам HTMLElement клетки
     */
    static getAll(): Map<ID, CellModel> {
        return this.#all;
    }

    /** Возвращает CellModel с указанными координатами 
     * @param row номер ряда
     * @param col номер колонки
      */
    static getOne(row: string | number, col: string | number): CellModel | undefined {
        return this.#all.get(CellModel.idMaker(row, col));
    }

    /** Возвращает Набор клеток: [верхнюю, нижнюю, левую, правую]
     * относительно текущих координат
     * @param row номер ряда
     * @param col номер колонки
     */
    static getSetCross(row: number, col: number): CellModel[] {
        return [
            this.getOne(row - 1, col),
            this.getOne(row + 1, col),
            this.getOne(row, col - 1),
            this.getOne(row, col + 1)
        ].filter(cell => cell instanceof CellModel);
    }

    /** Возвращает Набор клеток в виде квадрата 3*3 с текущей клеткой в центре
     * @param row номер ряда
     * @param col номер колонки
     */
    static getSetSquare(row: number, col: number): CellModel[] {
        // координаты клеток
        // -1,-1    -1,0   -1,+1
        //  0,-1     0,0    0,+1
        //  +1,-1   +1,0   +1,+1
        return [
            this.getOne(row - 1, col - 1),
            this.getOne(row - 1, col),
            this.getOne(row - 1, col + 1),

            this.getOne(row, col - 1),
            this.getOne(row, col),
            this.getOne(row, col + 1),

            this.getOne(row + 1, col - 1),
            this.getOne(row + 1, col),
            this.getOne(row + 1, col + 1)
        ].filter(cell => cell instanceof CellModel);
    }

    /** Кратчайшее расстояние между клетками 
     * @param coord_1 координаты первого объекта
     * @param coord_2 координаты второго объекта
     */
    static distance(coord_1: ICoordinates, coord_2: ICoordinates): number {
        return Math.floor(Math.hypot(coord_1.row - coord_2.row, coord_1.col - coord_2.col));
    }

    //!!! удалить после тестов
    /** Временный метод
     * 
     * Проверяет что предмет в клетке на поле и в свойстве клетки item совпадают
     */
    static cellChecker(): void {
        this.#all.forEach(cell => {
            let item = cell.item?.element;
            let child = cell.element.children[0]

            if (item !== child) {
                console.error('ошибка в клетке', cell, 'предмет', item, 'html-элемент в клетке', child)
            }
        })
    }
}