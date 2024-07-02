export default class Shopgame extends Phaser.Scene {
    constructor() {
        super({key: 'Shopgame'});
    }

    preload() {
        this.load.image('verdunklung', 'Komponenten/verdunklung.png');
        this.load.image('shopBild', 'Komponenten/shopBild.png');
    }

    create() {
        const centerX = window.innerWidth / 2 - 400 * scale;
        const centerY = window.innerHeight / 2 - 400 * scale;

        this.add.image(0, 0, 'verdunklung').setScale(50, 50).setOrigin(0);
        this.add.image(centerX, centerY, 'shopBild').setScale(0.3 * scale, 0.3 * scale).setOrigin(0);

        this.input.keyboard.on('keydown-SPACE', this.beendeShop, this);
    }

     beendeShop() {
        this.scene.stop('Shopgame');
    }
}