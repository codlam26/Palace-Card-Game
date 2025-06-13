import React from "react";
import { CardType } from "@/app/games/palace/types/PalaceTypes";
import HandFanSpread from "./HandFanSpread";
import AvatarCircle from "../components/Avatar";

interface TablePlayerHandProps {
  player: {
    id: string;
    hand: CardType[];
    faceUp: CardType[];
    faceDownCount: number;
    phase: string;
  };
  isCurrentTurn: boolean;
}

export default function TablePlayerHand({ player, isCurrentTurn }: TablePlayerHandProps) {
  return (
    <div className={`relative flex flex-col items-center rounded`}>
      {/* Avatar */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <AvatarCircle
          playerName={player?.id || "??"}
          borderColor={isCurrentTurn ? "ring-green-500" : "ring-gray-300"}
        />
      </div>

      {/* HandFanSpread with opacity */}
      <div
        style={{
          opacity: isCurrentTurn ? 1 : 0.4,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <HandFanSpread
          cards={player.hand}
          isFaceUp={false} // for other players
        />
      </div>
    </div>
  );
}
