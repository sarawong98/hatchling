export default class Flyinggame extends Phaser.Scene {
    constructor() {
        super({key: 'Flyinggame'});

        // Variablen als Instanzvariablen der Klasse deklarieren
        this.score = 0;
        this.scoreText = null;
        this.dragonFrames = [];
        this.frameIndex = 0;
        this.ringSpeed = 100;
        this.gameover = false;
        this.player = null;
        this.rings = null;
        this.previousRingBack = null;
    }

    preload() {
        this.load.svg('drache_oben', 'Komponenten/Drache_rechts_oben.svg');
        this.load.svg('drache_mitte2', 'Komponenten/Drache_rechts_mitte2.svg');
        this.load.svg('drache_mitte', 'Komponenten/Drache_rechts_mitte.svg');
        this.load.svg('drache_unten', 'Komponenten/Drache_rechts_unten.svg');
        this.load.image('sky', 'Komponenten/sky.png');
        this.load.svg('ring_back', 'Komponenten/Reifen_hinten.svg');
        this.load.svg('ring_front', 'Komponenten/Reifen_vorne.svg');
    }

    create() {
        this.score = 0;

        var image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'sky');
        var scaleX = this.cameras.main.width / image.width;
        var scaleY = this.cameras.main.height / image.height;
        var scale = Math.max(scaleX, scaleY);
        image.setScale(scale).setScrollFactor(0);

        this.dragonFrames = [
            this.add.image(400, 500, 'drache_unten').setVisible(false).setScale(0.75).setDepth(1),
            this.add.image(400, 500, 'drache_mitte').setVisible(false).setScale(0.75).setDepth(1),
            this.add.image(400, 500, 'drache_mitte2').setVisible(false).setScale(0.75).setDepth(1),
            this.add.image(400, 500, 'drache_oben').setVisible(false).setScale(0.75).setDepth(1),
            this.add.image(400, 500, 'drache_mitte2').setVisible(false).setScale(0.75).setDepth(1),
            this.add.image(400, 500, 'drache_mitte').setVisible(false).setScale(0.75).setDepth(1)
        ];
        this.dragon = this.dragonFrames[0];
        this.dragon.setVisible(true);
        this.player = this.physics.add.sprite(this.dragon);

        console.log('Drache: ' + JSON.stringify(this.dragon));
        console.log('Spieler: ' + this.player);

        // Kollisionsbox des Drachen verkleinern
        this.player.body.setSize(this.dragon.width * 0.5, this.dragon.height * 0.5); // Kollisionsbox auf 50% der Originalgröße setzen
        this.player.body.setOffset(this.dragon.width * 0.25, this.dragon.height * 0.25); // Offset anpassen, falls notwendig

        // Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        // The score
        this.scoreText = this.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});

        // Animation der Flügel
        this.time.addEvent({
            delay: 250, // alle 250 ms wechseln
            callback: this.animateWings,
            callbackScope: this,
            loop: true
        });

        // Generieren der Sterne
        this.rings = this.physics.add.group();

        this.time.addEvent({
            delay: 3000, // Generationszeit in ms
            callback: this.spawnRing,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (this.gameover) {
            this.scene.start('Gameover', {finalScore: this.score});
        }

        this.dragonFrames.forEach(frame => frame.y = this.dragon.y);

        const moveSpeed = 5;

        // Bewegen des Drachen mit Pfeiltasten
        if (this.cursors.up.isDown) {
            this.dragon.y -= moveSpeed;
            this.dragonFrames.forEach(frame => frame.y = this.dragon.y);
        } else if (this.cursors.down.isDown) {
            this.dragon.y += moveSpeed;
            this.dragonFrames.forEach(frame => frame.y = this.dragon.y);
        }

        this.rings.children.iterate(function (ring) {
            if (ring.texture.key === "ring_back") {
                this.previousRingBack = ring;
            }
            if (ring.texture.key === "ring_front" && this.checkOverlap(ring)) {
                console.log('overlapping');
                ring.disableBody(true, true);
                this.previousRingBack.disableBody(true, true);

                // Score aktualisieren
                this.score += 1;
                this.scoreText.setText('Score: ' + this.score);
            }
            if (ring.x < 5) {
                this.gameover = true;
            }
        }, this);
    }

    checkOverlap(ring) {
        var ringPassTolerance = 30;
        // Annahme, dass x und y immer zentral liegen
        return this.dragon.x >= (ring.x - 1) && this.dragon.x <= (ring.x + 1) && this.dragon.y >= (ring.y - ringPassTolerance) && this.dragon.y <= (ring.y + ringPassTolerance);
    }

    animateWings() {
        this.dragonFrames[this.frameIndex].setVisible(false);
        this.frameIndex = (this.frameIndex + 1) % this.dragonFrames.length;
        this.dragon = this.dragonFrames[this.frameIndex];
        this.dragon.setVisible(true);
    }

    spawnRing() {
        const y = Phaser.Math.Between(50, this.cameras.main.height - 50);
        const ringBack = this.rings.create(this.cameras.main.width - 40, y, 'ring_back').setDepth(0);
        ringBack.setVelocityX(-this.ringSpeed);
        const ringFront = this.rings.create(this.cameras.main.width - 20, y, 'ring_front').setDepth(1);
        ringFront.setVelocityX(-this.ringSpeed);
    }
}