import { Game } from "./Game.js";
import { baseUrl } from "../Classes/Helpers.js";
import html2canvas from "../vendors/html2canvas/html2canvas.js";
/** Кнопки верхнего меню и модальные окна */
export class TopMenu {
    /* Большинство кнопок расположены в верхнем меню и дублируются в модальном окне
        поэтому используется метод querySelectorAll и forEach */

    /** Показывает, что переход был из конструктора
     * * true - игра запущена из конструктора
     * * false - игра запущена из списка уровней
     */
    static #fromConstructor: boolean;

    /** Инициализация верхнего меню 
     * @param levelCount общее количество уровней
     * @param levelId ID текущего уроня
     */
    static init(levelCount: number, levelId: number): void {
        this.#fromConstructor = localStorage.getItem('fromConstructor') === 'true';

        this.#toConstructor();
        this.#replay();
        this.#toLevelList();
        this.#mainPage();
        this.#nextLevel(levelCount, levelId);
        this.#map();

    }


    /** Кнопка "В конструктор"
     * 
     * Если переход был из конструктора, в верхнем меню и модальном окне
     * появляется кнопка перехода в конструктор */
    static #toConstructor(): void {
        document.querySelectorAll<HTMLButtonElement>('.to-constructor').forEach(btn => {
            if (this.#fromConstructor) {
                btn.style.display = 'block';
                btn.addEventListener('click', () => {
                    btn.removeAttribute('style');
                    window.history.back();
                });
            } else btn.removeAttribute('style');
        });
    }

    /** Кнопка "Начать заново" */
    static #replay(): void {
        document.querySelectorAll<HTMLButtonElement>('.replay').forEach(btn => {
            btn.addEventListener('click', () => {
                location.reload();
            });
        });
    }

    /** Кнопка "К выбору уровней" 
     * 
     * Если переход был из конструктора, то кнопка не видна
    */
    static #toLevelList(): void {
        document.querySelectorAll<HTMLButtonElement>('.level-list').forEach(btn => {
            if (!this.#fromConstructor) {
                btn.removeAttribute('style');
                btn.addEventListener('click', () => {
                    window.open('../pages/file-choose.html', '_self');
                });
            } else btn.style.display = 'none';
        });
    }

    /** Кнопка "На главную страницу"
     * 
     * Невидна, если переход был из конструктора 
     */
    static #mainPage(): void {
        document.querySelectorAll<HTMLButtonElement>('.to-main-page').forEach(btn => {
            if (!this.#fromConstructor) {
                btn.removeAttribute('style');
                btn.addEventListener('click', () => {
                    window.open(baseUrl, '_self');
                })
            } else btn.style.display = 'none';
        })
    }

    /** Кнопка "Следующий уровень" 
     * 
     * Если это не последний существующий уровень,
     * то в модальном окне появится кнопка перехода на следующий
     * @param levelCount общее количество уровней
     * @param levelId ID текущего уроня
    */
    static async #nextLevel(levelCount: number, levelId: number): Promise<void> {
        const btnNextLevel = document.querySelector<HTMLButtonElement>('.next-level')!;
        if (levelCount > levelId && !this.#fromConstructor) {
            btnNextLevel.style.display = 'block';
            let { levelData } = await import(`../../sources/levels/data/${levelId + 1}.js`);
            btnNextLevel.addEventListener('click', () => {
                localStorage.setItem("gameData", JSON.stringify(levelData));
                location.reload();
            });
        } else btnNextLevel.style.display = 'none';
    }

    /** Кнопка "Показать карту уровня" */
    static #map(): void {
        const levelMap = document.getElementById('modal-level_map')!;
        const cover = document.querySelector<HTMLImageElement>('.modal-img_map')!;
        const board = document.querySelector<HTMLDivElement>('.board')!;
        const loader = document.querySelector<HTMLSpanElement>('.modal-loader_map')!;
        const BtnShowMap = document.querySelector<HTMLButtonElement>('.show-level-map')!;

        BtnShowMap.addEventListener('click', show);
        document.addEventListener('keydown', show);

        /** Показать карту по нажатию на кнопку "Карта уровня" или на клавишу M */
        function show(e: MouseEvent | KeyboardEvent) {
            if ((e as KeyboardEvent).code === 'KeyM' ||
                (e.target! as HTMLButtonElement).classList.contains('show-level-map')) {

                html2canvas(board).
                    then((canvas: any) => {
                        cover.src = `${canvas.toDataURL('image/png')}`;
                        cover.style.display = 'block';
                        loader.style.display = 'none';

                    });

                Game.pause = true;
                levelMap.classList.add('modal-show');

                levelMap.addEventListener('click', close);
                document.addEventListener('keydown', close);
            }
        }

        /** Закрыть карту по нажатию на кнопку "Закрыть" или на клавишу Esc */
        function close(e: MouseEvent | KeyboardEvent) {
            if ((e as KeyboardEvent).code === 'Escape' ||
                (e.target! as HTMLButtonElement).classList.contains('modal-close_map')) {
                Game.pause = false;
                levelMap.classList.remove('modal-show');

                levelMap.removeEventListener('click', close);
                document.removeEventListener('keydown', close);

                cover.src = '';
                cover.style.display = 'none';
                loader.style.display = 'inline-block';
            }
        }
    }
}