export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.svg('raum', 'Komponenten/raum.svg');
        this.load.svg('pfeil', 'Komponenten/pfeil.svg');
        this.load.svg('drache_oben', 'Komponenten/Drache_rechts_oben.svg');
        this.load.svg('drache_mitte2', 'Komponenten/Drache_rechts_mitte2.svg');
        this.load.svg('drache_mitte', 'Komponenten/Drache_rechts_mitte.svg');
        this.load.svg('drache_unten', 'Komponenten/Drache_rechts_unten.svg');
        this.load.spritesheet('coin', 'Komponenten/coin_anim.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        scene = this;

        // Hintergrund und Pfeile
        background = this.add.image(0, 0, 'raum').setOrigin(0).setDepth(0);
        pfeil1 = this.add.image(250, 450, 'pfeil').setOrigin(0).setScale(0.4, 0.4).setVisible(false);
        pfeil2 = this.add.image(1250, 450, 'pfeil').setOrigin(0).setScale(0.4, 0.4).setVisible(false);
        pfeil3 = this.add.image(3220, 350, 'pfeil').setOrigin(0).setScale(0.4, 0.4).setVisible(false);

        // Drachenanimationen
        dragonFrames = [
            this.add.image(dragonX, dragonY, 'drache_oben').setVisible(false),
            this.add.image(dragonX, dragonY, 'drache_mitte2').setVisible(false),
            this.add.image(dragonX, dragonY, 'drache_mitte').setVisible(false),
            this.add.image(dragonX, dragonY, 'drache_unten').setVisible(false),
            this.add.image(dragonX, dragonY, 'drache_mitte').setVisible(false),
            this.add.image(dragonX, dragonY, 'drache_mitte2').setVisible(false)
        ];
        dragon = dragonFrames[0];
        dragon.setVisible(true);

        cursors = this.input.keyboard.createCursorKeys();

        // Flügelanimation alle 250 ms
        this.time.addEvent({
            delay: 250,
            callback: this.animateWings,
            callbackScope: this,
            loop: true
        });

        // Starten der Minispiele durch Leertaste
        this.input.keyboard.on('keydown-SPACE', () => {
            if (selectedObject === 'pfeil1') {
                this.scene.start('Showergame', { backgroundX: background.x });
            } else if (selectedObject === 'pfeil2') {
                this.scene.start('Sleepinggame', { backgroundX: background.x, pfeilX: pfeil2.x });
            } else if (selectedObject === 'pfeil3') {
                this.scene.start('Flyinggame');
            }
        });

        // Create the coin animation
        this.anims.create({
            key: 'rotate',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // Add the coin sprite and play the animation
        coin = this.add.sprite(100, 100, 'coin').setScale(1).setDepth(1).setVisible(true);
        console.log(coin);
        coin.play('rotate');

        // Debugging logs
        console.log('Coin added at position:', coin.x, coin.y);
        console.log('Coin animation playing:', coin.anims.isPlaying);
    }

    update() {
        // Update der Drachen- und Pfeilpositionen sowie Überprüfung der Nähe der Pfeile
        updateDragonPosition();
        updatePfeilPositions();
        checkPfeilProximity();
        handleInput();
    }

    // Flügelanimation des Drachen
    animateWings() {
        dragonFrames[frameIndex].setVisible(false);
        frameIndex = (frameIndex + 1) % dragonFrames.length;
        dragon = dragonFrames[frameIndex];
        dragon.setVisible(true);
    }
}