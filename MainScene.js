export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.totalCoins = 0;
        this.homeDragonX = dragonX;
        this.homeDragonY = dragonY;
        this.backgroundX = 0;
    }

    init(data) {
        // Get screen dimensions
        screenWidth = this.cameras.main.width;
        screenHeight = this.cameras.main.height;

        // Set dragon position from data if available
        if (data && data.homeDragonX !== undefined && data.homeDragonY !== undefined) {
            this.homeDragonX = data.homeDragonX;
            this.homeDragonY = data.homeDragonY;
        }
    }

    preload() {
        this.load.svg('raum', 'Komponenten/raum.svg');
        this.load.svg('pfeil', 'Komponenten/pfeil.svg');
        this.load.svg('drache_oben', 'Komponenten/Drache_rechts_oben.svg');
        this.load.svg('drache_mitte2', 'Komponenten/Drache_rechts_mitte2.svg');
        this.load.svg('drache_mitte', 'Komponenten/Drache_rechts_mitte.svg');
        this.load.svg('drache_unten', 'Komponenten/Drache_rechts_unten.svg');
        this.load.svg('tisch', 'Komponenten/tisch.svg');
        this.load.image('blumenvase', 'Komponenten/blumenvase.png');
        this.load.audio('backgroundMusic', 'audio/cozy-homey-relaxing-music.mp3');
    }

    create(data) {
        scene = this;

        if (data && data.collectedCoins) {
            this.totalCoins += data.collectedCoins;
        }

        // Create and play the background music
        this.backgroundMusic = this.sound.add('backgroundMusic', { volume: 1, loop: true });
        this.backgroundMusic.play();

        // Hintergrund und Pfeile
        var image = this.add.image(this.backgroundX, 0, 'raum').setOrigin(0);
        scale = this.cameras.main.height / image.height;
        background = image.setScale(scale);

        var arrowScale = 0.4  * scale; // Arbitrary scale based on screen height
        pfeil1 = this.add.image(250 * scale + this.backgroundX, 450 * scale, 'pfeil').setOrigin(0).setScale(arrowScale).setVisible(false);
        pfeil2 = this.add.image(1250 * scale + this.backgroundX, 450 * scale, 'pfeil').setOrigin(0).setScale(arrowScale).setVisible(false);
        pfeil3 = this.add.image(3220 * scale + this.backgroundX, 350 * scale, 'pfeil').setOrigin(0).setScale(arrowScale).setVisible(false);
        pfeil4 = this.add.image(2800 * scale + this.backgroundX, 550 * scale, 'pfeil').setOrigin(0).setScale(arrowScale).setVisible(false);
        pfeil5 = this.add.image(4005 * scale + this.backgroundX, 550 * scale, 'pfeil').setOrigin(0).setScale(arrowScale).setVisible(false);
        pfeil6 = this.add.image(2205 * scale + this.backgroundX, 550 * scale, 'pfeil').setOrigin(0).setScale(arrowScale).setVisible(false);

        // Drachenanimationen
        dragonFrames = [
            this.add.image(this.homeDragonX, this.homeDragonY, 'drache_oben').setVisible(false),
            this.add.image(this.homeDragonX, this.homeDragonY, 'drache_mitte2').setVisible(false),
            this.add.image(this.homeDragonX, this.homeDragonY, 'drache_mitte').setVisible(false),
            this.add.image(this.homeDragonX, this.homeDragonY, 'drache_unten').setVisible(false),
            this.add.image(this.homeDragonX, this.homeDragonY, 'drache_mitte').setVisible(false),
            this.add.image(this.homeDragonX, this.homeDragonY, 'drache_mitte2').setVisible(false)
        ];
        dragon = dragonFrames[0];
        dragon.setVisible(true);

        // Tisch
        tisch = this.add.image(2510 * scale + this.backgroundX, 789 * scale, 'tisch').setOrigin(0).setScale(1.7 * scale, 1.7 * scale).setVisible(true);

        //Blumenvase
        blumenvase = this.add.image(2860 * scale + this.backgroundX, 595 * scale, 'blumenvase').setOrigin(0).setScale(0.07 * scale, 0.07 * scale).setVisible(false);

        cursors = this.input.keyboard.createCursorKeys();

        // Flügelanimation alle 250 ms
        this.time.addEvent({
            delay: 250,
            callback: this.animateWings,
            callbackScope: this,
            loop: true
        });

        // Münzanzeige
        this.add.text(16, 32, 'Coins: ' + this.totalCoins, { fontSize: '32px', fontWeight: 'bold', fill: '#000' });

        // Starten der Minispiele durch Leertaste
        this.input.keyboard.on('keydown-SPACE', () => {
            this.backgroundX = background.x;
            this.homeDragonX = dragon.x;
            this.homeDragonY = dragon.y;
            if (selectedObject === 'pfeil1') {
                this.scene.launch('Showergame', { backgroundX: background.x, totalCoins: this.totalCoins, homeDragonX: this.homeDragonX, homeDragonY: this.homeDragonY});
            } else if (selectedObject === 'pfeil2') {
                this.backgroundMusic.stop();
                this.scene.start('Sleepinggame', { backgroundX: background.x, pfeilX: pfeil2.x , totalCoins: this.totalCoins, homeDragonX: this.homeDragonX, homeDragonY: this.homeDragonY});
            } else if (selectedObject === 'pfeil3') {
                this.backgroundMusic.stop();
                this.scene.start('Flyinggame', { backgroundX: background.x, homeDragonX: this.homeDragonX, homeDragonY: this.homeDragonY });
            } else if (selectedObject === 'pfeil4') {
                this.backgroundMusic.stop();
                this.scene.start('Memorygame', { backgroundX: background.x, homeDragonX: this.homeDragonX, homeDragonY: this.homeDragonY });
            } else if (selectedObject === 'pfeil5') {
                this.backgroundMusic.stop();
                this.scene.start('Eatinggame', { backgroundX: background.x, homeDragonX: this.homeDragonX, homeDragonY: this.homeDragonY });
            } else if (selectedObject === 'pfeil6') {
                this.scene.launch('Shopgame', { backgroundX: background.x, homeDragonX: this.homeDragonX, homeDragonY: this.homeDragonY });
            }
        });
    }

    update() {
        // Update der Drachen- und Pfeilpositionen sowie Überprüfung der Nähe der Pfeile
        updateDragonPosition();
        updatePfeilPositions();
        checkPfeilProximity();
        handleInput();
        checkBlumenvase();
    }

    // Flügelanimation des Drachen
    animateWings() {
        dragonFrames[frameIndex].setVisible(false);
        frameIndex = (frameIndex + 1) % dragonFrames.length;
        dragon = dragonFrames[frameIndex];
        dragon.setVisible(true);
    }
}