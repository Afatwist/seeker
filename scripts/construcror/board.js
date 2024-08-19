/* Обработчик для файла constructor-board.html;
* Создание бокового меню для выбранного набора графики;
* Редактирование выбранного/созданного игрового поля;
* Проверка правильности созданного поля;
* Сохранение игрового поля;

Надо доделать:
    * кнопки в блоке info: "отменить" и "вернуть" работают криво;
 */

import { LevelRender } from "../Classes/LevelRender.js";
import { Level } from "../Classes/Level.js";
// Получение данных игры из localStorage 
const gameData = JSON.parse(localStorage.getItem('gameData'));

/** Данные текущего уровня */
const LEVEL = new Level(gameData);

// Генерирование игрового поля
LevelRender.setData(LEVEL).make();

// импорт данных о наборе графики. Нужно для создания меню и объектов на поле
const { set_desc } = await import(
    `../../sources/graphics_set/${gameData.graphics_set}/set_description.js`);
sideMenuRender(set_desc);



/** Текущая нажатая кнопка на боковой панели */
let ACTION = '';

const sideMenu = document.querySelector('.side-menu');
/* Слушатель событий для кнопок на боковом меню */
sideMenu.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-single') || e.target.classList.contains('button-in-groupe')) {
        sideMenu.querySelector('.active-action')?.classList.remove('active-action');
        e.target.classList.add('active-action');
        ACTION = e.target.dataset;
    }
});

/* события для клеток на игровом поле */
document.querySelectorAll('.cell').forEach(cellEvent);

/* Обновление информации при загрузке поля */
makeControlButtons();
boardSizeInfoUpdate();
itemsInfoUpdate();
pointerInfoUpdate();
refreshCellsData();




//##################################################################//
//###### Боковое меню, Кнопки рядов и колонок #######//
/** Генерирует кнопки в боковом меню
* @param {Object} graphics_set 
- данные о наборе графики из файла set_description
*/
function sideMenuRender(graphics_set) {
    for (const key in graphics_set.items) {

        let group = graphics_set.items[key];
        // раздел меню
        let subsection = document.createElement('div');
        subsection.classList.add('menu-subsection');
        // название раздела
        let subTitle = document.createElement('span');
        subTitle.classList.add('subsection-title');
        subTitle.innerHTML = group.menu_title;

        let buttonsGroupe = document.createElement('div');
        buttonsGroupe.classList.add('buttons-groupe');
        // набор кнопок
        group.set.forEach(item => {
            let btn = document.createElement('div');
            btn.classList.add('btn', 'button-in-groupe', item.class);
            btn.dataset.type = key;
            btn.dataset.item = item.class;
            btn.dataset.menu = "cell";
            btn.title = item.title

            buttonsGroupe.append(btn);
        })

        subsection.append(subTitle, buttonsGroupe);

        document.querySelector('.menu-cell').append(subsection);
    }
}

// дополнительные кнопки на поле для операций с рядами и колонками

/** Создание верхних и боковых кнопок для управления всей колонкой или рядом 
 */
function makeControlButtons() {
    let rows = document.querySelectorAll('.row');
    let cells = rows[0].querySelectorAll('.cell');

    // верхний ряд кнопок для управления колонками
    let controlRowTop = document.createElement('div');
    controlRowTop.classList.add('row-control-top');

    for (let col = 1; col <= cells.length; col++) {
        controlRowTop.append(makeControlBtn('col', col));
    }
    document.querySelector('.board').prepend(controlRowTop);

    // левая колонка кнопок для управления рядами
    rows.forEach(row => {
        row.prepend(makeControlBtn('row', row.dataset.row));
    });
}

/** Создание кнопки для управления всей колонкой/рядом 
 * @param {string} direction - направление: 'col' || 'row'
 * @param {string|number} number - номер ряда/колонки
 * @returns {HTMLButtonElement}
 */
function makeControlBtn(direction, number) {
    let button = document.createElement('button');

    if (direction === 'col') {
        button.innerText = `Колонка: ${number}`;
        button.classList.add('control-button', 'control-button-top');
    } else if (direction === 'row') {
        button.innerText = `Ряд: ${number}`;
        button.classList.add('control-button', 'control-button-left');
    } else alert('Ошибка при создании контрольной кнопки')

    button.dataset.direction = direction;
    button.dataset.number = number;

    controlButtonsAddEvent(button);

    return button
}

/** Добавление событий на боковую/верхнюю кнопку 
 * @param {HTMLButtonElement} button 
 */
function controlButtonsAddEvent(button) {
    // общие операции для боковых и верхних клеток
    button.addEventListener('click', () => {
        if (ACTION.menu === 'cell') {
            addToArrBackward();
            document.
                querySelectorAll(`.cell[data-${button.dataset.direction}="${button.dataset.number}"]`).
                forEach(cell => {
                    if (ACTION.type !== 'pointer') actionHandlerCell(cell, ACTION);
                });
        }
    });

    // операции в зависимости от расположения кнопки
    if (button.dataset.direction === 'col') {
        // операции с колонками для верхних клеток
        button.addEventListener('click', () => {
            if (ACTION.menu === 'col') {
                addToArrBackward();
                let cell = document.querySelector(`.cell[data-col="${button.dataset.number}"]`);
                actionHandlerCol(cell, ACTION);
            }
        });
    } else if (button.dataset.direction === 'row') {
        // операции с рядами для боковых клеток
        button.addEventListener('click', () => {
            if (ACTION.menu === 'row') {
                addToArrBackward();
                let cell = document.querySelector(`.cell[data-row="${button.dataset.number}"]`);
                actionHandlerRow(cell, ACTION);
            }
        })
    } else alert('Ошибка при создании контрольной кнопки');
}

/** Обновление верхних и боковых кнопок */
function refreshControlBtn() {
    document.querySelectorAll('.control-button-left').
        forEach((btnLeft, i) => {
            btnLeft.innerText = `Ряд: ${i + 1}`;
            btnLeft.dataset.number = i + 1;
        });

    document.querySelectorAll('.control-button-top').
        forEach((btnTop, i) => {
            btnTop.innerText = `Колонка: ${i + 1}`;
            btnTop.dataset.number = i + 1;
        });
}


//###########################################################
//###### Новый ряд, новая клетка, события для клеток #######//

/** Создает новый ряд
 * @returns {HTMLDivElement}
 */
function createNewRow() {
    // let cellCount = currentRow.querySelectorAll('.cell').length

    let newRow = document.createElement('div')
    newRow.classList.add('row')
    newRow.dataset.row = ' '

    newRow.append(makeControlBtn('row', ''))

    for (let c = 1; c <= LEVEL.board.size.cols; c++) {
        let newCell = createNewCell()
        newRow.append(newCell)
    }
    return newRow;
}

/** Создать новую клетку на поле 
 * @returns {HTMLDivElement}
 */
function createNewCell() {
    let newCell = document.createElement('div');
    newCell.classList.add('cell', 'free');
    newCell.dataset.type = 'free';
    newCell.dataset.row = '';
    newCell.dataset.col = '';
    cellEvent(newCell);
    return newCell;
}

/** Создание нового предмета, для добавления в клетку 
 * @param {object} action - выбранное действие(нажатая кнопка на боковой панели)
 * @returns {HTMLDivElement}
 */
function createNewItem(action) {
    let item = document.createElement('div');
    item.classList.add('item', action.item);
    item.dataset.type = action.type;
    if (['loot', 'hurdle'].includes(action.type)) item.dataset.fall = '0'; // удалить
    return item;
}

/** Добавить событие на клетку
 * 
 * @param {HTMLDivElement} cell - клетка
 */
function cellEvent(cell) {
    cell.addEventListener('click', () => {
        if (ACTION) {
            addToArrBackward();
            if (ACTION.menu === 'cell') actionHandlerCell(cell, ACTION);
            else if (ACTION.menu === 'row') actionHandlerRow(cell, ACTION);
            else if (ACTION.menu === 'col') actionHandlerCol(cell, ACTION);
            else alert('Ошибка обработки кнопок меню');
        }
    });
}

/** Обработка кнопок из меню Клетка
 * @param {HTMLDivElement} cell клетка к которой применяется действие
 * @param {string|object} action тип применяемого действия, зависит от нажатой кнопки
 */
function actionHandlerCell(cell, action) {
    switch (action.type) {
        case 'loot': // Добавление добычи
            let loot = createNewItem(action);
            updateCell(cell, 'free', loot);
            break;

        case 'hurdle': // Добавление препятствия
            let hurdle = createNewItem(action);
            updateCell(cell, 'free', hurdle);
            break;

        case 'enemy': // Добавление врага/противника
            let enemy = createNewItem(action);
            updateCell(cell, 'free', enemy);
            break;

        case 'type': // Смена типа клетки
            updateCell(cell, action.item);
            break;

        case 'cell-clear': // Удаление/очистка клетки
            updateCell(cell, action.item);
            break;

        case 'pointer':
            // Добавление клеток Старт и Финиш
            updateCell(cell, action.item);
            break;

        default:
            break;
    }
    itemsInfoUpdate();
    pointerInfoUpdate();
}

/** Обработка кнопок из меню Ряд
 * @param {HTMLDivElement} cell клетка к которой применяется действие
 * @param {string|object} action тип применяемого действия, зависит от нажатой кнопки
 */
function actionHandlerRow(cell, action) {
    switch (action.type) {
        case 'row-add':
            let currentRow = cell.closest('.row');
            let newRow = createNewRow();
            currentRow.insertAdjacentElement(action.position, newRow);
            break;

        case 'row-remove':
            cell.closest('.row').remove();
            break;

        default:
            break;
    }

    refreshCellsData();
    refreshControlBtn();
    boardSizeInfoUpdate();
    pointerInfoUpdate();
}

/** Обработка кнопок из меню Колонка
 * @param {HTMLDivElement} cell клетка к которой применяется действие
 * @param {string|object} action тип применяемого действия, зависит от нажатой кнопки
 */
function actionHandlerCol(cell, action) {
    switch (action.type) {
        case 'col-add':
            //добавление новой клетки
            document.
                querySelectorAll(`.cell[data-col="${cell.dataset.col}"]`).
                forEach(targetCell =>
                    targetCell.insertAdjacentElement(action.position, createNewCell())
                );
            // добавление верхней кнопки для новой колонки
            document.querySelector(`.control-button-top[data-number="${cell.dataset.col}"]`).
                insertAdjacentElement(action.position, makeControlBtn('col', ''));

            break;

        case 'col-remove':
            // удаление колонки
            document.
                querySelectorAll(`.cell[data-col="${cell.dataset.col}"]`).
                forEach(targetCell => targetCell.remove());
            // удаление верхней кнопки для колонки
            document.querySelector(`.control-button-top[data-number="${cell.dataset.col}"]`).remove();

            break;

        default:
            break;
    }

    refreshCellsData();
    refreshControlBtn();
    boardSizeInfoUpdate();
    pointerInfoUpdate();
}

/** Обновление клетки при смене типа клетки или предмета в ней
 * @param {HTMLDivElement} cell - обновляемая клетка
 * @param {string} type - тип/класс клетки 
 * @param {HTMLDivElement?} item - добавляемый предмет
 */
function updateCell(cell, type, item = '') {
    cell.dataset.type = type;
    cell.className = '';
    cell.classList.add('cell', type);
    cell.replaceChildren(item);
}

/** Обновление атрибутов data-row, data-col и title у клеток и рядов
*/
function refreshCellsData() {
    document.querySelectorAll('.row').forEach((row, r) => {
        row.dataset.row = r + 1;
        row.querySelectorAll('.cell').forEach((cell, c) => {
            cell.dataset.row = r + 1;
            cell.dataset.col = c + 1;
            cell.title = `ряд = ${cell.dataset.row} : колонка = ${cell.dataset.col}`;
        })
    })
}


//#####################################################################
//################## Блок информации ##################################


//######### Информация о поле ######################

/** обновление Информации о размерах поля */
function boardSizeInfoUpdate() {
    let rows = document.getElementsByClassName('row');
    let cols = rows[0].getElementsByClassName('cell');

    document.getElementById('info-row').innerText = rows.length;
    document.getElementById('info-col').innerText = cols.length;

    LEVEL.setBoardSize(rows.length, cols.length);
}

/** Обновление информации о предметах на поле: добыча, препятствия, противник
 */
function itemsInfoUpdate() {
    const board = document.getElementById('board');
    let loots = board.querySelectorAll('.item[data-type="loot"]');
    let hurdle = board.querySelectorAll('.item[data-type="hurdle"]');
    let enemy = board.querySelectorAll('.item[data-type="enemy"]');

    document.getElementById('info-loot').innerText = loots.length;
    document.getElementById('info-hurdle').innerText = hurdle.length;
    document.getElementById('info-enemy').innerText = enemy.length;
}

/** Ищет на поле клетки Старт и Финиш. Если они есть, то блокируют эти кнопки в боковом меню и наоборот. Обновляет информацию об этих клетках в блоке информации.
 */
function pointerInfoUpdate() {
    // Для кнопки/клетки Старт
    const cellStart = document.querySelector('.cell.start');
    const infoStart = document.getElementById('info-start');
    const btnStart = document.querySelector('.button-in-groupe.start');

    if (cellStart) {
        infoStart.innerText = 'ряд: ' + cellStart.dataset.row + '; колонка: ' + cellStart.dataset.col;
        infoStart.classList.remove('info-pointer-alert');
        btnStart.classList.add('btn-pointer-disabled');
        if (ACTION.item === 'start') {
            ACTION = '';
            btnStart.classList.remove('active-action');
        }
    } else {
        btnStart.classList.remove('btn-pointer-disabled');
        infoStart.innerText = "Добавьте клетку Старт!";
        infoStart.classList.add('info-pointer-alert');
    }

    // Для кнопок/клеток Финиш-открыт и Финиш-закрыт
    const infoFinish = document.getElementById('info-finish');
    const cellFinishOpen = document.querySelector('.cell.finish-open');
    const btnFinishOpen = document.querySelector('.button-in-groupe.finish-open');
    const cellFinishClose = document.querySelector('.cell.finish-close');
    const btnFinishClose = document.querySelector('.button-in-groupe.finish-close');

    const cellFinish = cellFinishOpen || cellFinishClose;

    if (cellFinish) {
        infoFinish.innerText = 'ряд: ' + cellFinish.dataset.row + '; колонка: ' + cellFinish.dataset.col;
        infoFinish.classList.remove('info-pointer-alert');
        btnFinishOpen.classList.add('btn-pointer-disabled');
        btnFinishClose.classList.add('btn-pointer-disabled');
        if (ACTION.item === 'finish-open' || ACTION.item === 'finish-close') {
            ACTION = '';
            btnFinishClose.classList.remove('active-action');
            btnFinishOpen.classList.remove('active-action');
        }
    } else {
        btnFinishOpen.classList.remove('btn-pointer-disabled');
        btnFinishClose.classList.remove('btn-pointer-disabled');
        infoFinish.innerText = "Добавьте клетку Финиш!";
        infoFinish.classList.add('info-pointer-alert');
    }
}

//################ Верхнее меню #####################
//########## отмена и возвращение действия ##########
/* 
Логика процесса:
 - при каждом действии на поле(добавление предметов, изменение типа клеток или изменение размеров поля) в массив arrBackward добавляется клон игрового поля до его изменения, активируется кнопка Отмены;
 - при нажатии на кнопку "Отменить" из массива arrBackward удаляется последняя запись, по ней восстанавливается поле, а так же эта запись добавляется в конец массива arrForward, активируется кнопка Возврата;
 - при нажатии на кнопку "Вернуть" происходит похожий процесс: из массива arrForward удаляется последняя запись, по которой восстанавливается игровое поле, а запись добавляется в конец массива arrBackward;
 - Если после нажатия кнопки отмена, было совершено какое-то действие на поле, то все записи из массива arrForward удаляются;
*/

/** Массив для сохранения состояний поля для кнопки Отмены действия */
const arrBackward = [];
/** Массив для сохранения состояний поля для кнопки Возврата действия */
const arrForward = [];
/** Указывает было ли сохранение в массив arrBackward */
let backwardSaveChecker = false;
/** кнопка "Отменить" */
const btnBackward = document.getElementById('btnBackward');
/** кнопка "Вернуть" */
const btnForward = document.getElementById('btnForward');

// отмена действия
btnBackward.addEventListener('click', () => {
    if (arrBackward.length > 0) {

        let data = arrBackward.pop();
        if (arrBackward.length === 0) btnBackward.disabled = true;

        if (backwardSaveChecker) {
            addToArrBackward()
            arrForward.push(arrBackward.pop())
            backwardSaveChecker = false;
        }

        arrForward.push(data);
        btnForward.disabled = false;

        document.querySelector('.board').remove();
        document.querySelector('.redactor').append(data);

        boardSizeInfoUpdate();
        itemsInfoUpdate();
        pointerInfoUpdate();
        refreshCellsData();
        refreshControlBtn();
    }
})
// возврат действия
btnForward.addEventListener('click', () => {
    if (arrForward.length > 0) {
        let data = arrForward.pop();
        if (arrForward.length === 0) btnForward.disabled = true;

        arrBackward.push(data);
        btnBackward.disabled = false;

        document.querySelector('.board').remove();
        document.querySelector('.redactor').append(data);

        boardSizeInfoUpdate();
        itemsInfoUpdate();
        pointerInfoUpdate();
        refreshCellsData();
        refreshControlBtn();
    }
})

/** Сохранение в массив Отмены действия */
function addToArrBackward() {
    const boardClone = document.getElementById('board').cloneNode(true);
    boardClone.querySelectorAll('.cell').forEach(cellEvent);

    boardClone.querySelectorAll('.control-button').
        forEach(controlButtonsAddEvent);

    arrBackward.push(boardClone);

    arrForward.length = 0;
    btnForward.disabled = true;

    btnBackward.disabled = false;
    backwardSaveChecker = true;
}

//######### Группа кнопок сохранения/изменения поля ##################
// ####### кнопка "Изменить описание" ########################
document.getElementById('btnDataEdit').addEventListener('click', () => {

    const cellStart = document.querySelector('.cell.start');

    if (cellStart) {
        borderMaker();
        LEVEL.board.data = [];
        // получение всех клеток поля

        document.querySelectorAll('.cell').
            forEach(cell => LEVEL.setBoardData(cell));
        localStorage.setItem("gameData", JSON.stringify(LEVEL));
        window.open('edit.html', '_self');
    } else alert('Необходимо добавить клетку Старт!');

});

//########### кнопка "Сохранить" #####################################
document.getElementById('btnSave').addEventListener('click', () => {
    const cellStart = document.querySelector('.cell.start');

    if (cellStart) {
        borderMaker();
        LEVEL.board.data = [];
        // получение всех клеток поля
        document.querySelectorAll('.cell').
            forEach(cell => LEVEL.setBoardData(cell));
        LEVEL.fileSave();

    } else alert('Необходимо добавить клетку Старт!');
});

//#################### кнопка "Сделать скриншот" #####################
document.getElementById('btnScreenshot').addEventListener('click', () => {
    let board = document.querySelector(".board");
    borderMaker();
    html2canvas(board, {
        x: 40,
        y: 40,
        width: board.clientWidth - 40,
        height: board.clientHeight - 40
    }).
        then(canvas => {
            const aTemp = document.createElement('a');
            aTemp.href = canvas.toDataURL('image/png');
            aTemp.download = `${LEVEL.id}_cover.png`;
            aTemp.click();
            aTemp.remove();
        });
});

/** рисует границу на клетках, которые соприкасаются с пустыми клетками (у них стиль "none") или находятся на границе поля */
function borderMaker() {
    document.querySelectorAll('.cell:not(.none)').forEach(cell => {
        cell.classList.remove('border-left', 'border-right', 'border-top', 'border-bottom');

        let row = Number(cell.dataset.row);
        let col = Number(cell.dataset.col);

        let left = document.querySelector(`.cell.none[data-row="${row}"][data-col="${col - 1}"]`);
        let right = document.querySelector(`.cell.none[data-row="${row}"][data-col="${col + 1}"]`);

        let top = document.querySelector(`.cell.none[data-row="${row - 1}"][data-col="${col}"]`);
        let bottom = document.querySelector(`.cell.none[data-row="${row + 1}"][data-col="${col}"]`);


        if (left || col === 1) cell.classList.add('border-left');
        if (right || col === LEVEL.board.size.cols) cell.classList.add('border-right');

        if (top || row === 1) cell.classList.add('border-top');
        if (bottom || row === LEVEL.board.size.rows) cell.classList.add('border-bottom');
    });
}

//########## кнопка "Играть!" ####################################

document.getElementById('btnPlay').addEventListener('click', () => {
    const cellStart = document.querySelector('.cell.start');

    if (cellStart) {
        borderMaker();
        LEVEL.board.data = [];
        // получение всех клеток поля
        document.querySelectorAll('.cell').
            forEach(cell => LEVEL.setBoardData(cell));
        localStorage.setItem('gameData', JSON.stringify(LEVEL));
        localStorage.setItem('fromConstructor', 'true')
        window.open('../../pages/game.html', '_self');

    } else alert('Необходимо добавить клетку Старт!');
});

//########## кнопка "В главное меню конструктора" ################

document.getElementById('btnBackConstructor').addEventListener('click', () => {
    window.open('constructor.html', '_self');
});

//########## кнопка "Как это работает" и модальное окно ##########
const modalHowItWork = document.querySelector('.modalHowItWork');

document.getElementById('btnHowItWork').addEventListener('click', () => {
    modalHowItWork.style.display = "block";
})

modalHowItWork.addEventListener('click', (e) => {
    if (['modal-close', 'modalHowItWork'].includes(e.target.className)) {
        modalHowItWork.removeAttribute('style');
    }
})