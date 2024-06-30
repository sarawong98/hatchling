//Minispiel2
export default class Sleepinggame extends Phaser.Scene {
    constructor() {
        super({ key: 'Sleepinggame' });
    }

    init(data) {
        this.backgroundX = data.backgroundX;
        this.pfeilX = data.pfeilX; // Pfeil x-Position speichern
    }

    preload() {
        this.load.svg('bett', 'Komponenten/bett.svg');
        this.load.svg('drache_schlafen', 'Komponenten/drache_schlafen.svg'); // Drache schläft SVG
        this.load.svg('zzz', 'Komponenten/zzz.svg'); // Zzz SVG
        this.load.svg('raum', 'Komponenten/raum.svg');
        this.load.audio('sleepingMusic', 'audio/sleeping-music.mp3');
    }

    create(data) {
        this.backgroundMusic = this.sound.add('sleepingMusic', { volume: 1, loop: true });
        this.backgroundMusic.play();

        this.add.image(this.backgroundX, 0, 'raum').setOrigin(0);
        this.add.image(this.backgroundX, 0, 'bett').setOrigin(0);

        // Drache schlafen und Zzz anzeigen
        this.add.image(this.pfeilX - 80, 580, 'drache_schlafen').setOrigin(0);
        this.add.image(this.pfeilX - 50, 480, 'zzz').setOrigin(0).setScale(0.5); // Kleinere Skalierung und gleiche x-Koordinate wie Drache


        // Interaktiver unsichtbarer Kasten als Platzhalter für den Lichtschalter
        this.lampSwitch = this.add.rectangle(this.pfeilX - 335, 480, 110, 180, 0x000000, 0).setInteractive(); // Unsichtbarer Kasten
        this.lampSwitch.on('pointerdown', this.toggleLight, this);

        // Tag-Nacht-Wechsel-Effekt
        this.nightOverlay = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x000000).setOrigin(0).setAlpha(0);
        this.isNight = false; // Flag, um den Zustand der Dunkelheit zu verfolgen

        // Münzanzeige
        if (data && data.totalCoins) {
            console.log(data.totalCoins);
            this.add.text(16, 16, 'Coins: ' + data.totalCoins, { fontSize: '32px', fontWeight: 'bold', fill: '#000' });
        }
    }

    toggleLight() {
        if (this.nightOverlay.alpha === 0) {
            // Nachtmodus aktivieren
            this.tweens.add({
                targets: this.nightOverlay,
                alpha: 0.9,
                duration: 2000,
            });
            this.isNight = true;
        } else {
            // Tagmodus aktivieren
            this.tweens.add({
                targets: this.nightOverlay,
                alpha: 0,
                duration: 2000,
                onComplete: () => {
                    this.backgroundMusic.stop();
                    this.scene.start('MainScene');
                }
            });
            this.isNight = false;
        }
    }
}