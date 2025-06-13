import { Card, PlayerState } from "./types";
import { createDeck } from "./CardUtils";

export class PalaceGame {
    private players: PlayerState[] = []; // All the players in the game
    private pile: Card[] = []; // The discard pile
    private deck: Card[] = []; // The deck in play
    private currentPlayerIndex: number = 0; // Current active player
    private maxPlayers = 5;
    isStarted: boolean = false // Whether or not the game started

    // Initialized objects of the PalaceGame class
    constructor(playerIds: string[]){
        this.deck = createDeck()
        this.initializePlayers(playerIds)
    }

    // Initialize all the players
    initializePlayers(playerIds: string[]){
        for (const id of playerIds){
            const hand = this.deck.splice(0,3)
            const faceUp = this.deck.splice(0,3)
            const faceDown = this.deck.splice(0,3)
            const phase = "hand"

            this.players.push({ id, hand, faceUp, faceDown, phase})
        }

        this.isStarted = true;
    }

    // When a player is addeded into a room, give the cards
    addPlayer(id: string): boolean {
        if (this.players.length >= this.maxPlayers || this.isStarted) return false;
        const hand = this.deck.splice(0, 3);
        const faceUp = this.deck.splice(0, 3);
        const faceDown = this.deck.splice(0, 3);

        this.players.push({
            id,
            hand,
            faceUp,
            faceDown,
            phase: "hand"
        });

        if (this.players.length === this.maxPlayers) {
            this.isStarted = true;
        }

        return true;
    }

    // Obtain the current player
    getCurrentPlayer(): PlayerState {
        return this.players[this.currentPlayerIndex]
    }

    getGameState(){
        return {
            players: this.players.map(p => ({
                id: p.id,
                hand: p.hand,
                faceUp: p.faceUp,
                faceDownCount: p.faceDown.length,
                phase: p.phase,
            })),
            pile: this.pile,
            deck: this.deck,
            currentPlayer: this.getCurrentPlayer().id
        }
    }

    // Obtain the card's value
    private getCardValueRank(value: string): number {
        const order = ['3','4','5','6','7','8','9','10','J','Q','K','A','2'];
        return order.indexOf(value);
  }

    // Obtain the card on the top pile
    private getTopPileCard(): Card | null {
    return this.pile.length > 0 ? this.pile[this.pile.length - 1] : null;
  }

    // Checks whether a player's move is valid, that can place a 2 or 10 or the card's value has to be greater than the top
    // card's pile
    private isValidMove(card: Card) : boolean {
        const top = this.getTopPileCard();
        if (!top) return true;
        if (card.value === '2'|| card.value === '10') return true; // special cards

        const lastCardWasTwo = this.pile.length >= 1 && this.pile[this.pile.length - 1].value == '2';
        if (lastCardWasTwo) return true

        return this.getCardValueRank(card.value) >= this.getCardValueRank(top.value);
    }

    // The action where the player plays the card
    playCards(playerId: string, cards: Card[]): boolean | { playableCard: Card } {
    const player = this.players.find(p => p.id === playerId);
    if (!player || this.getCurrentPlayer().id !== playerId) {
        return false;
    }

    let source: Card[];
    if (player.phase === 'hand') {
        source = player.hand;
    } else if (player.phase === 'faceUp') {
        source = player.faceUp;
    } else {
        source = player.faceDown;
    }

    if (cards.length === 0) return false;

    const playedValue = cards[0].value;

    // All cards must be the same value
    if (!cards.every(c => c.value === playedValue)) {
        return false;
    }

    // Check if first card is valid move
    if (!this.isValidMove(cards[0])) {
        return false;
    }

    // Check that player has ALL of the selected cards
    for (const c of cards) {
        const index = source.findIndex(cardInHand => cardInHand.value === c.value && cardInHand.suit === c.suit);
        if (index === -1) {
            return false; // player trying to play a card they don't have
        }
    }

    // Play all cards:
    for (const c of cards) {
        this.pile.push(c);
        const index = source.findIndex(cardInHand => cardInHand.value === c.value && cardInHand.suit === c.suit);
        source.splice(index, 1);
    }

    // Checks for 4 of the same value
    if (this.pile.length >= 4){
        const top4 = this.pile.slice(-4)
        const firstValue = top4[0].value
        const allSame = top4.every(c => c.value === firstValue)

        if (allSame){
            this.pile = []
            return true
        }
    }

    // Bombs the pile (this must happen AFTER pushing cards)
    if (playedValue === '10') {
        this.pile = [];
        return true;
    }

    // If a two was played the same player gets to play again
    if (playedValue === '2'){
        let foundPlayable = false;
        let playableCard: Card | null = null;

        while (player.hand.length < 3 && this.deck.length > 0) {
            const drawnCard = this.deck.pop()!;
            player.hand.push(drawnCard);

            // This time ANY valid move allowed, not just matching value:
            if (!foundPlayable && this.isValidMove(drawnCard)) {
                foundPlayable = true;
                playableCard = drawnCard;
            }
        }

        if (foundPlayable && playableCard) {
            return { playableCard }; // Frontend will handle modal
        }
        return true
    }

    // Refill hand if in hand phase
    if (player.phase === 'hand') {
        let foundPlayable = false;
        let playableCard: Card | null = null;

        while (player.hand.length < 3 && this.deck.length > 0) {
            const drawnCard = this.deck.pop()!;
            player.hand.push(drawnCard);

            if (!foundPlayable && drawnCard.value === playedValue) {
                foundPlayable = true;
                playableCard = drawnCard;
            }
        }

        if (player.hand.length === 0) {
            player.phase = 'faceUp';
        }

        if (foundPlayable && playableCard) {
            return { playableCard };
        }
    } else if (player.phase === 'faceUp' && player.faceUp.length === 0) {
        player.phase = 'faceDown';
    }

    // Next turn (unless we played a 10 → already handled above)
    this.nextTurn();
    return true;
    }

    skipOptionalCard(){
        this.nextTurn();
    }

    /* Method of a certain Player has to take the entire card pile */
    takePile(playerId: string): boolean {
        const player = this.players.find(p => p.id === playerId);
        if (!player || this.getCurrentPlayer().id !== playerId) return false;

        // Player has to take the entire Pile
        let targetHand: Card[]

        if (player.phase == 'hand'){
            targetHand = player.hand
        }
        else if (player.phase == 'faceUp'){
            targetHand = player.faceUp
        }
        else{
            targetHand = player.faceDown
        }

        targetHand.push(...this.pile);
        this.pile = []
        this.nextTurn();

        return true
    }

    // Moves to the next player
    nextTurn(){
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length
    }
}