export default class Shopgame extends Phaser.Scene {
    constructor() {
        super({key: 'Shopgame'});

    }

    preload() {
        this.load.image('verdunklung', 'Komponenten/verdunklung.png');
        this.load.image('shopBild', 'Komponenten/shopBild.png');
        this.load.image('shopBildOffen', 'Komponenten/shopBildOffen.png');
    }

    init(data) {
        this.homeDragonX = data.homeDragonX;
        this.homeDragonY = data.homeDragonY;
        this.backgroundX = data.backgroundX;
        this.totalCoins = data.totalCoins;
    }

    create() {
        const centerX = window.innerWidth / 2 - 400 * scale;
        const centerY = window.innerHeight / 2 - 400 * scale;

        // Create a clickable rectangle
        const rectX = centerX + 50 * scale; // X position of the rectangle
        const rectY = centerY + 550 * scale; // Y position of the rectangle
        const rectWidth = 300 * scale; // Width of the rectangle
        const rectHeight = 120 * scale; // Height of the rectangle

        this.add.image(0, 0, 'verdunklung').setScale(50, 50).setOrigin(0);

        if (freigeschaltet) {
            this.add.image(centerX, centerY, 'shopBild').setScale(0.3 * scale, 0.3 * scale).setOrigin(0);
        } else {
            this.add.image(centerX, centerY, 'shopBildOffen').setScale(0.25 * scale, 0.25 * scale).setOrigin(0);

            let rectangle = this.add.rectangle(rectX, rectY, rectWidth, rectHeight, 0xffffff, 0).setOrigin(0).setInteractive();
            // Add a click event listener to the rectangle
            rectangle.on('pointerdown', this.onRectangleClick, this);
        }

        this.input.keyboard.on('keydown-SPACE', this.beendeShop, this);
    }
    onRectangleClick() {
        console.log(this.totalCoins);
        if (this.totalCoins >= 10){
            this.scene.get('MainScene').reduceCoins(10);
            freigeschaltet = true;
        }
    }

     beendeShop() {
         this.scene.stop('Shopgame');
         this.scene.resume('MainScene', { collectedCoins: -10 });
    }
}