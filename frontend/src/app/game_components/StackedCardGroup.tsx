// components/StackedCardGroup.tsx
import { CardType } from "@/app/games/palace/types/PalaceTypes";
import Card from "./Card";

interface FaceUpFaceDownStackProps {
  faceUpCards: CardType[];
  faceDownCount: number;
  isCentered?: boolean;
  onCardClick?: (card: CardType) => void;
  selectedCards?: CardType[];
}

export default function StackedCardGroup({ faceUpCards, faceDownCount, isCentered, onCardClick, selectedCards,}: FaceUpFaceDownStackProps) {
  return (
    <div className={`relative w-[200px] h-[180px] ${isCentered? "": "opacity-50"}`}>
      {/* FaceUp row */}
      <div className="absolute top-0 left-0 flex">
        {faceUpCards.map((card, i) => (
          <div
            key={card.id}
            style={{
              position: "absolute",
              left: isCentered ? `${i * 100}px` : `${i * 60}px`,
              zIndex: 50 + i,
              transform: isCentered ? "scale(1)" : "scale(0.6)",
            }}
          >
            <Card 
            card={card} 
            isFaceUp 
            layoutId={card.id}
            onClick={() => {
                if (isCentered && onCardClick) {
                  onCardClick(card);
                }
              }}
            className={selectedCards?.find((c) => c.id === card.id) ? "ring-4 ring-green-500 rounded-md" : ""} 
            />
          </div>
        ))}
      </div>

      {/* FaceDown row */}
      <div className="absolute bottom-6 left-0 flex">
        {Array(faceDownCount).fill(0)
          .map((_, i) => (
            <div
              key={`facedown-${i}`}
              style={{
                position: "absolute",
                left: isCentered ? `${i * 100}px` : `${i * 60}px`,
                bottom: `${0}px`,
                zIndex: i,
                transform: isCentered ? "scale(1)" : "scale(0.6)",
              }}
            >
              <Card
                card={{ id: `facedown-${i}`, value: "?", suit: "Hidden" }}
                isFaceUp={false}
                layoutId={`facedown-${i}`}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
