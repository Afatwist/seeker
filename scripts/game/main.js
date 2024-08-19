// Импорт модулей
import { LevelRender } from "../Classes/LevelRender.js";
import { Level } from "../Classes/Level.js";
import { Game } from "./Game.js";
import { baseUrl } from "../Classes/Helpers.js";

// Получение данных игры из localStorage 
const gameData = JSON.parse(localStorage.getItem('gameData'));



/** Данные текущего уровня */
const LEVEL = new Level(gameData);

// импорт данных о наборе графики. Нужно для создания меню и объектов на поле
const { set_desc } = await import(
    `../../sources/graphics_set/${LEVEL.graphics_set}/set_description.js`);


// Генерирование игрового поля
LevelRender.setData(LEVEL, set_desc).make(true);

// Игра
Game.playing();


// Кнопки Верхнего меню и модального окна
/** если переход был из конструктора, появляется кнопка и позволяет вернуться обратно */
document.querySelectorAll('.to-constructor').forEach(btn => {
    if (localStorage.getItem('fromConstructor') === 'true') {
        btn.style.display = 'block';
        btn.addEventListener('click', () => {
            btn.removeAttribute('style');
            window.history.back();
        });
    } else {
        btn.removeAttribute('style');
    }
});


/** кнопка "Начать заново" */
document.querySelectorAll('.replay').forEach(btn => {
    btn.addEventListener('click', () => {
        location.reload();
    })
})

/** кнопка "К выбору уровней" */
document.querySelectorAll('.level-list').forEach(btn => {
    if (localStorage.getItem('fromConstructor') !== 'true') {
        btn.removeAttribute('style');
        btn.addEventListener('click', () => {
            window.open('../pages/file-choose/file-choose.html', '_self');
        });
    } else {
        btn.style.display = 'none';
    }
})

/** кнопка "На главную страницу" */
document.querySelectorAll('.to-main-page').forEach(btn => {
    if (localStorage.getItem('fromConstructor') !== 'true') {
        btn.removeAttribute('style');
        btn.addEventListener('click', () => {
            window.open(baseUrl, '_self');
        })
    } else {
        btn.style.display = 'none';
    }

})