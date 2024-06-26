export default class Showergame extends Phaser.Scene {
    constructor() {
        super({ key: 'Showergame' });
    }

    init(data) {
        this.backgroundX = data.backgroundX;
    }

    preload() {
        this.load.svg('badewanne', 'Komponenten/badewanne.svg');
        this.load.svg('seifenblase', 'Komponenten/seifenblase.svg'); // Seifenblasen laden
        this.load.svg('Drache_baden', 'Komponenten/Drache_baden.svg');
        this.load.svg('raum', 'Komponenten/raum.svg');
    }

    create() {
        this.add.image(this.backgroundX, 0, 'raum').setOrigin(0);
        this.drache = this.add.image(230, 470, 'Drache_baden').setOrigin(0);
        this.badewanne = this.add.image(0, 0, 'badewanne').setOrigin(0);

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
        const x = Phaser.Math.Between(100, 500);
        const y = 550;
        const scale = Phaser.Math.FloatBetween(0.1, 0.4); // Zufällige Skalierung zwischen 0.1 und 0.5

        const seifenblase = this.add.image(x, y, 'seifenblase').setScale(scale);

        // Bewegung der Seifenblase nach oben
        const speed = 50; // Zufällige Geschwindigkeit
        this.tweens.add({
            targets: seifenblase,
            y: -50, // Zielposition (aus dem Bildschirm)
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
            // Seifenblase aus dem Array entfernen und zerstören
            this.seifenblasen = this.seifenblasen.filter(bubble => bubble !== seifenblase);
            seifenblase.destroy();
        });

        // Seifenblase zum Array hinzufügen
        this.seifenblasen.push(seifenblase);

        // Erhöhe den Zähler der erzeugten Seifenblasen
        this.numCreatedBubbles++;
    }

    // Zurück zur Hauptszene wechseln
    returnToMainScene() {
        this.scene.start('MainScene');
    }

    // Aufräumen bei Beendigung der Szene
    shutdown() {
        // Timer für Seifenblasen entfernen
        if (this.seifenblaseTimer) {
            this.seifenblaseTimer.remove(false);
        }
    }
}