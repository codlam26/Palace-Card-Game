import Card from "./Card";
import { CardType } from "@/app/games/palace/types/PalaceTypes";
import { AnimatePresence } from "framer-motion";

interface Props {
  hand: CardType[];
  selectedCards: CardType[];
  onSelectCard: (card: CardType) => void;
  canPlay: boolean;
  onPlaySelected: () => void;
}

export default function HandSection({ hand, selectedCards, onSelectCard, canPlay, onPlaySelected}: Props) {
  return (
    <div className="text-center mt-6">
      <p className="text-lg font-semibold mb-2">Your Hand</p>
      <div className="flex gap-3 flex-wrap justify-center">
        <AnimatePresence>
          {hand.map((card) => (
            <Card
              key={card.id}
              card={card}
              isFaceUp
              layoutId={card.id}
              onClick={() => onSelectCard(card)}
              className={
                selectedCards.find((c) => c.id === card.id)
                  ? "ring-4 ring-green-500"
                  : ""
              }
            />
          ))}
        </AnimatePresence>
      </div>

      {selectedCards.length > 0 && canPlay && (
        <button
          onClick={onPlaySelected}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Play {selectedCards.length} Card
          {selectedCards.length > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
