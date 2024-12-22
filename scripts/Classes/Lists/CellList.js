import { CellModel } from "../Models/CellModel.js";
export class CellList {
    static #all = new Map();
    static finish = null;
    static set(cell, row, col) {
        const item = new CellModel(cell, row, col);
        this.#all.set(item.id, item);
        if (item.type === 'finish-open' || item.type === 'finish-close')
            this.finish = item;
        return item;
    }
    static getAll() {
        return this.#all;
    }
    static getOne(row, col) {
        return this.#all.get(CellModel.idMaker(row, col));
    }
    static getSetCross(row, col) {
        return [
            this.getOne(row - 1, col),
            this.getOne(row + 1, col),
            this.getOne(row, col - 1),
            this.getOne(row, col + 1)
        ].filter(cell => cell instanceof CellModel);
    }
    static getSetSquare(row, col) {
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
    static distance(coord_1, coord_2) {
        return Math.floor(Math.hypot(coord_1.row - coord_2.row, coord_1.col - coord_2.col));
    }
    static cellChecker() {
        this.#all.forEach(cell => {
            let item = cell.item?.element;
            let child = cell.element.children[0];
            if (item !== child) {
                console.error('ошибка в клетке', cell, 'предмет', item, 'html-элемент в клетке', child);
            }
        });
    }
}
//# sourceMappingURL=CellList.js.map