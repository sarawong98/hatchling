export default class Gameover extends Phaser.Scene {
    constructor() {
        super({ key: 'Gameover' });
    }

    create(data) {
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 64, 'GAMEOVER', {
            fontSize: '64px',
            fill: '#ff0000'
        }).setOrigin(0.5);
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 1.7 - 64, 'Total: ' + data.finalScore, {
            fontSize: '48px',
            fill: '#ff0000'
        }).setOrigin(0.5);
        // Wechseln der Szene durch Leertaste
        this.input.keyboard.on('keydown-SPACE', function () {
            this.scene.start('MainScene');
        }, this);
    }
}