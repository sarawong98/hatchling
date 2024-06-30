export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.totalCoins = 0;
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
        background = this.add.image(0, 0, 'raum').setOrigin(0);
        pfeil1 = this.add.image(250, 450, 'pfeil').setOrigin(0).setScale(0.4, 0.4).setVisible(false);
        pfeil2 = this.add.image(1250, 450, 'pfeil').setOrigin(0).setScale(0.4, 0.4).setVisible(false);
        pfeil3 = this.add.image(3220, 350, 'pfeil').setOrigin(0).setScale(0.4, 0.4).setVisible(false);
        pfeil4 = this.add.image(2800, 550, 'pfeil').setOrigin(0).setScale(0.4, 0.4).setVisible(false);
        pfeil5 = this.add.image(4005, 550, 'pfeil').setOrigin(0).setScale(0.4, 0.4).setVisible(false);
        pfeil6 = this.add.image(2200, 550, 'pfeil').setOrigin(0).setScale(0.4, 0.4).setVisible(false);



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


        // Tisch
        tisch = this.add.image(2510, 789, 'tisch').setOrigin(0).setScale(1.7, 1.7).setVisible(true);

        //Blumenvase
        blumenvase = this.add.image(2860, 595, 'blumenvase').setOrigin(0).setScale(0.07, 0.07).setVisible(false);


        cursors = this.input.keyboard.createCursorKeys();

        // Flügelanimation alle 250 ms
        this.time.addEvent({
            delay: 250,
            callback: this.animateWings,
            callbackScope: this,
            loop: true
        });

        // Münzanzeige
        this.add.text(16, 16, 'Coins: ' + this.totalCoins, { fontSize: '32px', fontWeight: 'bold', fill: '#000' });

        // Starten der Minispiele durch Leertaste
        this.input.keyboard.on('keydown-SPACE', () => {
            if (selectedObject === 'pfeil1') {
                this.scene.launch('Showergame', { backgroundX: background.x, totalCoins: this.totalCoins});
            } else if (selectedObject === 'pfeil2') {
                this.backgroundMusic.stop();
                this.scene.start('Sleepinggame', { backgroundX: background.x, pfeilX: pfeil2.x , totalCoins: this.totalCoins});
            } else if (selectedObject === 'pfeil3') {
                this.backgroundMusic.stop();
                this.scene.start('Flyinggame');
            } else if (selectedObject === 'pfeil4') {
                this.backgroundMusic.stop();
                this.scene.start('Memorygame');
            } else if (selectedObject === 'pfeil5') {
                this.backgroundMusic.stop();
                this.scene.start('Eatinggame');
            } else if (selectedObject === 'pfeil6') {
                this.scene.launch('Shopgame');
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