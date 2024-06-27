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
         this.add.image(this.backgroundX, 0, 'memoryBackground').setOrigin(0);
         // Kartenpositionen (6x4 Grid für 24 Karten)
         const positions = [
             { x: 100, y: 100 }, { x: 200, y: 100 }, { x: 300, y: 100 }, { x: 400, y: 100 }, { x: 500, y: 100 }, { x: 600, y: 100 },
             { x: 100, y: 200 }, { x: 200, y: 200 }, { x: 300, y: 200 }, { x: 400, y: 200 }, { x: 500, y: 200 }, { x: 600, y: 200 },
             { x: 100, y: 300 }, { x: 200, y: 300 }, { x: 300, y: 300 }, { x: 400, y: 300 }, { x: 500, y: 300 }, { x: 600, y: 300 },
             { x: 100, y: 400 }, { x: 200, y: 400 }, { x: 300, y: 400 }, { x: 400, y: 400 }, { x: 500, y: 400 }, { x: 600, y: 400 }
         ];

         // Kartenbilder (jedes Bild zweimal für ein Paar)
         const cardImages = [];
         for (let i = 1; i <= 12; i++) {
             cardImages.push('card' + i, 'card' + i);
         }
         Phaser.Utils.Array.Shuffle(cardImages);

         this.cards = this.physics.add.staticGroup();

         for (let i = 0; i < positions.length; i++) {
             const card = this.cards.create(positions[i].x, positions[i].y, 'cardBack');
             card.cardId = cardImages[i];
             card.setInteractive();
             card.on('pointerup', () => {
                 this.flipCard(card);
             });
         }

         // Anzeige für die Leben
         this.livesText = this.add.text(10, 10, 'Lives: 10', { fontSize: '32px', fill: '#fff' });
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
             this.flippedCards = 0;
             this.firstCard = null;
             this.secondCard = null;
         } else {
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
         this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5);
         this.cards.getChildren().forEach(card => {
             card.disableInteractive();
         });
     }

     returnToMainScene() {
         this.scene.start('MainScene');
     }


    update() {
        // Spielupdate-Logik, falls erforderlich
    }
}
