/* Обработчик для файла constructor-board.html;
 * Создание бокового меню для выбранного набора графики;
 * Редактирование выбранного/созданного игрового поля;
 * Проверка правильности созданного поля;
 * Сохранение игрового поля;
 * Надо доделать:
 * кнопки в блоке info: "отменить" и "вернуть" работают криво;
*/


import { LevelRender } from "../Classes/LevelRender.js";
// import { Level } from "../Classes/Level.js";
import './types.js';
import { TopMenu } from './part/TopMenu.js';
import { BoardInfo } from "./part/BoardInfo.js";
import { SideMenu } from "./part/SideMenu.js";
import { Main } from "./part/Main.js";
import { ControlBtn } from "./part/ControlBtn.js";
import { BackForwardAction } from "./part/BackForwardAction.js";

// Получение данных игры из localStorage 
const gameData: ILevelData = JSON.parse(localStorage.getItem('gameData') as string);
/** импорт данных о наборе графики. Нужно для создания меню и объектов на поле */
const { set_desc } = await import(
    `../../sources/graphics_set/${gameData.graphics_set}/set_description.js`);


Main.init(gameData);

LevelRender.setData(Main.LEVEL); // !!! записать это в одну строку
LevelRender.make(false); //

SideMenu.render(set_desc).listener();
TopMenu.listener();
ControlBtn.make();
Main.handler();

BoardInfo.init().update(true);
BackForwardAction.init().listener();