export default class Flyinggame extends Phaser.Scene {
    constructor() {
        super({key: 'Flyinggame'});

        // Variablen als Instanzvariablen der Klasse deklarieren
        this.score = 0;
        this.scoreText = null;
        this.dragonFrames = [];
        this.frameIndex = 0;
        this.hoopSpeed = 100;
        this.gameover = false;
        this.player = null;
        this.hoops = null;
    }

    preload() {
        this.load.svg('drache_oben', 'Komponenten/Drache_rechts_oben.svg');
        this.load.svg('drache_mitte2', 'Komponenten/Drache_rechts_mitte2.svg');
        this.load.svg('drache_mitte', 'Komponenten/Drache_rechts_mitte.svg');
        this.load.svg('drache_unten', 'Komponenten/Drache_rechts_unten.svg');
        this.load.image('sky', 'Komponenten/sky.png');
        this.load.image('star', 'Komponenten/star.png');
        this.load.image('hoop_front', 'Komponenten/Reifen_vorne.svg');
        this.load.image('hoop_back', 'Komponenten/Reifen_hinten.svg');
    }

    create() {
        score = 0;

        var image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'sky');
        var scaleX = this.cameras.main.width / image.width;
        var scaleY = this.cameras.main.height / image.height;
        var scale = Math.max(scaleX, scaleY);
        image.setScale(scale).setScrollFactor(0).setDepth(0);

        this.dragonFrames = [
            this.add.image(400, 500, 'drache_unten').setVisible(false).setScale(0.75).setDepth(2),
            this.add.image(400, 500, 'drache_mitte').setVisible(false).setScale(0.75).setDepth(2),
            this.add.image(400, 500, 'drache_mitte2').setVisible(false).setScale(0.75).setDepth(2),
            this.add.image(400, 500, 'drache_oben').setVisible(false).setScale(0.75).setDepth(2),
            this.add.image(400, 500, 'drache_mitte2').setVisible(false).setScale(0.75).setDepth(2),
            this.add.image(400, 500, 'drache_mitte').setVisible(false).setScale(0.75).setDepth(2)
        ];
        this.dragon = this.dragonFrames[0];
        this.dragon.setVisible(true);
        this.player = this.physics.add.group(this.dragon);

        // Kollisionsbox des Drachen verkleinern
        this.dragon.body.setSize(this.dragon.width * 0.5, this.dragon.height * 0.5); // Kollisionsbox auf 50% der Originalgröße setzen
        this.dragon.body.setOffset(this.dragon.width * 0.25, this.dragon.height * 0.25); // Offset anpassen, falls notwendig

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

        // Generate hoops
        this.hoops = this.physics.add.group();

        this.spawnHoop();

        this.time.addEvent({
            delay: 2000, // Generationszeit in ms
            callback: this.spawnHoop,
            callbackScope: this,
            loop: true
        });

        // Checks to see if the player overlaps with any of the hoops, if he does call the passThroughHoop function
        this.physics.add.overlap(this.player, this.hoops.children, this.passThroughHoop, null, this);

        console.log(this);

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

        this.hoops.children.iterate(function (hoop) {
            if (hoop.x < 5) {
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

    spawnHoop() {
        const hoopBack = this.hoops.create(1880, Phaser.Math.Between(0, 800), 'hoop_back').setDepth(1);
        hoopBack.setVelocityX(-this.hoopSpeed);
        const hoopFront = this.hoops.create(1900, hoopBack.y, 'hoop_front').setDepth(3);
        hoopFront.setVelocityX(-this.hoopSpeed);

        const hoop = this.physics.add.group();
        hoop.rear = hoopBack;
        hoop.front = hoopFront;

        this.hoops.add(hoop);
    }

    passThroughHoop(player, hoop) {
        console.log(hoop)

        // Disable the hoop parts
        hoop.disableBody(true, true);

        // Add and update the score
        score += 1;
        scoreText.setText('Score: ' + score);
    }
}