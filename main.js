// Imports
import MainScene from "./MainScene.js";
import Showergame from "./Showergame.js";
import Sleepinggame from "./Sleepinggame.js";
import Flyinggame from "./Flyinggame.js";
import Gameover from "./Gameover.js";


const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#87CEEB',
    parent: 'game-container',
    pixelArt: true,
    scene: [MainScene, Showergame, Sleepinggame, Flyinggame, Gameover],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
