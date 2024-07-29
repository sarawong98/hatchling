export default class Shopgame extends Phaser.Scene {
    constructor() {
        super({key: 'Shopgame'});

    }

    preload() {
        this.load.image('verdunklung', 'Komponenten/verdunklung.png');
        this.load.image('shopBild', 'Komponenten/shopBild.png');
        this.load.image('shopBildOffen', 'Komponenten/shopBildOffen.png');
        this.load.image('shopBildOffenVase', 'Komponenten/shopBildOffenVase.png');
        this.load.image('shopBildOffenNapf', 'Komponenten/shopBildOffenNapf.png');
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

        const rectWidth = 300 * scale;
        const rectHeight = 120 * scale;
        const rectY = centerY + 550 * scale;
        const rectX1 = centerX + 50 * scale;
        const rectX2 = rectX1 + 350 * scale;

        this.add.image(0, 0, 'verdunklung').setScale(50, 50).setOrigin(0);

        if (vaseFreigeschaltet && napfFreigeschaltet) {
            this.add.image(centerX, centerY, 'shopBild').setScale(0.3 * scale, 0.3 * scale).setOrigin(0);
        } else if (vaseFreigeschaltet) {
            this.add.image(centerX, centerY, 'shopBildOffenNapf').setScale(0.25 * scale, 0.25 * scale).setOrigin(0);

            let rectangle2 = this.add.rectangle(rectX2, rectY, rectWidth, rectHeight, 0xffffff, 0).setOrigin(0).setInteractive();
            rectangle2.on('pointerdown', this.onRectangle2Click, this);

        } else if (napfFreigeschaltet) {
            this.add.image(centerX, centerY, 'shopBildOffenVase').setScale(0.25 * scale, 0.25 * scale).setOrigin(0);

            let rectangle1 = this.add.rectangle(rectX1, rectY, rectWidth, rectHeight, 0xffffff, 0).setOrigin(0).setInteractive();
            rectangle1.on('pointerdown', this.onRectangle1Click, this);

        } else {
            this.add.image(centerX, centerY, 'shopBildOffen').setScale(0.25 * scale, 0.25 * scale).setOrigin(0);

            let rectangle1 = this.add.rectangle(rectX1, rectY, rectWidth, rectHeight, 0xffffff, 0).setOrigin(0).setInteractive();
            rectangle1.on('pointerdown', this.onRectangle1Click, this);

            let rectangle2 = this.add.rectangle(rectX2, rectY, rectWidth, rectHeight, 0xffffff, 0).setOrigin(0).setInteractive();
            rectangle2.on('pointerdown', this.onRectangle2Click, this);
        }

        this.input.keyboard.on('keydown-SPACE', this.beendeShop, this);
    }
    onRectangle1Click() {
        console.log(this.totalCoins);
        if (this.totalCoins >= 10) {
            this.scene.get('MainScene').reduceCoins(10);
            this.totalCoins -= 10;
            vaseFreigeschaltet = true;
        }
    }

    onRectangle2Click() {
        console.log(this.totalCoins);
        if (this.totalCoins >= 15) {
            this.scene.get('MainScene').reduceCoins(15);
            this.totalCoins -= 15;
            napfFreigeschaltet = true;
        }
    }

     beendeShop() {
         this.scene.stop('Shopgame');
         this.scene.resume('MainScene');
    }
}