import { Card, Suit, Value } from "./types";

/* 
Utility Function used to create a deck with randomized
placement of the cards
*/
export function createDeck(): Card[] {
    const suits: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values: Value[] = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

    // Deck starts off with no cards
    const deck: Card[] = [];

    // push the values and suits into the deck
    for (const suit of suits){
        for(const value of values){
            deck.push({suit, value, id: `${value}-${suit}-${Math.random().toString(36).substring(2,5)}`})
        }
    }
    
    return shuffle(deck)
}

/* 
Utility function that will shuffle the cards randomly and will 
later on by pushed into the deck
*/
export function shuffle(cards: Card[]) : Card[]{
    return [...cards].sort(() => Math.random() - 0.5)
}