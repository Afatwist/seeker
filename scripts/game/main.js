import { LevelRender } from "../Classes/LevelRender.js";
import { Level } from "../Classes/Level.js";
import { Game } from "./Game.js";
import { TopMenu } from "./TopMenu.js";
const gameData = JSON.parse(localStorage.getItem('gameData'));
const LEVEL = new Level(gameData);
LevelRender.setData(LEVEL);
LevelRender.make(true);
TopMenu.init(Level.count, LEVEL.id);
Game.playing();
//# sourceMappingURL=main.js.map