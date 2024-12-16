import { BoardInfo } from "./BoardInfo.js";
import { ControlBtn } from "./ControlBtn.js";
import { Main } from "./Main.js";

/* Логика процесса сохранения:
 - при каждом действии на поле(добавление предметов, изменение типа клеток или изменение размеров поля) в массив arrBackward добавляется клон игрового поля до его изменения, активируется кнопка Отмены;
 - при нажатии на кнопку "Отменить" из массива arrBackward удаляется последняя запись, по ней восстанавливается поле, а так же эта запись добавляется в конец массива arrForward, активируется кнопка Возврата;
 - при нажатии на кнопку "Вернуть" происходит похожий процесс: из массива arrForward удаляется последняя запись, по которой восстанавливается игровое поле, а запись добавляется в конец массива arrBackward;
 - Если после нажатия кнопки отмена, было совершено какое-то действие на поле, то все записи из массива arrForward удаляются;
*/

//!!! При первом нажатии кнопки "Вернуть" сначала ничего не происходит, 
//!!! вернее восстанавливается клон текущего поля, потом предыдущее состояние.


/** Механизм Отмены и Возврата действия */
export class BackForwardAction {

    /** Поле редактора, в котором находится элемент "#board" 
     * @type {HTMLDivElement}
    */
    static #redactor

    /** Массив для сохранения состояний поля для кнопки Отмены действия
     * @type {HTMLDivElement[]}
     */
    static #arrBackward = [];

    /** Массив для сохранения состояний поля для кнопки Возврата действия
     * @type {HTMLDivElement[]}
     */
    static #arrForward = [];

    /** Указывает было ли сохранение в массив arrBackward
     * @type {boolean}
     */
    static #backwardSaveChecker = false;

    /** кнопка "Отменить"
     * @type {HTMLButtonElement}
     */
    static #btnBackward;

    /** кнопка "Вернуть" 
     * @type {HTMLButtonElement}
    */
    static #btnForward;

    /** Подготовка данных
     * @returns {typeof BackForwardAction}
     */
    static init() {
        this.#redactor = document.querySelector('.redactor');
        this.#btnBackward = document.getElementById('btnBackward');
        this.#btnForward = document.getElementById('btnForward');
        return this;
    }

    /** Слушатель для кнопок "Отменить" и "Вернуть" */
    static listener() {
        this.#backwardListener();
        this.#forwardListener();
    }

    /** Сохранение в массив Отмены действия */
    static addToArrBackward() {
        if (this.#arrBackward.length > 20) this.#arrBackward.shift();

        const boardClone = document.getElementById('board').cloneNode(true);

        this.#arrBackward.push(boardClone);

        this.#arrForward.length = 0;
        this.#btnForward.disabled = true;

        this.#btnBackward.disabled = false;
        this.#backwardSaveChecker = true;
    }

    /** Слушатель для кнопки "Отменить" */
    static #backwardListener() {
        this.#btnBackward.addEventListener('click', () => {
            if (this.#arrBackward.length > 0) {

                let data = this.#arrBackward.pop();
                if (this.#arrBackward.length === 0) this.#btnBackward.disabled = true;

                //!! вероятно, тут ошибка
                if (this.#backwardSaveChecker) {
                    this.addToArrBackward()
                    this.#arrForward.push(this.#arrBackward.pop())
                    this.#backwardSaveChecker = false;
                }
                //!! дублирующее действие добавления в массив, но без этого вообще не работает
                this.#arrForward.push(data);
                this.#btnForward.disabled = false;

                this.#boardRestore(data);
            }
        })
    }

    /** Слушатель для кнопки "Вернуть" */
    static #forwardListener() {
        this.#btnForward.addEventListener('click', () => {
            if (this.#arrForward.length > 0) {

                let data = this.#arrForward.pop();
                if (this.#arrForward.length === 0) this.#btnForward.disabled = true;

                this.#arrBackward.push(data);
                this.#btnBackward.disabled = false;

                this.#boardRestore(data);
            }
        })
    }

    /** Восстановление Поля с клетками 
     * @param {HTMLDivElement} data 
     */
    static #boardRestore(data) {
        document.getElementById('board').remove();

        data.querySelectorAll('.cell').forEach(Main.cellEvent);

        data.querySelectorAll('.control-button').
            forEach(ControlBtn.addEvent);

        this.#redactor.append(data);

        BoardInfo.update(true);
    }
}