/** Главная модель. Шаблон для других моделей.
 * 
 * Служит для создания Моделей Клеток и Предметов на поле.
 */
export class MainModel {

    /** HTML-элемент объекта на поле */
    element: HTMLDivElement

    /** Уникальный идентификатор объекта, его номер в соответствующем списке объектов */
    id: ID


    /** Создать модель */
    constructor(element: HTMLDivElement, id: ID) {
        this.element = element;
        this.id = id;
    }

    //################ Стили, классы и внешний вид элемента на поле #####

    /** Проверяет есть ли указанные классы CSS
     * 
     * @param type
     * * 'all' - должны присутствовать все классы
     * * 'some' - должен присутствовать хотя бы один
     * @param classes - нужные классы
     * 
     * @returns {boolean}
     */
    classContains(type: "all" | "some", ...classes: string[]): boolean {
        if (type === "all") {
            return classes.every(el => this.element.classList.contains(el));
        } else {
            return classes.some(el => this.element.classList.contains(el));
        }
    }

    /** Добавить класс CSS 
     * 
     * @param classes 
     */
    classAdd(...classes: string[]): void {
        this.element.classList.add(...classes);
    }

    /** Удалить класс CSS
     * 
     * @param {string | string[]} classes 
     */
    classRemove(...classes: string[]): void {
        this.element.classList.remove(...classes);
    }

    /** Заменить классы CSS
     * @param removing - удаляемые классы
     * @param adding - добавляемые классы
     */
    classReplace(removing: string[], adding: string[]): void {
        this.classRemove(...removing);
        this.classAdd(...adding);
    }

    /** Добавить временные классы, которые отключатся через указанное время
     * 
     * @param classes - временные классы у элемента
     * @param time - время в миллисекундах (по умолчанию 700), через которое 
     * добавляемые классы будут отключены
     */
    classAddTemp(classes: string[], time = 700): void {
        this.classAdd(...classes);
        setTimeout(() => {
            this.classRemove(...classes);
        }, time);
    }
}