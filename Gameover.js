export default class Gameover extends Phaser.Scene {
    constructor() {
        super({ key: 'Gameover' });
        this.coins = 0;
    }

    create(data) {
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 64, 'GAMEOVER', {
            fontSize: '64px',
            fontWeight: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.coins = this.calculateEarnedCoins(data.finalScore);

        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 1.7 - 64, 'Earned Coins: ' + this.coins, {
            fontSize: '48px',
            fontWeight: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Delay before restarting the main scene
        this.time.delayedCall(3000, () => {
            this.scene.start('MainScene', {collectedCoins: this.coins});
        });
    }

    calculateEarnedCoins(score) {
        return Math.floor(score / 5);
    }
}