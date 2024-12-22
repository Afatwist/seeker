//###### Описание типов для набора графики ######//
/** Данные кнопки
 */
interface ButtonData {
    class: string;
    file: string;
    title: string;
    level: number;
    type: string;
}

/** Раздел меню
 */
interface MenuSection {
    menu_title: string;
    set: ButtonData[];
}

/** Полное меню
 */
interface Menu {
    [key: string]: any;
    pointer: MenuSection;
    loot: MenuSection;
    hurdle: MenuSection;
    type: MenuSection;
    enemy: MenuSection;
}

/** Набор Графики
 */
interface SetDescription {
    [key: string]: any;
    title: string;
    description: string;
    version: number;
    game_type: string[];
    items: Menu;
}

//###### Описание Объекта ACTION ######//
/** Объект ACTION
 */
interface ActionBtn {
    menu: string;
    type: string;
    item: string;
    position: string;
}