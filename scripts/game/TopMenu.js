import { Game } from "./Game.js";
import { baseUrl } from "../Classes/Helpers.js";
import html2canvas from "../vendors/html2canvas/html2canvas.js";
export class TopMenu {
    static #fromConstructor;
    static init(levelCount, levelId) {
        this.#fromConstructor = localStorage.getItem('fromConstructor') === 'true';
        this.#toConstructor();
        this.#replay();
        this.#toLevelList();
        this.#mainPage();
        this.#nextLevel(levelCount, levelId);
        this.#map();
    }
    static #toConstructor() {
        document.querySelectorAll('.to-constructor').forEach(btn => {
            if (this.#fromConstructor) {
                btn.style.display = 'block';
                btn.addEventListener('click', () => {
                    btn.removeAttribute('style');
                    window.history.back();
                });
            }
            else
                btn.removeAttribute('style');
        });
    }
    static #replay() {
        document.querySelectorAll('.replay').forEach(btn => {
            btn.addEventListener('click', () => {
                location.reload();
            });
        });
    }
    static #toLevelList() {
        document.querySelectorAll('.level-list').forEach(btn => {
            if (!this.#fromConstructor) {
                btn.removeAttribute('style');
                btn.addEventListener('click', () => {
                    window.open('../pages/file-choose.html', '_self');
                });
            }
            else
                btn.style.display = 'none';
        });
    }
    static #mainPage() {
        document.querySelectorAll('.to-main-page').forEach(btn => {
            if (!this.#fromConstructor) {
                btn.removeAttribute('style');
                btn.addEventListener('click', () => {
                    window.open(baseUrl, '_self');
                });
            }
            else
                btn.style.display = 'none';
        });
    }
    static async #nextLevel(levelCount, levelId) {
        const btnNextLevel = document.querySelector('.next-level');
        if (levelCount > levelId && !this.#fromConstructor) {
            btnNextLevel.style.display = 'block';
            let { levelData } = await import(`../../sources/levels/data/${levelId + 1}.js`);
            btnNextLevel.addEventListener('click', () => {
                localStorage.setItem("gameData", JSON.stringify(levelData));
                location.reload();
            });
        }
        else
            btnNextLevel.style.display = 'none';
    }
    static #map() {
        const levelMap = document.getElementById('modal-level_map');
        const cover = document.querySelector('.modal-img_map');
        const board = document.querySelector('.board');
        const loader = document.querySelector('.modal-loader_map');
        const BtnShowMap = document.querySelector('.show-level-map');
        BtnShowMap.addEventListener('click', show);
        document.addEventListener('keydown', show);
        function show(e) {
            if (e.code === 'KeyM' ||
                e.target.classList.contains('show-level-map')) {
                html2canvas(board).
                    then((canvas) => {
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
        function close(e) {
            if (e.code === 'Escape' ||
                e.target.classList.contains('modal-close_map')) {
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
//# sourceMappingURL=TopMenu.js.map