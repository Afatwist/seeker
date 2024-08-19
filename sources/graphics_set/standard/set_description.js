/**
 * описание набора графики
 */
export const set_desc = {
    title: 'Стандартный',
    description: 'Стандартный набор графики',
    version: 1.0,
    game_type: ['boulder_dash'],

    items: {
        pointer: {
            menu_title: 'Старт и Финиш',
            set: [
                {
                    class: 'start',
                    file: 'start',
                    title: 'Стартовая клетка',
                },
                {
                    class: 'finish-close',
                    file: 'finish-close',
                    title: 'Финиш закрыт',
                },
                {
                    class: 'finish-open',
                    file: 'finish-open',
                    title: 'Финиш открыт',
                }
            ]
        },

        loot: {
            menu_title: 'Добыча', // название для раздела меню
            set: [
                {
                    level: 1, // уровень
                    class: 'loot-1', // название класса
                    file: 'jewel_yellow', // название файла
                    title: 'Оранжевый алмаз', // название для кнопки в конструкторе

                    dataset: {
                        scores: 100, // очки за сбор добычи
                        fall: 0,
                    }
                },

                {
                    level: 2,
                    class: 'loot-2',
                    file: 'jewel_blue',
                    title: 'Сапфир',

                    dataset: {
                        scores: 200, // очки за сбор добычи
                        fall: 0,
                    }
                }
            ]
        },

        hurdle: {
            menu_title: 'Препятствия',
            set: [
                {
                    level: 1,
                    class: 'hurdle-1',
                    file: 'stone',
                    title: 'Серый камень',

                    dataset: {
                        wight: 1, // вес препятствия влияет на скорость падения и перемещения его игроком
                        fall: 0,
                    }
                },
            ]
        },

        type: {
            menu_title: 'Тип клетки',
            set: [
                {
                    class: 'free',
                    file: 'free',
                    type: 'free',
                    title: 'Свободная клетка',

                    dataset: {
                        speed: 1, // скорость перемещения по клетке
                    }

                },

                {
                    class: 'ground',
                    file: 'ground',
                    type: 'ground',
                    title: 'Земля',

                    dataset: {
                        speed: 0.7, // скорость перемещения по клетке
                    }
                },

                {
                    class: 'wall',
                    file: 'wall',
                    type: 'wall',
                    title: 'Стена',

                    dataset: {
                        speed: 0, // скорость перемещения по клетке
                    }
                }
            ]
        },

        enemy: {
            menu_title: 'Противник',
            set: [
                {
                    level: 1, // уровень
                    class: 'enemy-walk', // название класса
                    file: 'enemy-1', // название файла
                    title: 'Обычный противник', // название для кнопки в конструкторе


                    dataset: {
                        speed: 1, // скорость передвижения по клеткам
                        angry_distance: 1, // дистанция реагирования на игрока
                        walk: 0
                    }
                }
            ]
        }
    }



}

/* 
пример для items
каждый тип предметов в массив объектов:

items_new: {
    loot: {
    menu_title: 'Добыча',
    set: [
        {
        level: 1, // уровень
        class: 'loot-1'
        file: 'jewel_yellow', // путь к файлу
        title: 'Оранжевый алмаз', // название
        scores: 100, // количество очков
    },
            {
        level: 2, 
        class: 'loot_2'
        file: 'jewel_blue', 
        title: 'Сапфир', 
        scores: 200, 
    }
    ]
}
}

*/