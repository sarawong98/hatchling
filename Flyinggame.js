export default class Flyinggame extends Phaser.Scene {
    constructor() {
        super({key: 'Flyinggame'});

        // Variables as instance variables of the class
        this.score = 0;
        this.scoreText = null;
        this.dragonFrames = [];
        this.frameIndex = 0;
        this.ringSpeed = 100;
        this.gameover = false;
        this.player = null;
        this.ringsBack = null;
        this.ringsFront = null;
        this.backgroundMusic = null;
    }

    preload() {
        this.load.svg('drache_oben', 'Komponenten/Drache_rechts_oben.svg');
        this.load.svg('drache_mitte2', 'Komponenten/Drache_rechts_mitte2.svg');
        this.load.svg('drache_mitte', 'Komponenten/Drache_rechts_mitte.svg');
        this.load.svg('drache_unten', 'Komponenten/Drache_rechts_unten.svg');
        this.load.image('sky', 'Komponenten/sky.png');
        this.load.svg('ring_back', 'Komponenten/Reifen_hinten.svg');
        this.load.svg('ring_front', 'Komponenten/Reifen_vorne.svg');
        this.load.audio('gameMusic', 'audio/little-slimes-adventure.mp3');
    }

    create() {
        this.score = 0;

        // Create and play the background music
        this.backgroundMusic = this.sound.add('gameMusic', { volume: 1, loop: true });
        this.backgroundMusic.play();

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
        this.player = this.physics.add.sprite(400, 500, null).setVisible(false); // Hidden sprite to handle physics

        // Set collision box to a minimum für 3D-Effect
        this.player.body.setSize(this.dragon.width * 0.01, this.dragon.height * 0.01);

        // Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        // The score
        this.scoreText = this.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});

        // Animation of the wings
        this.time.addEvent({
            delay: 250, // switch every 250 ms
            callback: this.animateWings,
            callbackScope: this,
            loop: true
        });

        // Generate the rings
        this.ringsBack = this.physics.add.group();
        this.ringsFront = this.physics.add.group();

        this.time.addEvent({
            delay: 2500, // generation time in ms
            callback: this.spawnRing,
            callbackScope: this,
            loop: true
        });

        // Add collision detection between the player and rings
        this.physics.add.overlap(this.player, this.ringsFront, this.collectRing, null, this);
    }

    update() {
        if (this.gameover) {
            this.backgroundMusic.stop();
            this.scene.start('Gameover', {finalScore: this.score});
        }

        this.dragonFrames.forEach(frame => frame.y = this.dragon.y);

        const moveSpeed = 5;

        // Move the dragon with arrow keys
        if (this.cursors.up.isDown) {
            this.dragon.y -= moveSpeed;
            this.dragonFrames.forEach(frame => frame.y = this.dragon.y);
        } else if (this.cursors.down.isDown) {
            this.dragon.y += moveSpeed;
            this.dragonFrames.forEach(frame => frame.y = this.dragon.y);
        }

        // Sync hidden player's position with the visible dragon
        this.player.y = this.dragon.y;

        // Check if any ring goes off screen
        this.ringsFront.children.iterate((ring) => {
            if (ring.x < 5) {
                this.gameover = true;
            }
        });
    }

    animateWings() {
        this.dragonFrames[this.frameIndex].setVisible(false);
        this.frameIndex = (this.frameIndex + 1) % this.dragonFrames.length;
        this.dragon = this.dragonFrames[this.frameIndex];
        this.dragon.setVisible(true);
    }

    spawnRing() {
        const y = Phaser.Math.Between(50, this.cameras.main.height - 50);
        const ringBack = this.ringsBack.create(this.cameras.main.width - 40, y, 'ring_back').setDepth(0);
        ringBack.setVelocityX(-this.ringSpeed);
        const ringFront = this.ringsFront.create(this.cameras.main.width - 20, y, 'ring_front').setDepth(1);
        ringFront.setVelocityX(-this.ringSpeed);
    }

    collectRing(player, ringFront) {
        ringFront.disableBody(true, true);

        // Disable the corresponding ring back
        const ringBack = this.ringsBack.getChildren().find(ring => ring.y === ringFront.y);
        if (ringBack) {
            ringBack.disableBody(true, true);
        }

        // Score update
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
    }
}
