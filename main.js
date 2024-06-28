// Imports
import MainScene from "./MainScene.js";
import Showergame from "./Showergame.js";
import Sleepinggame from "./Sleepinggame.js";
import Flyinggame from "./Flyinggame.js";
import Gameover from "./Gameover.js";
import Memorygame from "./Memorygame.js";
import Eatinggame from "./Eatinggame.js";
import Shopgame from "./Shopgame.js";

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#87CEEB',
    parent: 'game-container',
    pixelArt: true,
    scene: [MainScene, Showergame, Sleepinggame, Flyinggame, Gameover, Memorygame, Eatinggame, Shopgame],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
