export class MainList {
    static all = new Map();
    static counter = 0;
    static makeList(dataType) {
        document.querySelectorAll(`[data-type='${dataType}']`).forEach(element => {
            console.log(element);
        });
    }
    static getAll() {
        return this.all;
    }
    static getOne(id) {
        return this.all.get(parseInt(id));
    }
    static delete(id) {
        this.all.delete(parseInt(id));
    }
    static getCounter() {
        return { counter: this.counter, map: this.all.size };
    }
}
//# sourceMappingURL=MainList.js.map