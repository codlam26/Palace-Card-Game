import { PalaceGame } from "./PalaceGame";

export type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
export type Value = | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
    suit: Suit;
    value: Value;
    id: string;
}

export interface RoomInfo {
    game?: PalaceGame;
    leader: string;
    players: string[];
    isStarted: boolean;
}
export interface PlayerState {
    id: string;
    hand: Card[];
    faceUp: Card[];
    faceDown: Card[];
    phase: 'hand' | 'faceUp' | 'faceDown';
}