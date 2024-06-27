export default class Memorygame extends Phaser.Scene {
    constructor() {
        super({ key: 'Memorygame' });

        // Variablen als Instanzvariablen der Klasse deklarieren
        this.cards = null;
        this.firstCard = null;
        this.secondCard = null;
        this.flippedCards = 0;
        this.lives = 10;
        this.livesText = null;
        this.totalFlippedCards = 0;
        this.anzahlPaare = 0;
    }

    preload() {
        this.load.svg('memoryBackground', 'Komponenten/memoryBackground.svg');
        this.load.svg('cardBack', 'Komponenten/cards/cardBack.svg');
        this.load.svg('card1', 'Komponenten/cards/cardBonbon.svg');
        this.load.svg('card2', 'Komponenten/cards/cardBurger.svg');
        this.load.svg('card3', 'Komponenten/cards/cardCokkie.svg');
        this.load.svg('card4', 'Komponenten/cards/cardCola.svg');
        this.load.svg('card5', 'Komponenten/cards/cardDounut.svg');
        this.load.svg('card6', 'Komponenten/cards/cardEis.svg');
        this.load.svg('card7', 'Komponenten/cards/cardFleisch.svg');
        this.load.svg('card8', 'Komponenten/cards/cardHotdog.svg');
        this.load.svg('card9', 'Komponenten/cards/cardKuchen.svg');
        this.load.svg('card10', 'Komponenten/cards/cardMuffin.svg');
        this.load.svg('card11', 'Komponenten/cards/cardPizza.svg');
        this.load.svg('card12', 'Komponenten/cards/cardPommes.svg');
    }

    create() {
        this.add.image(0, 0, 'memoryBackground').setScale(50, 50).setOrigin(0);

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Schwierigkeitsauswahl
        this.add.text(centerX, centerY - 100, 'Schwierigkeitsgrad:', { fontSize: '32px', fontFamily: 'Arial', fill: '#fff' }).setOrigin(0.5);
        const easyButton = this.add.text(centerX, centerY, 'Leicht', { fontSize: '32px', fontFamily: 'Arial', fill: '#0f0' }).setOrigin(0.5).setInteractive();
        const mediumButton = this.add.text(centerX, centerY + 100, 'Mittel', { fontSize: '32px', fontFamily: 'Arial', fill: '#ff0' }).setOrigin(0.5).setInteractive();
        const hardButton = this.add.text(centerX, centerY + 200, 'Schwer', { fontSize: '32px', fontFamily: 'Arial', fill: '#f00' }).setOrigin(0.5).setInteractive();

        easyButton.on('pointerup', () => this.startGame(3, 5));
        mediumButton.on('pointerup', () => this.startGame(6, 10));
        hardButton.on('pointerup', () => this.startGame(12, 20));
    }

    startGame(anzahlPaare, lives) {
        this.add.image(0, 0, 'memoryBackground').setScale(50, 50).setOrigin(0);

        this.lives = lives;
        this.anzahlPaare = anzahlPaare;
        this.totalFlippedCards = 0;

        // Lösche die Schwierigkeitsauswahl
        this.children.removeAll();

        // Berechne die Positionen der Karten dynamisch
        const cols = 6;
        const rows = Math.ceil((anzahlPaare * 2) / cols);
        const cardWidth = 200;
        const cardHeight = 160;
        const offsetX = (this.scale.width - (cols * cardWidth)) / 2;
        const offsetY = (this.scale.height - (rows * cardHeight)) / 2;

        const positions = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (positions.length < anzahlPaare * 2) {
                    positions.push({
                        x: offsetX + col * cardWidth + cardWidth / 2,
                        y: offsetY + row * cardHeight + cardHeight / 2
                    });
                }
            }
        }

        // Kartenbilder (jedes Bild zweimal für ein Paar)
        const cardImages = [];
        for (let i = 1; i <= anzahlPaare; i++) {
            cardImages.push('card' + i, 'card' + i);
        }
        Phaser.Utils.Array.Shuffle(cardImages);

        this.cards = this.physics.add.staticGroup();

        for (let i = 0; i < positions.length; i++) {
            const card = this.cards.create(positions[i].x, positions[i].y, 'cardBack');
            card.cardId = cardImages[i];
            card.setInteractive();
            card.setDisplaySize(cardWidth, cardHeight); // Passe die Größe der Karten an
            card.on('pointerup', () => {
                this.flipCard(card);
            });
        }

        // Anzeige für die Leben
        this.livesText = this.add.text(10, 10, `Lives: ${this.lives}`, { fontSize: '32px', fill: '#fff' });
    }

    flipCard(card) {
        if (this.flippedCards < 2 && card.texture.key === 'cardBack') {
            card.setTexture(card.cardId);
            this.flippedCards++;
            if (this.flippedCards === 1) {
                this.firstCard = card;
            } else {
                this.secondCard = card;
                this.checkMatch();
            }
        }
    }

    checkMatch() {
        if (this.firstCard.cardId === this.secondCard.cardId) {
            // Karten bleiben aufgedeckt
            this.totalFlippedCards ++; // Erhöhe die Gesamtzahl der umgedrehten Karten um 2
            this.flippedCards = 0;
            this.firstCard = null;
            this.secondCard = null;

            console.log(this.totalFlippedCards);
            console.log(this.totalFlippedCards === this.anzahlPaare);

            // Überprüfen, ob alle Karten aufgedeckt wurden
            if (this.totalFlippedCards === this.anzahlPaare) {
                this.memoryVictory();
            }
        } else {
            console.log(this.totalFlippedCards);

            // Karten nach kurzer Zeit wieder umdrehen und Leben verringern
            this.time.delayedCall(1000, () => {
                this.firstCard.setTexture('cardBack');
                this.secondCard.setTexture('cardBack');
                this.flippedCards = 0;
                this.firstCard = null;
                this.secondCard = null;

                // Leben verringern
                this.lives--;
                this.livesText.setText('Lives: ' + this.lives);

                // Überprüfen, ob das Spiel vorbei ist
                if (this.lives <= 0) {
                    this.memoryGameOver();
                }
            }, [], this);
        }
    }

    memoryGameOver() {
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Game Over', { fontSize: '64px', fontFamily: 'Arial', fontWeight: 'bold', fill: '#ffffff' }).setOrigin(0.5);
        this.cards.getChildren().forEach(card => {
            card.disableInteractive();
        });
        this.time.delayedCall(3000, () => {
            this.lives = 10;
            this.totalFlippedCards = 0;
            this.scene.start('MainScene');
        });
    }

    memoryVictory() {
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Victory', { fontSize: '64px', fontFamily: 'Arial', fontWeight: 'bold', fill: '#ffffff' }).setOrigin(0.5);
        this.cards.getChildren().forEach(card => {
            card.disableInteractive();
        });
        this.time.delayedCall(3000, () => {
            this.lives = 10;
            this.totalFlippedCards = 0;
            this.scene.start('MainScene');
        });
    }
}
