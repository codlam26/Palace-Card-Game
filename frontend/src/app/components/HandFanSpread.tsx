// components/HandFanSpread.tsx
import React from "react";
import Card from "./Card";
import { AnimatePresence } from "framer-motion";
import { CardType } from "@/types/gameBoardType";

interface HandFanSpreadProps {
  cards: CardType[];
  selectedCards: CardType[];
  onCardClick: (card: CardType) => void;
}

export default function HandFanSpread({ cards, selectedCards, onCardClick }: HandFanSpreadProps) {
  const totalCards = cards.length;
  const spreadAngle = Math.min(110, totalCards * 10); // wider fan if more cards
  const startAngle = -spreadAngle / 2;

  return (
    <div className="relative h-[200px] w-full flex justify-center items-end mt-10">
      <AnimatePresence>
        {cards.map((card, i) => {
          const angle = startAngle + (spreadAngle / Math.max(1, totalCards - 1)) * i;
          return (
            <div
              key={card.id}
              className="absolute bottom-0 cursor-pointer transition-transform duration-200"
              style={{
                transform: `rotate(${angle}deg) translateY(-40px) translateX(${angle * 1.5}px)`,
                transformOrigin: "bottom center",
                zIndex: i,
              }}
              onClick={() => onCardClick(card)}
            >
              <Card
                card={card}
                isFaceUp
                layoutId={card.id}
                className={
                  selectedCards.find((c) => c.id === card.id)
                    ? "ring-4 ring-green-500"
                    : ""
                }
              />
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
