import { Main } from "./Main.js";

/** Верхнее меню конструктора */
export class TopMenu {
    /** игровое поле
     * @type {HTMLDivElement | null}
     */
    static BOARD = document.querySelector('.board');

    /** Набор слушателей для кнопок меню */
    static listener() {
        this.#btnDataEdit();
        this.#btnSave();
        this.#btnMakeScreenshot();
        this.#btnPlay();

        this.#btnBackConstructor();
        this.#btnHowItWork();
    }

    /** кнопка "Изменить описание" */
    static #btnDataEdit() {
        document.getElementById('btnDataEdit').addEventListener('click', () => {

            if (this.#startChecker()) {
                this.#borderMaker();
                this.#cellsToData();

                localStorage.setItem("gameData", JSON.stringify(Main.LEVEL));
                window.open('edit.html', '_self');
            }
        });
    }

    /** кнопка "Сохранить уровень" */
    static #btnSave() {
        document.getElementById('btnSave').addEventListener('click', () => {

            if (this.#startChecker()) {
                this.#borderMaker();
                this.#cellsToData();
                Main.LEVEL.fileSave();
            }
        });
    }

    /** кнопка "Сделать скриншот" */
    static #btnMakeScreenshot() {
        document.getElementById('btnScreenshot').addEventListener('click', () => {
            this.#borderMaker();

            html2canvas(this.BOARD, {
                x: 40,
                y: 40,
                width: this.BOARD.clientWidth - 40,
                height: this.BOARD.clientHeight - 40
            }).
                then(canvas => {
                    const aTemp = document.createElement('a');
                    aTemp.href = canvas.toDataURL('image/png');
                    aTemp.download = `${Main.LEVEL.id}_cover.png`;
                    aTemp.click();
                    aTemp.remove();
                });
        });
    }

    /** кнопка "Играть!" */
    static #btnPlay() {
        document.getElementById('btnPlay').addEventListener('click', () => {

            if (this.#startChecker()) {
                this.#borderMaker();
                this.#cellsToData();

                localStorage.setItem('gameData', JSON.stringify(Main.LEVEL));
                localStorage.setItem('fromConstructor', 'true')
                window.open('../../pages/game.html', '_self');

            }
        });
    }

    /** кнопка "В главное меню конструктора" */
    static #btnBackConstructor() {
        document.getElementById('btnBackConstructor').addEventListener('click', () => {
            window.open('constructor.html', '_self');
        });
    }

    /** кнопка "Как это работает" и модальное окно */
    static #btnHowItWork() {
        const modalHowItWork = document.querySelector('.modalHowItWork');

        document.getElementById('btnHowItWork').addEventListener('click', () => {
            modalHowItWork.style.display = "block";
        })

        modalHowItWork.addEventListener('click', (e) => {
            if (['modal-close', 'modalHowItWork'].includes(e.target.className)) {
                modalHowItWork.removeAttribute('style');
            }
        })
    }

    //########## Специальные методы ########//

    /** Рисует границу по периметру Поля. 
     * А так же на клетках, которые соприкасаются с пустыми клетками
     * (у них стиль "none")
     */
    static #borderMaker() {
        this.BOARD.querySelectorAll('.cell:not(.none)').forEach(cell => {
            cell.classList.remove('border-left', 'border-right', 'border-top', 'border-bottom');

            let row = Number(cell.dataset.row);
            let col = Number(cell.dataset.col);

            let left = this.BOARD.querySelector(`.cell.none[data-row="${row}"][data-col="${col - 1}"]`);
            let right = this.BOARD.querySelector(`.cell.none[data-row="${row}"][data-col="${col + 1}"]`);

            let top = this.BOARD.querySelector(`.cell.none[data-row="${row - 1}"][data-col="${col}"]`);
            let bottom = this.BOARD.querySelector(`.cell.none[data-row="${row + 1}"][data-col="${col}"]`);


            if (left || col === 1) cell.classList.add('border-left');
            if (right || col === Main.LEVEL.board.size.cols) cell.classList.add('border-right');

            if (top || row === 1) cell.classList.add('border-top');
            if (bottom || row === Main.LEVEL.board.size.rows) cell.classList.add('border-bottom');
        });
    }

    /** ищет клетку старт на поле
     * 
     * @returns {boolean}
     */
    static #startChecker() {
        if (this.BOARD.querySelector('.cell.start')) return true;
        alert('Необходимо добавить клетку Старт!');
        return false;
    }

    /** сохранить все клетки в DATA */
    static #cellsToData() {
        Main.LEVEL.board.data = [];
        document.querySelectorAll('.cell').
            forEach(cell => Main.LEVEL.setBoardData(cell));
    }
}