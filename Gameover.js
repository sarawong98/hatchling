export default class Gameover extends Phaser.Scene {
    constructor() {
        super({ key: 'Gameover' });

        this.coin = null;
    }

    preload() {
        this.load.spritesheet('coin', 'Komponenten/coin_anim.png', { frameWidth: 32, frameHeight: 32 });
    }

    create(data) {
        // Add 'GAMEOVER' text
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 64, 'GAMEOVER', {
            fontSize: '64px',
            fontWeight: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Add 'Total score' text
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Total score: ' + data.finalScore, {
            fontSize: '48px',
            fontWeight: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Create the coin animation
        this.anims.create({
            key: 'rotate',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // Add the coin sprite and play the animation
        this.coin = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 1.5, 'coin');
        this.coin.play('rotate');

        // Add collected coins text
        this.add.text(this.cameras.main.width / 2 + 40, this.cameras.main.height / 1.5, 'x ' + data.finalScore, {
            fontSize: '48px',
            fontWeight: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Delay before restarting the main scene
        this.time.delayedCall(5000, () => {
            this.scene.start('MainScene');
        });
    }
}
