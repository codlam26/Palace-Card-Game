import { Socket } from "socket.io-client";

export interface GameBoardProps {
  socket: Socket;
  room: string;
  playerId: string;
  gameState: any;
  setGameState: React.Dispatch<React.SetStateAction<any>>;
}

export type CardType = { id: string; suit: string; value: string };
