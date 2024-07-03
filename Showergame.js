export default class Showergame extends Phaser.Scene {
    constructor() {
        super({key: 'Showergame'});
        this.sounds = null;
    }

    init(data) {
        this.homeDragonX = data.homeDragonX;
        this.homeDragonY = data.homeDragonY;
        this.backgroundX = data.backgroundX;
        this.totalCoins = data.totalCoins;
    }

    preload() {
        this.load.svg('badewanne', 'Komponenten/badewanne.svg');
        this.load.svg('seifenblase', 'Komponenten/seifenblase.svg'); // Seifenblasen laden
        this.load.svg('Drache_baden', 'Komponenten/Drache_baden.svg');
        this.load.svg('raum', 'Komponenten/raum.svg');
        this.load.audio('bubblePopSound', 'audio/bubble-pop.mp3');
    }

    create(data) {
        this.sounds = this.sound.add('bubblePopSound', {volume: 1, loop: false});

        this.add.image(this.backgroundX, 0, 'raum').setOrigin(0).setScale(scale);
        this.drache = this.add.image(200 * scale, 430 * scale, 'Drache_baden').setOrigin(0);
        this.badewanne = this.add.image(0, 0, 'badewanne').setOrigin(0).setScale(scale);

        this.rotationSpeed = 0.025; // Rotationsgeschwindigkeit
        this.rotationDirection = 1; // Richtung der Rotation (1 für rechts, -1 für links)

        // Zähler für die Anzahl der erzeugten Seifenblasen
        this.numCreatedBubbles = 0;

        // Timer für die Seifenblasen (10 Mal wiederholen)
        this.seifenblaseTimer = this.time.addEvent({
            delay: Phaser.Math.Between(2000, 5000), // Erhöhte Zeitverzögerung
            callback: this.createSingleSeifenblase,
            callbackScope: this,
            repeat: 9 // 10 Mal wiederholen (0-9 = 10 Mal)
        });

        // Array für aktuelle Seifenblasen
        this.seifenblasen = [];

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
            { fontSize: '32px', fontWeight: 'bold', fill: '#000', align: 'center' }
        );
        coinsText.setOrigin(0.5);

        // Sorge dafür, dass der Text über dem Hintergrundkasten liegt
        coinsText.setDepth(1);

        // Hintergrundkasten unter den Text legen
        coinsBox.setDepth(0);

        // Tutorial anzeigen
        this.showTutorial();
    }

    update() {
        // Rotiere den Drachen um seine eigene Achse mit erhöhter Geschwindigkeit
        this.drache.angle += this.rotationSpeed * this.rotationDirection;

        // Ändere die Richtung der Rotation, wenn der Drache eine bestimmte Grenze erreicht
        if (this.drache.angle >= 2 || this.drache.angle <= -2) {
            this.rotationDirection *= -1; // Umkehrung der Richtung
        }

        // Überprüfen, ob alle Seifenblasen zerstört sind
        if (this.seifenblasen.length === 0 && this.numCreatedBubbles === 10) {
            // Kurze Verzögerung vor dem Wechsel zur Hauptszene
            this.time.delayedCall(1000, () => {
                this.returnToMainScene();
            });
        }
    }

    createSingleSeifenblase() {
        // Zufällige Position und Größe für die Seifenblase
        const x = Phaser.Math.Between(120, 500) * scale;
        const y = 540 * scale;
        const scaleBubble = Phaser.Math.FloatBetween(0.1, 0.4); // Zufällige Skalierung zwischen 0.1 und 0.5

        const seifenblase = this.add.image(x, y, 'seifenblase').setScale(scaleBubble);

        // Bewegung der Seifenblase nach oben
        const speed = 50; // Zufällige Geschwindigkeit
        this.tweens.add({
            targets: seifenblase,
            y: -50 * scale, // Zielposition (aus dem Bildschirm)
            duration: speed * 500, // Dauer basierend auf der Geschwindigkeit
            onComplete: () => {
                // Seifenblase aus dem Array entfernen, wenn sie zerstört wird
                this.seifenblasen = this.seifenblasen.filter(bubble => bubble !== seifenblase);
                seifenblase.destroy(); // Seifenblase nach der Animation zerstören
            }
        });

        // Klick-Interaktion: Wenn die Seifenblase angeklickt wird, verschwindet sie
        seifenblase.setInteractive();
        seifenblase.on('pointerdown', () => {
            this.sounds.play();
            this.time.delayedCall(300, () => {
                // Seifenblase aus dem Array entfernen und zerstören
                this.seifenblasen = this.seifenblasen.filter(bubble => bubble !== seifenblase);
                seifenblase.destroy();
            });
        });

        // Seifenblase zum Array hinzufügen
        this.seifenblasen.push(seifenblase);

        // Erhöhe den Zähler der erzeugten Seifenblasen
        this.numCreatedBubbles++;
    }

    // Zurück zur Hauptszene wechseln
    returnToMainScene() {
        this.scene.stop('Showergame', {
            backgroundX: background.x,
            homeDragonX: this.homeDragonX,
            homeDragonY: this.homeDragonY
        });
    }

    // Aufräumen bei Beendigung der Szene
    shutdown() {
        // Timer für Seifenblasen entfernen
        if (this.seifenblaseTimer) {
            this.seifenblaseTimer.remove(false);
        }
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
    // Funktion zum Anzeigen des Tutorials
    showTutorial() {
        // Manuell festgelegte Größe für den Hintergrundkasten
        const boxWidth = 600;
        const boxHeight = 150;
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
            'Steuerung:\n\nKlicke auf die Seifenblasen\num sie zum platzen zu bringen.',
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