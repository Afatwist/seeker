export class MainModel {
    element;
    id;
    constructor(element, id) {
        this.element = element;
        this.id = id;
    }
    classContains(type, ...classes) {
        if (type === "all") {
            return classes.every(el => this.element.classList.contains(el));
        }
        else {
            return classes.some(el => this.element.classList.contains(el));
        }
    }
    classAdd(...classes) {
        this.element.classList.add(...classes);
    }
    classRemove(...classes) {
        this.element.classList.remove(...classes);
    }
    classReplace(removing, adding) {
        this.classRemove(...removing);
        this.classAdd(...adding);
    }
    classAddTemp(classes, time = 700) {
        this.classAdd(...classes);
        setTimeout(() => {
            this.classRemove(...classes);
        }, time);
    }
}
//# sourceMappingURL=MainModel.js.map