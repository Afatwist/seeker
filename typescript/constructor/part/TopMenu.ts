// import html2canvas from "../../../node_modules/html2canvas/dist/types/index.js";

//import html2canvas from "../../vendors/html2canvas/dist/html2canvas.esm.js";
import html2canvas from "../../vendors/html2canvas/html2canvas.js";
import { Main } from "./Main.js";

/** Верхнее меню конструктора */
export class TopMenu {

    /** Игровое поле */
    static BOARD: HTMLDivElement | null = document.querySelector('.board');

    /** Набор слушателей для кнопок меню */
    static listener(): void {
        this.#btnDataEdit();
        this.#btnSave();
        this.#btnMakeScreenshot();
        this.#btnPlay();

        this.#btnBackConstructor();
        this.#btnHowItWork();
    }

    /** кнопка "Изменить описание" */
    static #btnDataEdit(): void {
        document.getElementById('btnDataEdit')!.addEventListener('click', () => {

            if (this.#startChecker()) {
                this.#borderMaker();
                this.#cellsToData();

                localStorage.setItem("gameData", JSON.stringify(Main.LEVEL));
                window.open('edit.html', '_self');
            }
        });
    }

    /** кнопка "Сохранить уровень" */
    static #btnSave(): void {
        document.getElementById('btnSave')!.addEventListener('click', () => {

            if (this.#startChecker()) {
                this.#borderMaker();
                this.#cellsToData();
                Main.LEVEL.fileSave();
            }
        });
    }

    /** кнопка "Сделать скриншот" */
    static #btnMakeScreenshot(): void {
        document.getElementById('btnScreenshot')!.addEventListener('click', () => {
            this.#borderMaker();

            html2canvas(this.BOARD as HTMLDivElement, {
                x: 40,
                y: 40,
                width: this.BOARD!.clientWidth - 40,
                height: this.BOARD!.clientHeight - 40
            }).
                then((canvas: any) => {
                    const aTemp = document.createElement('a');
                    aTemp.href = canvas.toDataURL('image/png');
                    aTemp.download = `${Main.LEVEL.id}_cover.png`;
                    aTemp.click();
                    aTemp.remove();
                });
        });
    }

    /** кнопка "Играть!" */
    static #btnPlay(): void {
        document.getElementById('btnPlay')!.addEventListener('click', () => {

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
    static #btnBackConstructor(): void {
        document.getElementById('btnBackConstructor')!.addEventListener('click', () => {
            window.open('constructor.html', '_self');
        });
    }

    /** кнопка "Как это работает" и модальное окно */
    static #btnHowItWork(): void {
        const modalHowItWork: HTMLDivElement = document.querySelector('.modalHowItWork')!;

        document.getElementById('btnHowItWork')!.addEventListener('click', () => {
            modalHowItWork.style.display = "block";
        })

        modalHowItWork.addEventListener('click', (e) => {
            let element: HTMLElement = e.target! as HTMLElement
            if (['modal-close', 'modalHowItWork'].includes(element.className as string)) {
                modalHowItWork.removeAttribute('style');
            }
        })
    }

    //########## Специальные методы ########//

    /** Рисует границу по периметру Поля. 
     * А так же на клетках, которые соприкасаются с пустыми клетками
     * (у них стиль "none")
     */
    static #borderMaker(): void {
        this.BOARD!.querySelectorAll<HTMLDivElement>('.cell:not(.none)').forEach(cell => {
            cell.classList.remove('border-left', 'border-right', 'border-top', 'border-bottom');

            let row = Number(cell.dataset.row);
            let col = Number(cell.dataset.col);

            let left = this.BOARD!.querySelector(`.cell.none[data-row="${row}"][data-col="${col - 1}"]`);
            let right = this.BOARD!.querySelector(`.cell.none[data-row="${row}"][data-col="${col + 1}"]`);

            let top = this.BOARD!.querySelector(`.cell.none[data-row="${row - 1}"][data-col="${col}"]`);
            let bottom = this.BOARD!.querySelector(`.cell.none[data-row="${row + 1}"][data-col="${col}"]`);


            if (left || col === 1) cell.classList.add('border-left');
            if (right || col === Main.LEVEL.board.size.cols) cell.classList.add('border-right');

            if (top || row === 1) cell.classList.add('border-top');
            if (bottom || row === Main.LEVEL.board.size.rows) cell.classList.add('border-bottom');
        });
    }

    /** ищет клетку старт на поле */
    static #startChecker(): boolean {
        if (this.BOARD!.querySelector('.cell.start')) return true;
        alert('Необходимо добавить клетку Старт!');
        return false;
    }

    /** сохранить все клетки в DATA */
    static #cellsToData(): void {
        Main.LEVEL.board.data = [];
        document.querySelectorAll<HTMLDivElement>('.cell').
            forEach(cell => Main.LEVEL.setBoardData(cell));
    }
}