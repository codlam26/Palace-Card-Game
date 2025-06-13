import Card from "./Card";
import { CardType } from "@/app/games/palace/types/PalaceTypes";

interface Props {
  pile: CardType[];
  onOpenModal: () => void;
}

export default function DiscardPileSection({ pile, onOpenModal }: Props) {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold mb-1">Discard</p>
      {pile.length > 0 ? (
        <div onClick={onOpenModal} className="cursor-pointer">
          <Card
            card={pile[pile.length - 1]}
            isFaceUp
            isStatic
            layoutId={pile[pile.length - 1].id}
          />
          <p className="text-xs text-gray-400">({pile.length} cards)</p>
        </div>
      ) : (
        <>
        <div className="w-24 h-36 bg-gray-300 flex items-center justify-center rounded-lg text-sm text-gray-500 border">
          Empty
        </div>
        <p className="text-xs text-gray-400">({pile.length} cards)</p>
        </>
      )}
    </div>
  );
}
