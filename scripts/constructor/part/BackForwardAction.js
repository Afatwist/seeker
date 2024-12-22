import { BoardInfo } from "./BoardInfo.js";
import { ControlBtn } from "./ControlBtn.js";
import { Main } from "./Main.js";
export class BackForwardAction {
    static #redactor;
    static #arrBackward = [];
    static #arrForward = [];
    static #backwardSaveChecker = false;
    static #btnBackward;
    static #btnForward;
    static init() {
        this.#redactor = document.querySelector('.redactor');
        this.#btnBackward = document.getElementById('btnBackward');
        this.#btnForward = document.getElementById('btnForward');
        return this;
    }
    static listener() {
        this.#backwardListener();
        this.#forwardListener();
    }
    static addToArrBackward() {
        if (this.#arrBackward.length > 20)
            this.#arrBackward.shift();
        const boardClone = document.getElementById('board').cloneNode(true);
        this.#arrBackward.push(boardClone);
        this.#arrForward.length = 0;
        this.#btnForward.disabled = true;
        this.#btnBackward.disabled = false;
        this.#backwardSaveChecker = true;
    }
    static #backwardListener() {
        this.#btnBackward.addEventListener('click', () => {
            if (this.#arrBackward.length > 0) {
                let data = this.#arrBackward.pop();
                if (this.#arrBackward.length === 0)
                    this.#btnBackward.disabled = true;
                if (this.#backwardSaveChecker) {
                    this.addToArrBackward();
                    this.#arrForward.push(this.#arrBackward.pop());
                    this.#backwardSaveChecker = false;
                }
                this.#arrForward.push(data);
                this.#btnForward.disabled = false;
                this.#boardRestore(data);
            }
        });
    }
    static #forwardListener() {
        this.#btnForward.addEventListener('click', () => {
            if (this.#arrForward.length > 0) {
                let data = this.#arrForward.pop();
                if (this.#arrForward.length === 0)
                    this.#btnForward.disabled = true;
                this.#arrBackward.push(data);
                this.#btnBackward.disabled = false;
                this.#boardRestore(data);
            }
        });
    }
    static #boardRestore(data) {
        document.getElementById('board').remove();
        data.querySelectorAll('.cell').forEach(Main.cellEvent);
        data.querySelectorAll('.control-button').
            forEach(ControlBtn.addEvent);
        this.#redactor.append(data);
        BoardInfo.update(true);
    }
}
//# sourceMappingURL=BackForwardAction.js.map