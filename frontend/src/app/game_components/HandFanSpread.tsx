// components/HandFanSpread.tsx
import React from "react";
import Card from "./Card";
import { AnimatePresence } from "framer-motion";
import { CardType } from "@/app/games/palace/types/PalaceTypes";

interface HandFanSpreadProps {
  cards: CardType[];
  selectedCards?: CardType[];
  onCardClick?: (card: CardType) => void;
  isFaceUp?: boolean;
}

export default function HandFanSpread({
  cards,
  selectedCards = [],
  onCardClick,
  isFaceUp = true,
}: HandFanSpreadProps) {
  const totalCards = cards.length;

  const cardSpacing = 40; // px
  const baseOffset = -(totalCards - 1) * cardSpacing / 2;

  return (
    <div className="relative h-[200px] w-full flex justify-center items-end">
      <AnimatePresence>
        {cards.map((card, i) => {
          const curveFactor = -3;
          const offsetX = baseOffset + i * cardSpacing;
          const centerIndex = (totalCards - 1) / 2;
          const offsetY = (Math.abs(i - centerIndex) * -curveFactor);

          return (
            <div
              key={card.id}
              className="absolute bottom-0 cursor-pointer transition-transform duration-200"
              style={{
                transform: `translate(${offsetX}px, ${offsetY}px)`,
                transformOrigin: "bottom center",
                zIndex: i,
              }}
              onClick={onCardClick ? () => onCardClick(card) : undefined}
            >
              <Card
                card={card}
                isFaceUp={isFaceUp}
                layoutId={card.id}
                className={
                  selectedCards.find((c) => c.id === card.id)
                    ? "ring-4 ring-green-500 rounded-md"
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
