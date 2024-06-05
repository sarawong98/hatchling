const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.svg('drache_oben', 'Drache_rechts_oben.svg');
    this.load.svg('drache_mitte2', 'Drache_rechts_mitte2.svg');
    this.load.svg('drache_mitte', 'Drache_rechts_mitte.svg');
    this.load.svg('drache_unten', 'Drache_rechts_unten.svg');
}

let dragon;
let dragonFrames;
let frameIndex = 0;
let frameDelay = 0;
let targetX = 400; // Startposition des Drachen auf der X-Achse
let scene;

function create() {
    scene = this;
    dragonFrames = [
        this.add.image(400, 300, 'drache_unten').setVisible(false),
        this.add.image(400, 300, 'drache_mitte').setVisible(false),
        this.add.image(400, 300, 'drache_mitte2').setVisible(false),
        this.add.image(400, 300, 'drache_oben').setVisible(false)
    ];
    dragon = dragonFrames[0];
    dragon.setVisible(true);

    this.input.on('pointerdown', function (pointer) {
        targetX = pointer.x; // Setzt die Zielposition auf der X-Achse auf die X-Koordinate des Mausklicks
        // Spiegeln des Drachen basierend auf der Klickposition
        if (targetX < dragon.x) {
            dragonFrames.forEach(frame => frame.setScale(-1, 1));
        } else {
            dragonFrames.forEach(frame => frame.setScale(1, 1));
        }
        moveToTarget();
    });

    // Animation der Flügel
    this.time.addEvent({
        delay: 250, // alle 250 ms wechseln
        callback: animateWings,
        callbackScope: this,
        loop: true
    });
}

function animateWings() {
    dragonFrames[frameIndex].setVisible(false);
    frameIndex = (frameIndex + 1) % dragonFrames.length;
    dragon = dragonFrames[frameIndex];
    dragon.setVisible(true);
}

function moveToTarget() {
    scene.tweens.add({
        targets: dragonFrames,
        x: targetX,
        duration: 1000, // Dauer der Bewegung (in ms)
        ease: 'Power2',
        onUpdate: function(tween, target) {
            dragonFrames.forEach(frame => frame.x = target.x);
        }
    });
}

function update() {
    frameDelay++;
    const bobSpeed = 0.1;
    dragon.y = 300 + Math.sin(frameDelay * bobSpeed) * 10;
    dragonFrames.forEach(frame => frame.y = dragon.y);
}