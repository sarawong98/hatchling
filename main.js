var Home = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, {key: 'Home'});
    },
    init: function () {
    },
    preload: function () {
        this.load.svg('background', 'assets/raum_middle.svg');
        this.load.svg('drache_oben', 'assets/Drache_rechts_oben.svg');
        this.load.svg('drache_mitte2', 'assets/Drache_rechts_mitte2.svg');
        this.load.svg('drache_mitte', 'assets/Drache_rechts_mitte.svg');
        this.load.svg('drache_unten', 'assets/Drache_rechts_unten.svg');
    },
    create: function () {
        scene = this;

        background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background').setScale(0.9)

        dragonFrames = [
            this.add.image(this.cameras.main.width / 2, 600, 'drache_unten').setVisible(false),
            this.add.image(this.cameras.main.width / 2, 600, 'drache_mitte').setVisible(false),
            this.add.image(this.cameras.main.width / 2, 600, 'drache_mitte2').setVisible(false),
            this.add.image(this.cameras.main.width / 2, 600, 'drache_oben').setVisible(false)
        ];
        dragon = dragonFrames[0];
        dragon.setVisible(true);

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();

        // Animation der Flügel
        this.time.addEvent({
            delay: 250, // alle 250 ms wechseln
            callback: animateWings,
            callbackScope: this,
            loop: true
        });

    },
    update: function () {
        if (gameover) {
            gameover = false;
        }

        frameDelay++;
        const bobSpeed = 0.1;
        dragon.y = 500 + Math.sin(frameDelay * bobSpeed) * 10;
        dragonFrames.forEach(frame => frame.y = dragon.y);

        const moveSpeed = 5;

        // Bewegen des Drachen mit Pfeiltasten
        if (cursors.left.isDown) {
            dragon.x -= moveSpeed;
            dragonFrames.forEach(frame => frame.x = dragon.x);
            dragonFrames.forEach(frame => frame.setScale(-1, 1));
        } else if (cursors.right.isDown) {
            dragon.x += moveSpeed;
            dragonFrames.forEach(frame => frame.x = dragon.x);
            dragonFrames.forEach(frame => frame.setScale(1, 1));
        }

        // Wechseln der Szene durch Leertaste
        this.input.keyboard.on('keydown-SPACE', function () {
            this.scene.start('Minigame');
        }, this);
    }
});

var Minigame = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, {key: 'Minigame'});
    },
    init: function () {
    },
    preload: function () {
        this.load.svg('drache_oben', 'assets/Drache_rechts_oben.svg');
        this.load.svg('drache_mitte2', 'assets/Drache_rechts_mitte2.svg');
        this.load.svg('drache_mitte', 'assets/Drache_rechts_mitte.svg');
        this.load.svg('drache_unten', 'assets/Drache_rechts_unten.svg');
        this.load.image('sky', 'assets/sky.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
    },
    create: function () {
        scene = this;

        var image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'sky')
        var scaleX = this.cameras.main.width / image.width;
        var scaleY = this.cameras.main.height / image.height;
        var scale = Math.max(scaleX, scaleY)
        image.setScale(scale).setScrollFactor(0)

        dragonFrames = [
            this.add.image(400, 500, 'drache_unten').setVisible(false),
            this.add.image(400, 500, 'drache_mitte').setVisible(false),
            this.add.image(400, 500, 'drache_mitte2').setVisible(false),
            this.add.image(400, 500, 'drache_oben').setVisible(false)
        ];
        dragon = dragonFrames[0];
        dragon.setVisible(true);
        player = this.physics.add.group(dragon);

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();

        //  The score
        scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});

        // Animation der Flügel
        this.time.addEvent({
            delay: 250, // alle 250 ms wechseln
            callback: animateWings,
            callbackScope: this,
            loop: true
        });

        // Generieren der Sterne
        stars = this.physics.add.group({
            key: 'star',
            repeat: 0,
            setXY: {x: 1900, y: 0, stepX: 0}
        });

        stars.children.iterate(function (child) {
            child.y = Phaser.Math.Between(0, 800);
            child.setVelocityX(-starSpeed);
        });

        this.time.addEvent({
            delay: 2000, // Generationszeit in ms
            callback: spawnStar,
            callbackScope: this,
            loop: true
        });

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(player, stars, collectStar, null, this);
    },
    update: function () {
        if (gameover) {
            this.scene.start('Gameover');
        }

        frameDelay++;
        dragonFrames.forEach(frame => frame.y = dragon.y);

        const moveSpeed = 5;

        // Bewegen des Drachen mit Pfeiltasten
        if (cursors.up.isDown) {
            dragon.y -= moveSpeed;
            dragonFrames.forEach(frame => frame.y = dragon.y);
        } else if (cursors.down.isDown) {
            dragon.y += moveSpeed;
            dragonFrames.forEach(frame => frame.y = dragon.y);
        }

        stars.children.iterate(function (child) {
            if (child.x < 5) {
                gameover = true;
            }
        });
    }
});

var Gameover = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, {key: 'Gameover'});
    },
    init: function () {
    },
    preload: function () {
    },
    create: function () {
        scene = this;

        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'GAMEOVER', {
            fontSize: '64px',
            fill: '#ff0000'
        });
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 1.7, 'Total: ' + score, {
            fontSize: '48px',
            fill: '#ff0000'
        });
        // Wechseln der Szene durch Leertaste
        this.input.keyboard.on('keydown-SPACE', function () {
            this.scene.start('Home');
        }, this);
    },
    update: function () {
    }
});

let dragon;
let dragonFrames;
let frameIndex = 0;
let frameDelay = 0;
let scene;

let stars;
let starSpeed = 200;
var score = 0;
var gameover = false;
var gameOverText;
var gameOverScore;

function animateWings() {
    dragonFrames[frameIndex].setVisible(false);
    frameIndex = (frameIndex + 1) % dragonFrames.length;
    dragon = dragonFrames[frameIndex];
    dragon.setVisible(true);
}

function spawnStar() {
    let star = stars.create(1900, Phaser.Math.Between(0, 800), 'star');
    star.setVelocityX(-starSpeed);
}

function collectStar(player, star) {
    star.disableBody(true, true);

    //  Add and update the score
    score += 1;
    scoreText.setText('Score: ' + score);
}

const phaserConfig = {
    type: Phaser.AUTO,
    parent: "game-container",
    width: '100%',
    height: '100%',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    pixelArt: true,
    backgroundColor: "#87CEEB",
    scene: [Home, Minigame, Gameover ]
};

const game = new Phaser.Game(phaserConfig);

