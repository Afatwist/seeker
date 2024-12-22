import { Main } from "./Main.js";
export class SideMenu {
    static render(graphics_set) {
        const menuCell = document.querySelector('.menu-cell');
        for (const key in graphics_set.items) {
            let group = graphics_set.items[key];
            let subsection = this.#subsectionRender(group.menu_title);
            let buttonsGroupe = this.#buttonsGroupeRender();
            group.set.forEach(item => {
                buttonsGroupe.append(this.#btnRender(item, key));
            });
            subsection.append(buttonsGroupe);
            menuCell.append(subsection);
        }
        return this;
    }
    static listener() {
        const btnSide = document.querySelector('.side-menu').querySelectorAll('.btn');
        btnSide.forEach(btn => {
            btn.addEventListener('click', () => {
                btnSide.forEach(btn => btn.classList.remove('active-action'));
                btn.classList.add('active-action');
                Main.ACTION = btn.dataset;
            });
        });
    }
    static #subsectionRender(title) {
        const subsection = document.createElement('div');
        subsection.classList.add('menu-subsection');
        const subTitle = document.createElement('span');
        subTitle.classList.add('subsection-title');
        subTitle.innerHTML = title;
        subsection.append(subTitle);
        return subsection;
    }
    static #buttonsGroupeRender() {
        const buttonsGroupe = document.createElement('div');
        buttonsGroupe.classList.add('buttons-groupe');
        return buttonsGroupe;
    }
    static #btnRender(data, type) {
        const btn = document.createElement('div');
        btn.classList.add('btn', 'button-in-groupe', data.class);
        btn.dataset.type = type;
        btn.dataset.item = data.class;
        btn.dataset.menu = "cell";
        btn.title = data.title;
        return btn;
    }
}
//# sourceMappingURL=SideMenu.js.map