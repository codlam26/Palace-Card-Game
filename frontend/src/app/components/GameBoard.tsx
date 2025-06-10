import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { GameBoardProps, CardType } from "@/types/gameBoardType";
import { usePalaceLogic } from "../hooks/usePalaceLogic";
import Card from "./Card";
import DiscardPileSection from "./DiscardPileSection";
import DiscardPileModal from "./DiscardPileModal";
import DeckSection from "./DeckSection";
import HandFanSpread from "./HandFanSpread";
import TablePlayerHand from "./TablePlayerHand";

export default function GameBoard({socket, room, playerId, gameState, setGameState }: GameBoardProps) {
  const [showPileModal, setShowPileModal] = useState(false);

  const { selectedCards, optionalCard, mustTakePile, message,
  setMessage,
  setMustTakePile,
  setOptionalCard,
  handleSelectedCard,
  handlePlaySelected,
  handlePlayOptionalCard,
  handleSkipOptionalCard,
  handleTakePile,
} = usePalaceLogic(socket, room, playerId);

  useEffect(() => {
    socket.on("invalid_move", ({ reason }) => {
      setMessage(reason);
      setMustTakePile(true);
    });

    socket.on("update_state", (state) => {
      setGameState(state);
      setMustTakePile(false);
    });

    socket.on("pile_burned", ({ message }) => {
      setMessage(message);
      setTimeout(() => setMessage(""), 3000);
    });

    socket.on("play_optional_card", ({ card }) => {
      setOptionalCard(card);
    })

    return () => {
      socket.off("update_state");
      socket.off("invalid_move");
      socket.off("play_optional_card")
    };
  }, [socket, setGameState]);

  const player = gameState?.players?.find((p: any) => p.id === playerId);

  return (
    <div className="flex flex-col items-center p-6 gap-10">
      {message && (
        <p className="mt-4 text-red-500 font-semibold">{message}</p>
      )}

      {gameState && gameState.players && (
        <>
          <p className="text-sm text-gray-500 mb-2">
            Current Turn: {gameState.currentPlayer}
          </p>

          {/* DECK + DISCARD */}
          <div className="flex items-center gap-10">
            {/* Deck */}
            <DeckSection/>
            {/* Discard Pile */}
            <DiscardPileSection pile={gameState.pile} onOpenModal={() => setShowPileModal(true)}/>
          </div>

          {/* HAND */}
          <div className="text-center mt-6">

          {/* YOUR HAND */}
          <HandFanSpread
            cards={player?.hand || []}
            selectedCards={selectedCards}
            onCardClick={handleSelectedCard}
          />

           {optionalCard && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded shadow-lg text-center max-w-xs">
                      <p className="mb-4 text-lg">
                          You drew a playable {optionalCard.value} of {optionalCard.suit}. Play it?
                      </p>
                      <div className="flex justify-center gap-4">
                          <button
                              onClick={handlePlayOptionalCard}
                              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                          >
                              Yes
                          </button>
                          <button onClick={handleSkipOptionalCard} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          >
                              No
                          </button>
                      </div>
                  </div>
              </div>
            )}

           {selectedCards.length > 0 && !mustTakePile && (
              <button
                onClick={handlePlaySelected}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Play {selectedCards.length} Card
                {selectedCards.length > 1 ? "s" : ""}
              </button>
            )}

            {(
              <button
                onClick={handleTakePile}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Take the Pile
              </button>
            )}
          </div>

          {/* Face-down + Face-up */}
          <div className="text-center relative w-[300px] h-[200px] mt-10">
            {player?.faceDownCount > 0 && (
              <div
                className="absolute"
                style={{ left: `0px`, top: `20px`, zIndex: 1 }}
              >
                <Card
                  card={{ suit: "Hidden", value: "?", id: "faceDown" }}
                  isFaceUp={false}
                  layoutId="faceDown"
                />
                <p className="text-xs text-gray-400 text-center">
                  ({player.faceDownCount} cards)
                </p>
              </div>
            )}

            {player?.faceUp.map((card: CardType, i: number) => (
              <div
                key={card.id}
                className="absolute"
                style={{ left: `${i * 110}px`, top: `0px`, zIndex: 50 + i }}
              >
                <Card
                  card={card}
                  isFaceUp
                  layoutId={card.id}
                  onClick={() => {
                    if (gameState.currentPlayer !== playerId) return;
                    if (player.hand.length > 0 || mustTakePile) return;
                    socket.emit("play_cards", {
                      room,
                      player: playerId,
                      card,
                    });
                  }}
                />
              </div>
            ))}
          </div>

          <DiscardPileModal
            pile={gameState.pile}
            isOpen={showPileModal}
            onClose={() => setShowPileModal(false)}
          />
        </>
      )}
    </div>
  );
}