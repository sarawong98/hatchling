//Minispiel2
export default class Sleepinggame extends Phaser.Scene {
    constructor() {
        super({key: 'Sleepinggame'});
        this.sounds = null;
    }

    init(data) {
        this.backgroundX = data.backgroundX;
        this.pfeilX = data.pfeilX; // Pfeil x-Position speichern
        this.totalCoins = data.totalCoins;
        this.homeDragonX = data.homeDragonX;
        this.homeDragonY = data.homeDragonY;
    }

    preload() {
        this.load.svg('bett', 'Komponenten/bett.svg');
        this.load.svg('drache_schlafen', 'Komponenten/drache_schlafen.svg'); // Drache schläft SVG
        this.load.svg('zzz', 'Komponenten/zzz.svg'); // Zzz SVG
        this.load.svg('raum', 'Komponenten/raum.svg');
        this.load.audio('sleepingMusic', 'audio/sleeping-music.mp3');
        this.load.audio('switchSound', 'audio/switch-sound.mp3');
    }

    create() {
        this.sounds = this.sound.add('switchSound', {volume: 1, loop: false});
        this.backgroundMusic = this.sound.add('sleepingMusic', {volume: 1, loop: true});
        this.backgroundMusic.play();

        this.add.image(this.backgroundX, 0, 'raum').setOrigin(0).setScale(scale);
        this.add.image(this.backgroundX, 0, 'bett').setOrigin(0).setScale(scale);

        // Drache schlafen und Zzz anzeigen
        this.add.image(this.pfeilX - 80 * scale, 580 * scale, 'drache_schlafen').setOrigin(0);
        this.add.image(this.pfeilX - 50 * scale, 480 * scale, 'zzz').setOrigin(0).setScale(0.5 * scale); // Kleinere Skalierung und gleiche x-Koordinate wie Drache

        // Interaktiver unsichtbarer Kasten als Platzhalter für den Lichtschalter
        this.lampSwitch = this.add.rectangle(this.pfeilX - 335 * scale, 480 * scale, 110, 180, 0x000000, 0).setInteractive(); // Unsichtbarer Kasten
        this.lampSwitch.on('pointerdown', this.toggleLight, this);

        // Tag-Nacht-Wechsel-Effekt
        this.nightOverlay = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x000000).setOrigin(0).setAlpha(0);

        // Münzanzeige Hintergrundkasten
        const coinsBoxWidth = 220;
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
            'Coins: ' + this.totalCoins,
            {fontSize: '32px', fontWeight: 'bold', fill: '#000', align: 'center'}
        );
        coinsText.setOrigin(0.5);

        // Sorge dafür, dass der Text über dem Hintergrundkasten liegt
        coinsText.setDepth(1);

        // Hintergrundkasten unter den Text legen
        coinsBox.setDepth(0);

        // Tutorial anzeigen
        this.showTutorial();
    }

    toggleLight() {
        this.sounds.play();
        this.time.delayedCall(300, () => {
            if (this.nightOverlay.alpha === 0) {
                // Nachtmodus aktivieren
                this.tweens.add({
                    targets: this.nightOverlay,
                    alpha: 0.9,
                    duration: 2000,
                });
            } else {
                // Tagmodus aktivieren
                this.tweens.add({
                    targets: this.nightOverlay,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => {
                        this.backgroundMusic.stop();
                        this.scene.start('MainScene', {
                            backgroundX: background.x,
                            homeDragonX: this.homeDragonX,
                            homeDragonY: this.homeDragonY
                        });
                    }
                });
            }
        });
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
            {fontSize: '24px', fill: '#FD302F', fontStyle: 'bold', align: 'center'}
        );
        closeButton.setOrigin(1, 0);
        closeButton.setInteractive({useHandCursor: true}); // Macht den Text klickbar

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
            'Steuerung:\n\nKlicke auf die Nachttischlampe um\nden Drachen ins Bett zubringen.\nSchalte sie wieder ein um ihn zu wecken.',
            {fontSize: '24px', fill: '#000000', align: 'center', wordWrap: {width: boxWidth - boxPadding * 2}}
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