// Импорт модулей
import { LevelRender } from "../Classes/LevelRender.js";
import { Level } from "../Classes/Level.js";
import { Game } from "./Game.js";
import { TopMenu } from "./TopMenu.js";

// Получение данных игры из localStorage 
const gameData = JSON.parse(localStorage.getItem('gameData'));

/** Данные текущего уровня */
const LEVEL = new Level(gameData);


// импорт данных о наборе графики. Нужно для создания меню и объектов на поле
const { set_desc } = await import(
    `../../sources/graphics_set/${LEVEL.graphics_set}/set_description.js`);


// Генерирование игрового поля
LevelRender.setData(LEVEL, set_desc).make(true);

// Верхнее меню
TopMenu.init(Level.count, LEVEL.id);

// Игра
Game.playing();