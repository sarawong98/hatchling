// Globale Variablen
let dragon;
let dragonFrames = [];
let frameIndex = 0;
let frameDelay = 0;
let dragonX = window.innerWidth / 2;
let dragonY = 750;
let dragonSpeed = 6;
let background;
let backgroundSpeed = 6;
let scene;
let cursors;
let backgroundAtEdge = false;
let pfeil1, pfeil2, pfeil3;
let selectedObject = null;
let stars;
let starSpeed = 200;
let score = 0;

const xDistanceThreshold = 200; // Distanzschwelle für die Auswahl der Pfeile nach x-Koordinate











// Hauptszene
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.svg('raum', 'Komponenten/raum.svg');
        this.load.svg('pfeil', 'Komponenten/pfeil.svg');
        this.load.svg('drache_oben', 'Komponenten/Drache_rechts_oben.svg');
        this.load.svg('drache_mitte2', 'Komponenten/Drache_rechts_mitte2.svg');
        this.load.svg('drache_mitte', 'Komponenten/Drache_rechts_mitte.svg');
        this.load.svg('drache_unten', 'Komponenten/Drache_rechts_unten.svg');
    }

    create() {
        scene = this;

        // Hintergrund und Pfeile
        background = this.add.image(0, 0, 'raum').setOrigin(0);
        pfeil1 = this.add.image(250, 450, 'pfeil').setOrigin(0).setScale(0.4, 0.4).setVisible(false);
        pfeil2 = this.add.image(1250, 450, 'pfeil').setOrigin(0).setScale(0.4, 0.4).setVisible(false);
        pfeil3 = this.add.image(3220, 350, 'pfeil').setOrigin(0).setScale(0.4, 0.4).setVisible(false);

        // Drachenanimationen
        dragonFrames = [
            this.add.image(dragonX, dragonY, 'drache_oben').setVisible(false),
            this.add.image(dragonX, dragonY, 'drache_mitte2').setVisible(false),
            this.add.image(dragonX, dragonY, 'drache_mitte').setVisible(false),
            this.add.image(dragonX, dragonY, 'drache_unten').setVisible(false),
            this.add.image(dragonX, dragonY, 'drache_mitte').setVisible(false),
            this.add.image(dragonX, dragonY, 'drache_mitte2').setVisible(false)
        ];
        dragon = dragonFrames[0];
        dragon.setVisible(true);

        cursors = this.input.keyboard.createCursorKeys();

        // Flügelanimation alle 250 ms
        this.time.addEvent({
            delay: 250,
            callback: this.animateWings,
            callbackScope: this,
            loop: true
        });

        // Starten der Minispiele durch Leertaste
        this.input.keyboard.on('keydown-SPACE', () => {
            if (selectedObject === 'pfeil1') {
                this.scene.start('Minigame1', { backgroundX: background.x });
            } else if (selectedObject === 'pfeil2') {
                this.scene.start('Minigame2', { backgroundX: background.x, pfeilX: pfeil2.x });
            } else if (selectedObject === 'pfeil3') {
                this.scene.start('Minigame3');
            }
        });
    }

    update() {
        // Update der Drachen- und Pfeilpositionen sowie Überprüfung der Nähe der Pfeile
        updateDragonPosition();
        updatePfeilPositions();
        checkPfeilProximity();
        handleInput();
    }

    // Flügelanimation des Drachen
    animateWings() {
        dragonFrames[frameIndex].setVisible(false);
        frameIndex = (frameIndex + 1) % dragonFrames.length;
        dragon = dragonFrames[frameIndex];
        dragon.setVisible(true);
    }
}















// Minispiel 1
class Minigame1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Minigame1' });
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














//Minispiel2    
class Minigame2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Minigame2' });
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
    }

    create() {
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
                    // Wechsel zurück zur Hauptszene nach der Transition
                    this.scene.start('MainScene');
                }
            });
            this.isNight = false;
        }
    }
}












//Minigame3
class Minigame3 extends Phaser.Scene {
    constructor() {
        super({ key: 'Minigame3' });

        // Variablen als Instanzvariablen der Klasse deklarieren
        this.score = 0;
        this.scoreText = null;
        this.dragonFrames = [];
        this.frameIndex = 0;
        this.starSpeed = 100;
        this.gameover = false;
        this.player = null;
        this.stars = null;
    }

    preload() {
        this.load.svg('drache_oben', 'Komponenten/Drache_rechts_oben.svg');
        this.load.svg('drache_mitte2', 'Komponenten/Drache_rechts_mitte2.svg');
        this.load.svg('drache_mitte', 'Komponenten/Drache_rechts_mitte.svg');
        this.load.svg('drache_unten', 'Komponenten/Drache_rechts_unten.svg');
        this.load.image('sky', 'Komponenten/sky.png');
        this.load.image('star', 'Komponenten/star.png');
        //this.load.image('bomb', 'Komponenten/bomb.png');
    }

    create() {
        var image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'sky');
        var scaleX = this.cameras.main.width / image.width;
        var scaleY = this.cameras.main.height / image.height;
        var scale = Math.max(scaleX, scaleY);
        image.setScale(scale).setScrollFactor(0);

        this.dragonFrames = [
            this.add.image(400, 500, 'drache_unten').setVisible(false).setScale(0.75),
            this.add.image(400, 500, 'drache_mitte').setVisible(false).setScale(0.75),
            this.add.image(400, 500, 'drache_mitte2').setVisible(false).setScale(0.75),
            this.add.image(400, 500, 'drache_oben').setVisible(false).setScale(0.75),
            this.add.image(400, 500, 'drache_mitte2').setVisible(false).setScale(0.75),
            this.add.image(400, 500, 'drache_mitte').setVisible(false).setScale(0.75)
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
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

        // Animation der Flügel
        this.time.addEvent({
            delay: 250, // alle 250 ms wechseln
            callback: this.animateWings,
            callbackScope: this,
            loop: true
        });

        // Generieren der Sterne
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 0,
            setXY: { x: 1900, y: 0, stepX: 0 }
        });

        this.stars.children.iterate(function (child) {
            child.y = Phaser.Math.Between(0, 800);
            child.setScale(1.5); // Sterne vergrößern
            child.setVelocityX(-this.starSpeed);
        }, this);

        this.time.addEvent({
            delay: 2000, // Generationszeit in ms
            callback: this.spawnStar,
            callbackScope: this,
            loop: true
        });

        // Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    }

    update() {
        if (this.gameover) {
            this.scene.start('Gameover', { finalScore: this.score });
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

        this.stars.children.iterate(function (child) {
            if (child.x < 5) {
                this.gameover = true;
            }
        }, this);
    }

    animateWings() {
        this.dragonFrames[this.frameIndex].setVisible(false);
        this.frameIndex = (this.frameIndex + 1) % this.dragonFrames.length;
        this.dragon = this.dragonFrames[this.frameIndex];
        this.dragon.setVisible(true);
    }

    spawnStar() {
        const star = this.stars.create(1900, Phaser.Math.Between(0, 800), 'star');
        star.setScale(1.5); // Sterne vergrößern
        star.setVelocityX(-this.starSpeed);
    }

    collectStar(dragon, star) {
        star.disableBody(true, true);

        // Score aktualisieren
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
    }
}

class Gameover extends Phaser.Scene {
    constructor() {
        super({ key: 'Gameover' });
    }

    create(data) {
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'GAMEOVER', {
            fontSize: '64px',
            fill: '#ff0000'
        }).setOrigin(0.5);
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 1.7, 'Total: ' + data.finalScore, {
            fontSize: '48px',
            fill: '#ff0000'
        }).setOrigin(0.5);
        // Wechseln der Szene durch Leertaste
        this.input.keyboard.on('keydown-SPACE', function () {
            this.scene.start('MainScene');
        }, this);
    }
}











// Update dragon's position and bobbing effect
function updateDragonPosition() {
    frameDelay++;
    const bobSpeed = 0.07;
    dragon.y = dragonY + Math.sin(frameDelay * bobSpeed) * 10;
    dragonFrames.forEach(frame => frame.y = dragon.y);
}

// Update the positions of the pfeils for bobbing effect
function updatePfeilPositions() {
    const bobSpeed = 0.07;
    pfeil1.y = 450 + Math.sin(frameDelay * bobSpeed) * 10;
    pfeil2.y = 450 + Math.sin((frameDelay + 20) * bobSpeed) * 10; // Slightly offset for variation
    pfeil3.y = 350 + Math.sin((frameDelay + 40) * bobSpeed) * 10; // Slightly offset for variation
}

// Check the proximity between the dragon and each pfeil
function checkPfeilProximity() {
    checkSinglePfeilProximity(pfeil1, 'pfeil1');
    checkSinglePfeilProximity(pfeil2, 'pfeil2');
    checkSinglePfeilProximity(pfeil3, 'pfeil3');
}

// Check the proximity between the dragon and a single pfeil
function checkSinglePfeilProximity(pfeil, pfeilName) {
    const dragonCenterX = dragonX;
    const pfeilCenterX = pfeil.x + pfeil.width * pfeil.scaleX / 2;
    const xDistanceToPfeil = Math.abs(dragonCenterX - pfeilCenterX);

    if (xDistanceToPfeil < xDistanceThreshold) {
        pfeil.setVisible(true);
        selectedObject = pfeilName;
    } else {
        pfeil.setVisible(false);
        if (selectedObject === pfeilName) {
            selectedObject = null;
        }
    }
}

// Handle user input for movement and background scrolling
function handleInput() {
    if (cursors.left.isDown) {
        moveLeft();
        dragonFrames.forEach(frame => frame.setScale(-1, 1));
    } else if (cursors.right.isDown) {
        moveRight();
        dragonFrames.forEach(frame => frame.setScale(1, 1));
    }

    if (backgroundAtEdge) {
        dragonX = Phaser.Math.Clamp(dragonX, 0, window.innerWidth);
    }

    dragonFrames.forEach(frame => frame.x = dragonX);
    background.x = Phaser.Math.Clamp(background.x, -background.width + window.innerWidth, 0);
}

// Move the dragon and background to the left
function moveLeft() {
    if (backgroundAtEdge === false) {
        if (background.x < 0) {
            background.x += backgroundSpeed;
            pfeil1.x += backgroundSpeed;
            pfeil2.x += backgroundSpeed;
            pfeil3.x += backgroundSpeed;
        } else {
            backgroundAtEdge = true;
        }
    } else {
        dragonX -= dragonSpeed;
        if (dragonX <= window.innerWidth / 2 + 5 && dragonX >= window.innerWidth / 2 - 5) {
            backgroundAtEdge = false;
        }
    }
}

// Move the dragon and background to the right
function moveRight() {
    if (backgroundAtEdge === false) {
        if (background.x > -background.width + window.innerWidth) {
            background.x -= backgroundSpeed;
            pfeil1.x -= backgroundSpeed;
            pfeil2.x -= backgroundSpeed;
            pfeil3.x -= backgroundSpeed;
        } else {
            backgroundAtEdge = true;
        }
    } else {
        dragonX += dragonSpeed;
        if (dragonX <= window.innerWidth / 2 + 5 && dragonX >= window.innerWidth / 2 - 5) {
            backgroundAtEdge = false;
        }
    }
}


const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#87CEEB',
    parent: 'game-container',
    pixelArt: true,
    scene: [MainScene, Minigame1, Minigame2, Minigame3, Gameover],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
