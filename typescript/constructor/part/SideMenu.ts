import { Main } from "./Main.js";

/** Боковое меню конструктора */
export class SideMenu {

    /** Генерирует кнопки в разделе Клетка бокового меню
     * @param graphics_set
     */
    static render(graphics_set: SetDescription): typeof SideMenu {
        const menuCell: HTMLDivElement = document.querySelector('.menu-cell')!;
        for (const key in graphics_set.items) {
            /** группа меню */
            let group: MenuSection = graphics_set.items[key];

            /** раздел меню */
            let subsection = this.#subsectionRender(group.menu_title);
            /** группа кнопок */
            let buttonsGroupe = this.#buttonsGroupeRender();

            // набор кнопок
            group.set.forEach(item => {
                buttonsGroupe.append(this.#btnRender(item, key));
            })
            subsection.append(buttonsGroupe);

            menuCell.append(subsection);
        }
        return this
    }

    /** Набор слушателей для бокового меню */
    static listener(): void {
        /** Все кнопки бокового меню */
        const btnSide: NodeListOf<HTMLButtonElement | HTMLDivElement> = document.querySelector('.side-menu')!.querySelectorAll('.btn');
        // слушатель событий для кнопок меню
        btnSide.forEach(btn => {
            btn.addEventListener('click', () => {
                btnSide.forEach(btn => btn.classList.remove('active-action'));
                btn.classList.add('active-action');
                Main.ACTION = btn.dataset as unknown as ActionBtn; // !!!!! исправить
            });
        });
    }

    /** Сгенерировать раздел меню
     * @param title Название раздела
     */
    static #subsectionRender(title: string): HTMLDivElement {
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

    /** Сгенерировать группу кнопок */
    static #buttonsGroupeRender(): HTMLDivElement {
        const buttonsGroupe = document.createElement('div');
        buttonsGroupe.classList.add('buttons-groupe');

        return buttonsGroupe;
    }

    /** Сгенерировать кнопку
     * @param data характеристики кнопки
     * @param type тип кнопки 
     */
    static #btnRender(data: ButtonData, type: string): HTMLDivElement {
        const btn = document.createElement('div');
        btn.classList.add('btn', 'button-in-groupe', data.class);
        btn.dataset.type = type;
        btn.dataset.item = data.class;
        btn.dataset.menu = "cell";
        btn.title = data.title;
        return btn
    }
}