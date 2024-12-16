import { Main } from "./Main.js";

/** Боковое меню конструктора */
export class SideMenu {

    /** Генерирует кнопки в разделе Клетка бокового меню
     * @param {SetDescription} graphics_set
     * @returns {typeof SideMenu}
     */
    static render(graphics_set) {
        for (const key in graphics_set.items) {
            /** группа меню
             * @type {MenuSection}
             */
            let group = graphics_set.items[key];

            /** раздел меню */
            let subsection = this.#subsectionRender(group.menu_title);
            /** группа кнопок */
            let buttonsGroupe = this.#buttonsGroupeRender();

            // набор кнопок
            group.set.forEach(item => {
                buttonsGroupe.append(this.#btnRender(item, key));
            })
            subsection.append(buttonsGroupe);

            document.querySelector('.menu-cell').append(subsection);
        }
        return this
    }
    /** Набор слушателей для бокового меню */
    static listener() {
        /** Все кнопки бокового меню
     * @type {NodeListOf<HTMLButtonElement|HTMLDivElement>}
     */
        const btnSide = document.querySelector('.side-menu').querySelectorAll('.btn');
        // слушатель событий для кнопок меню
        btnSide.forEach(btn => {
            btn.addEventListener('click', (e) => {
                btnSide.forEach(btn => btn.classList.remove('active-action'));
                btn.classList.add('active-action');
                Main.ACTION = btn.dataset;
            });
        });
    }

    /** Сгенерировать раздел меню
     * @param {string} title Название раздела
     * @returns {HTMLDivElement}
     */
    static #subsectionRender(title) {
        // раздел меню
        const subsection = document.createElement('div');
        subsection.classList.add('menu-subsection');

        // название раздела
        const subTitle = document.createElement('span');
        subTitle.classList.add('subsection-title');
        subTitle.innerHTML = title;

        subsection.append(subTitle)
        return subsection;
    }

    /** Сгенерировать группу кнопок
     * @returns {HTMLDivElement}
     */
    static #buttonsGroupeRender() {
        const buttonsGroupe = document.createElement('div');
        buttonsGroupe.classList.add('buttons-groupe');

        return buttonsGroupe;
    }

    /** Сгенерировать кнопку
     * @param {ButtonData} data характеристики кнопки
     * @param {string} type тип кнопки 
     * @returns {HTMLDivElement}
     */
    static #btnRender(data, type) {
        const btn = document.createElement('div');
        btn.classList.add('btn', 'button-in-groupe', data.class);
        btn.dataset.type = type;
        btn.dataset.item = data.class;
        btn.dataset.menu = "cell";
        btn.title = data.title;
        return btn
    }
}