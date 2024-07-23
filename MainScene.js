export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.totalCoins = 0;
        this.homeDragonX = dragonX;
        this.homeDragonY = dragonY;
        this.backgroundX = 0;
        this.health = 100; // Initial health value
        this.healthBar = null;
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

        // Create health bar
        this.healthBar = this.add.graphics();
        this.updateHealthBar();

        // Create health bar title
        const barWidth = 400;
        const x = this.cameras.main.width - barWidth - 20; // Adjusted for small margin
        this.healthText = this.add.text(x, 10, 'Gemütszustand', {
            fontSize: '24px',
            fill: '#fff'
        });

        // Set interval to reduce health every minute
        this.time.addEvent({
            delay: 60000, // 60000 ms = 1 minute
            callback: this.reduceHealth,
            callbackScope: this,
            loop: true
        });

        // Münzanzeige Hintergrundkasten
        const coinsBoxWidth = 180;
        const coinsBoxHeight = 50;
        const coinsBoxPadding = 10;
        const coinsBoxMarginTop = 16;

        const coinsBox = this.add.graphics()
            .fillStyle(0xffffff, 1)
            .fillRoundedRect(coinsBoxPadding, coinsBoxMarginTop, coinsBoxWidth, coinsBoxHeight, 10);

        // Münzanzeige Text
        const coinsText = this.add.text(
            coinsBoxPadding + coinsBoxWidth / 2,
            coinsBoxMarginTop + coinsBoxHeight / 2,
            'Münzen: ' + this.totalCoins,
            { fontSize: '32px', fontWeight: 'bold', fill: '#000', align: 'center' }
        );
        coinsText.setOrigin(0.5);

        // Sorge dafür, dass der Text über dem Hintergrundkasten liegt
        coinsText.setDepth(1);

        // Hintergrundkasten unter den Text legen
        coinsBox.setDepth(0);

        // Tutorial anzeigen
        this.showTutorial();

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

    updateHealthBar() {
        this.healthBar.clear();

        console.log(this.health);
        let color;
        if (this.health > 60) {
            color = 0x7f8d44; // Green
        } else if (this.health > 30) {
            color = 0xe78a36; // Yellow
        } else {
            color = 0xb9471e; // Red
        }
        // Position of the health bar

        const barWidth = 400;
        const barHeight = 30;
        const x = this.cameras.main.width - barWidth - 20; // Adjusted for small margin
        const y = 40; // Small margin from the top

        // Draw the health bar background (black border)
        this.healthBar.fillStyle(0x000000, 1);
        this.healthBar.fillRoundedRect(x, y, barWidth, barHeight, 10);

        // Draw the health bar
        this.healthBar.fillStyle(color, 1);
        this.healthBar.fillRoundedRect(x + 2, y + 2, (barWidth - 4) * (this.health / 100), barHeight - 4, 8); // Slightly smaller to create a border effect
    }

    reduceHealth() {
        if (this.health > 5) {
            this.health -= 5;
            this.updateHealthBar();
        }
    }

    increaseHealth(amount) {
        this.health = Math.min(this.health + amount, 100);
    }

    increaseCoins(amount) {
        this.totalCoins += amount;
    }

    // Funktion zum Anzeigen des Tutorials
    showTutorial() {
        // Manuell festgelegte Größe für den Hintergrundkasten
        const boxWidth = 650;
        const boxHeight = 200;
        const boxPadding = 20;
        const marginTop = 100; // Abstand von der oberen Kante
    
        // Hintergrundkasten für das Tutorial
        const box = this.add.graphics()
            .fillStyle(0xffffff, 1)
            .fillRoundedRect(this.cameras.main.width / 2 - boxWidth / 2, marginTop, boxWidth, boxHeight, 10);
        
        // Schließen-Button ("X")
        const closeButton = this.add.text(
            this.cameras.main.width / 2 + boxWidth / 2 - 20, // Position des Buttons rechts oben im Kasten
            marginTop + 10, // Y-Position leicht nach unten versetzt
            'X',
            { fontSize: '24px', fill: '#FD302F', fontStyle: 'bold', align: 'center' }
        );
        closeButton.setOrigin(1, 0);
        closeButton.setInteractive({ useHandCursor: true }); // Macht den Text klickbar
    
        // Eventlistener für den Schließen-Button
        closeButton.on('pointerdown', () => {
            box.setVisible(false); // Hintergrundkasten ausblenden
            closeButton.setVisible(false); // Button ausblenden
            this.tutorialText.setVisible(false); // Text ausblenden
        });
        
        // Tutorial-Text erstellen
        this.tutorialText = this.add.text(
            this.cameras.main.width / 2,
            marginTop + boxHeight / 2,
            'Steuerung:\n\nVerwende die Pfeiltasten um\nden Drachen nach links oder rechts zu bewegen.\nDrücke die Leertaste, um ein Objekt auszuwählen.',
            { fontSize: '24px', fill: '#000000', align: 'center', wordWrap: { width: boxWidth - boxPadding * 2 } }
        );
        this.tutorialText.setOrigin(0.5);
        this.tutorialText.setDepth(2); // Über dem Hintergrundkasten

        this.tutorialText.setVisible(false); // Anfangs unsichtbar
        box.setVisible(false); // Hintergrundkasten anzeigen
        closeButton.setVisible(false);
    
        // Nur beim ersten Besuch zeigen
        if (!this.tutorialShown) {
            this.tutorialText.setVisible(true);
            box.setVisible(true); // Hintergrundkasten anzeigen
            closeButton.setVisible(true); // Button anzeigen
            this.tutorialShown = true;
        }
    }
}
