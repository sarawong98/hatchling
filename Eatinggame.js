export default class Eatinggame extends Phaser.Scene {
    constructor() {
        super({key: 'Eatinggame'});

        this.keule = null;
        this.napf = null;
        this.round = 1;
        this.totalrounds = 5;
        this.treffer = 0;
        this.backgroundMusic = null;
    }

    preload() {
        this.load.svg('memoryBackground', 'Komponenten/memoryBackground.svg');
        this.load.image('eatHintergrundOfenNapf', 'Komponenten/eating/eatHintergrundOfenNapf.png');
        this.load.image('roheKeule', 'Komponenten/eating/roheKeule.png');
        this.load.image('brauneKeule', 'Komponenten/eating/brauneKeule.png');
        this.load.image('verbrannteKeule', 'Komponenten/eating/verbrannteKeule.png');
        for (let i = 0; i <= 5; i++) {
            this.load.image('napf' + i, 'Komponenten/eating/napf' + i + '.png');
        }
        this.load.image('sliderBar', 'Komponenten/eating/sliderBar.png');
        this.load.audio('gameMusic', 'audio/little-slimes-adventure.mp3');
    }

    create() {
        this.backgroundMusic = this.sound.add('gameMusic', {volume: 1, loop: true});
        this.backgroundMusic.play();

        this.add.image(0, 0, 'memoryBackground').setScale(50, 50).setOrigin(0);
        const hintergrund = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'eatHintergrundOfenNapf');
        hintergrund.setScale(0.4, 0.4);
        hintergrund.setOrigin(0.5, 0.5);
        this.keule = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'roheKeule');
        this.keule.setScale(0.4, 0.4);
        this.keule.setOrigin(0.5, 0.5);
        this.napf = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'napf0');
        this.napf.setScale(0.4, 0.4);
        this.napf.setOrigin(0.5, 0.5);

        // Variablen für das Spiel
        this.sliderBar = this.add.image(400, 300, 'sliderBar').setScale(0.5, 0.4);
        this.target = this.add.rectangle(400, 300, 150, 30, 0xffff00).setVisible(false);
        this.slider = this.add.rectangle(400, 300, 100, 20, 0xff0000);

        this.direction = 1;
        this.speed = 200;

        // Text zur Anzeige der Runden
        this.roundText = this.add.text(10, 30, 'Runde ' + this.round + ' von ' + this.totalrounds, { fontSize: '32px', fontWeight: 'bold', fill: '#ffffff' });

        // Event Listener für die Leertaste
        this.input.keyboard.on('keydown-SPACE', this.handleSpacePress, this);
    }

    update(time, delta) {
        if (!this.slider.visible) return;

        // Slider Bewegung
        this.slider.x += this.direction * this.speed * (delta / 1000);

        // Wechsel der Richtung, wenn der Slider die Ränder erreicht
        if (this.slider.x >= 640 || this.slider.x <= 160) {
            this.direction *= -1;
        }
    }

    handleSpacePress() {

        if (!this.slider.visible) return;

        // Überprüfen, ob der Slider in der Mitte des Ziels ist
        if (Math.abs(this.slider.x - this.target.x) <= 50) {
            this.treffer++;
            this.keule.setTexture('brauneKeule');
            this.napf.setTexture('napf' + this.treffer);
        } else {
            this.keule.setTexture('verbrannteKeule');
        }

        // Slider unsichtbar und inaktiv machen
        this.sliderBar.setVisible(false);
        this.slider.setVisible(false);
        this.slider.active = false;

        // Prüfen, ob die Runden vorbei sind
        if (this.round === this.totalrounds) {
            this.keule.setVisible(false);
            if (this.treffer < 3) {
                this.add.text(this.cameras.main.width / 2, 300, 'Der Drache ist nicht satt geworden :(', {
                    fontSize: '32px',
                    fill: '#ffffff'
                }).setOrigin(0.5);
            } else {
                this.add.text(this.cameras.main.width / 2, 300, 'Der Drache ist satt geworden :)', {
                    fontSize: '32px',
                    fill: '#ffffff'
                }).setOrigin(0.5);
            }
            this.round = 1;
            this.treffer = 0;
            this.time.delayedCall(2000, () => {
                backgroundAtEdge = false;
                this.backgroundMusic.stop();
                this.scene.start('MainScene');
            });
        } else {
            // Nächste Runde vorbereiten
            this.round++;
            this.time.delayedCall(1500, () => {
                this.roundText.setText('Runde ' + this.round + ' von ' + this.totalrounds);
                this.keule.setTexture('roheKeule');
                this.slider.setPosition(400, 300); // Slider wieder in die Mitte setzen
                this.sliderBar.setVisible(true);
                this.slider.setVisible(true);
                this.slider.active = true;
            });
        }
    }
}