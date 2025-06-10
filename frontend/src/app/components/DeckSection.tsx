import Card from "./Card";

export default function DeckSection() {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold mb-1">Deck</p>
      <div className="cursor-pointer">
        <Card
          card={{ suit: "Hidden", value: "?", id: "deck" }}
          isFaceUp={false}
          layoutId="deck"
        />
      </div>
    </div>
  );
}
