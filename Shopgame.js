export default class Shopgame extends Phaser.Scene {
    constructor() {
        super({key: 'Shopgame'});
    }

    preload() {
        this.load.svg('raum', 'Komponenten/raum.svg');
        this.load.image('verdunklung', 'Komponenten/verdunklung.png');
        this.load.image('shopBild', 'Komponenten/shopBild.png');
    }

    create() {
        const centerX = this.sys.game.config.width / 2 - 400;
        const centerY = this.sys.game.config.height / 2 - 400;

        this.add.image(-1500, 0, 'raum').setOrigin(0);
        this.add.image(0, 0, 'verdunklung').setScale(50, 50).setOrigin(0);
        this.add.image(centerX, centerY, 'shopBild').setScale(0.3, 0.3).setOrigin(0);

        this.input.keyboard.on('keydown-SPACE', this.beendeShop, this);
    }

     beendeShop() {
        this.scene.start('MainScene');
    }
}