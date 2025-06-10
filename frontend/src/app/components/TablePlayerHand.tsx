// components/TablePlayerHand.tsx
import React from "react";
import Card from "./Card";
import { CardType } from "@/types/gameBoardType";

interface TablePlayerHandProps {
  cardsCount: number; // How many cards (face down)
  playerName: string;
  position: "top" | "left" | "right" | "top-left" | "top-right"; // player position
}

export default function TablePlayerHand({ cardsCount, playerName,position, }: TablePlayerHandProps) {
  const dummyCards = Array(cardsCount).fill(0);

  let positionClass = "";
  switch (position) {
    case "top":
      positionClass = "top-2 left-1/2 transform -translate-x-1/2";
      break;
    case "left":
      positionClass = "left-2 top-1/2 transform -translate-y-1/2";
      break;
    case "right":
      positionClass = "right-2 top-1/2 transform -translate-y-1/2";
      break;
    case "top-left":
      positionClass = "top-2 left-10";
      break;
    case "top-right":
      positionClass = "top-2 right-10";
      break;
  }

  return (
    <div className={`absolute ${positionClass} flex flex-col items-center`}>
      <p className="text-sm font-semibold mb-1">{playerName}</p>
      <div className="flex gap-1">
        {dummyCards.map((_, i) => (
          <Card
            key={i}
            card={{ suit: "Hidden", value: "?", id: `hidden-${i}` }}
            isFaceUp={false}
            layoutId={`hidden-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
