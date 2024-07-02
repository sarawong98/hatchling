// Globale Variablen
let screenWidth;
let screenHeight;
let scale

let backgroundMusic;
let dragon;
let dragonFrames = [];
let frameIndex = 0;
let frameDelay = 0;
let dragonX = window.innerWidth / 2;
let dragonY = window.innerHeight / 1.5;
let dragonSpeed = 6;
let background;
let backgroundSpeed = 6;
let scene;
let cursors;
let backgroundAtEdge = false;
let pfeil1, pfeil2, pfeil3, pfeil4, pfeil5, pfeil6;
let tisch;
let blumenvase;
let selectedObject = null;
let freigeschaltet = false;

const xDistanceThreshold = 200; // Distanzschwelle für die Auswahl der Pfeile nach x-Koordinate

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
    pfeil1.y = 450 * scale + Math.sin(frameDelay * bobSpeed) * 10;
    pfeil2.y = 450 * scale + Math.sin((frameDelay + 10) * bobSpeed) * 10; // Slightly offset for variation
    pfeil3.y = 350 * scale + Math.sin((frameDelay + 20) * bobSpeed) * 10; // Slightly offset for variation
    pfeil4.y = 550 * scale + Math.sin((frameDelay + 30) * bobSpeed) * 10; // Slightly offset for variation
    pfeil5.y = 550 * scale + Math.sin((frameDelay + 40) * bobSpeed) * 10; // Slightly offset for variation
    pfeil6.y = 550 * scale + Math.sin((frameDelay + 50) * bobSpeed) * 10; // Slightly offset for variation
}

// Check the proximity between the dragon and each pfeil
function checkPfeilProximity() {
    checkSinglePfeilProximity(pfeil1, 'pfeil1');
    checkSinglePfeilProximity(pfeil2, 'pfeil2');
    checkSinglePfeilProximity(pfeil3, 'pfeil3');
    checkSinglePfeilProximity(pfeil4, 'pfeil4');
    checkSinglePfeilProximity(pfeil5, 'pfeil5');
    checkSinglePfeilProximity(pfeil6, 'pfeil6');
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

function checkBlumenvase() {
    if (freigeschaltet) {
        blumenvase.setVisible(true);
    } else {
        blumenvase.setVisible(false);
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
            pfeil4.x += backgroundSpeed;
            pfeil5.x += backgroundSpeed;
            pfeil6.x += backgroundSpeed;
            tisch.x += backgroundSpeed;
            blumenvase.x += backgroundSpeed;
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
        console.log(background.x);
        console.log(background.width);
        console.log(window.innerWidth);
        if (background.x > -background.width  * scale + window.innerWidth) {
            background.x -= backgroundSpeed;
            pfeil1.x -= backgroundSpeed;
            pfeil2.x -= backgroundSpeed;
            pfeil3.x -= backgroundSpeed;
            pfeil4.x -= backgroundSpeed;
            pfeil5.x -= backgroundSpeed;
            pfeil6.x -= backgroundSpeed;
            tisch.x -= backgroundSpeed;
            blumenvase.x -= backgroundSpeed;
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