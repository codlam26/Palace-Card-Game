import Card from "./Card";
import { deckProps} from "@/app/games/palace/types/PalaceTypes";

export default function DeckSection( { deck }: deckProps ) {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold mb-1">Deck</p>
        {deck.length === 0 ? (
          <>
            <div className="w-24 h-36 bg-gray-300 flex items-center justify-center rounded-lg text-sm text-gray-500 border">
              Empty
            </div>
            <p className="text-xs text-gray-400">({deck.length} cards)</p>
          </>
        ):(
          <>
            <Card
            card={{ suit: "Hidden", value: "?", id: "deck" }}
            isFaceUp={false}
            layoutId="deck"
            />
            <p className="text-xs text-gray-400">({deck.length} cards)</p>
          </>
        )}
    </div>
  );
}
