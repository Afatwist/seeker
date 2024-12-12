/** Главная модель. Шаблон для других моделей. Служит для создания Моделей Клеток и предметов на поле
 * 
 */
export class MainModel {

    /** HTML-элемент объекта на поле
     * @type {HTMLDivElement}
     */
    element

    /** Уникальный идентификатор объекта, его номер в соответствующем списке объектов
     * @type {number | string}
     */
    id


    /**  
     * @param {HTMLDivElement} element 
     * @param {number | string} id 
     */
    constructor(element, id) {
        this.element = element;
        this.id = id;
    }

    //################ Стили, классы и внешний вид элемента на поле #####

    /** Проверяет есть ли указанные классы CSS
     * 
     * @param {string} type
     * * 'all' - должны присутствовать все классы
     * * 'some' - должен присутствовать хотя бы один
     * @param {string | string[]} classes - нужные классы
     * 
     * @returns {boolean}
     */
    classContains(type, ...classes) {
        if (type === "all") {
            return classes.every(el => this.element.classList.contains(el));
        } else if (type === "some") {
            return classes.some(el => this.element.classList.contains(el));
        } else {
            throw new Error("Первый аргумент должен быть 'all' или 'some'");
        }
    }

    /** Добавить класс CSS 
     * 
     * @param {string | string[]} classes 
     */
    classAdd(...classes) {
        this.element.classList.add(...classes);
    }

    /** Удалить класс CSS
     * 
     * @param {string | string[]} classes 
     */
    classRemove(...classes) {
        this.element.classList.remove(...classes);
    }

    /** Заменить классы CSS
     * 
     * @param {string[]} removing - удаляемые классы
     * @param {string[]} adding - добавляемые классы
     */
    classReplace(removing, adding) {
        this.classRemove(...removing);
        this.classAdd(...adding);
    }

    /** Добавить временные классы, которые отключатся через указанное время
     * 
     * @param  {string[]} classes - временные классы у элемента
     * @param {number} time - время в миллисекундах (по умолчанию 700), через которое 
     * добавляемые классы будут отключены
     */
    classAddTemp(classes, time = 700) {
        this.classAdd(...classes);
        setTimeout(() => {
            this.classRemove(...classes);
        }, time);
    }
}