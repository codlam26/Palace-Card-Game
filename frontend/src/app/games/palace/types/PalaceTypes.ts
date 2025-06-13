import { Socket } from "socket.io-client";

export interface GameBoardProps {
  socket: Socket;
  room: string;
  playerId: string;
  gameState: any;
  setGameState: React.Dispatch<React.SetStateAction<any>>;
}

export type CardType = { id: string; suit: string; value: string };

export interface PlayerState {
  id: string;
  hand: CardType[];
  faceUp: CardType[];
  faceDownCount: number;
  phase: string;
}

export interface deckProps {
  deck: CardType[];
}
