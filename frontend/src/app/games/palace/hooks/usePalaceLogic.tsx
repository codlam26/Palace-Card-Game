import { useState } from "react";
import { CardType } from "@/app/games/palace/types/PalaceTypes";
import { Socket } from "socket.io-client";

export function usePalaceLogic(socket: Socket, room: string, playerId: string) {
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [optionalCard, setOptionalCard] = useState<CardType | null>(null);
  const [mustTakePile, setMustTakePile] = useState(false);
  const [message, setMessage] = useState("");

  const handleSelectedCard = (card: CardType) => {
    setSelectedCards((prev) => {
      if (prev.length === 0) return [card];
      if (prev[0].value === card.value) {
        if (prev.find((c) => c.id === card.id)) {
          return prev.filter((c) => c.id !== card.id);
        } else {
          return [...prev, card];
        }
      } else {
        return [card];
      }
    });
  };

  const handlePlaySelected = () => {
    if (selectedCards.length === 0 || mustTakePile) return;

    socket.emit("play_cards", {
      room,
      player: playerId,
      cards: selectedCards,
    });

    setSelectedCards([]);
  };

  const handlePlayOptionalCard = () => {
    if (optionalCard) {
      socket.emit("play_cards", {
        room,
        player: playerId,
        cards: [optionalCard], // even optional card should be sent as array
      });
      setOptionalCard(null);
    }
  };

  const handleSkipOptionalCard = () => {
    socket.emit("skip_optional_card", { room, player: playerId });
    setOptionalCard(null);
  };

  const handleTakePile = () => {
    socket.emit("take_pile", { room, player: playerId });
  };

  return {
    selectedCards,
    setSelectedCards,
    optionalCard,
    setOptionalCard,
    mustTakePile,
    setMustTakePile,
    message,
    setMessage,
    handleSelectedCard,
    handlePlaySelected,
    handlePlayOptionalCard,
    handleSkipOptionalCard,
    handleTakePile,
  };
}
