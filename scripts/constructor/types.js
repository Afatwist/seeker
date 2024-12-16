//###### Описание типов для набора графики ######//
/** Данные кнопки
 * @typedef {Object} ButtonData
 * @property {string} class стили кнопки
 * @property {string} file файл с изображением кнопки
 * @property {string} title название кнопки
 * @property {number=} level уровень предмета в кнопке
 * @property {string=} type тип клетки
 */

/** Раздел меню
 * @typedef {Object} MenuSection
 * @property {string} menu_title название раздела меню
 * @property {ButtonData[]} set набор кнопок в разделе
 */

/** Полное меню
 * @typedef {Object} Menu Меню конструктора
 * @property {MenuSection} pointer кнопки "Старт" и "Финиш"
 * @property {MenuSection} loot кнопки с добычей
 * @property {MenuSection} hurdle кнопки с препятствиями
 * @property {MenuSection} type кнопки с типом клеток
 * @property {MenuSection} enemy кнопки с врагами
 */

/** Набор Графики
 * @typedef {Object} SetDescription
 * @property {string} title Название набора графики
 * @property {string} description Описание набора графики
 * @property {float} version Версия
 * @property {string[]} game_type Список поддерживаемых типов игр {['boulder_dash']}
 * @property {Menu} items Список пунктов меню конструктора
 */

//###### Описание Объекта ACTION ######//
/** Объект ACTION
 * @typedef {Object} ActionBtn
 * @property {string} menu - раздел меню, в котором нажата кнопка (клетка, ряд, колонка)
 * @property {string} type - подраздел, к которому относится кнопка
 * @property {string=} item - содержимое кнопки (предмет, или класс клетки)
 * @property {string=} position - при добавлении ряда или колонки указывает место добавления
 * 
 */