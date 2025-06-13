import { useEffect, useState } from "react";
import { GameBoardProps, PlayerState } from "@/app/games/palace/types/PalaceTypes";
import { usePalaceLogic } from "@/app/games/palace/hooks/usePalaceLogic";
import { useTablePositions } from "@/app/games/palace/hooks/useTablePositions";
import GameMenu from "@/app/components/GameMenu";
import AvatarCircle from "@/app/components/Avatar";
import DiscardPileModal from "@/app/game_components/DiscardPileModal";
import DiscardPileSection from "@/app/game_components/DiscardPileSection";
import DeckSection from "@/app/game_components/DeckSection";
import HandFanSpread from "@/app/game_components/HandFanSpread";
import TablePlayerHand from "@/app/game_components/TablePlayerHand";
import StackedCardGroup from "@/app/game_components/StackedCardGroup";

export default function GameBoard({ socket, room, playerId, gameState, setGameState }: GameBoardProps) {
  const [showPileModal, setShowPileModal] = useState(false);

  const {
    selectedCards, optionalCard, mustTakePile, message,
    setMessage, setMustTakePile, setOptionalCard,
    handleSelectedCard, handlePlaySelected, handlePlayOptionalCard,
    handleSkipOptionalCard, handleTakePile,
  } = usePalaceLogic(socket, room, playerId);

  const otherPlayers: PlayerState[] = gameState?.players?.filter((p: PlayerState) => p.id !== playerId) || [];
  const playerPositions = useTablePositions(otherPlayers.length);
  const player = gameState?.players?.find((p: any) => p.id === playerId);

  // Socket listeners
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
    });

    return () => {
      socket.off("update_state");
      socket.off("invalid_move");
      socket.off("pile_burned");
      socket.off("play_optional_card");
    };
  }, [socket, setGameState]);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* GAME MENU */}
    <GameMenu
      room={room}
      onLeaveRoom={() => {
        window.location.href = '/'; // Example — go back to home page
      }}
    />
      {gameState && gameState.players && (
        <>
          {/* PLAYER HANDS - Circle */}
          {otherPlayers.map((p, i) => {
            const pos = playerPositions[i];
            return (
              <div
                key={p.id}
                className="absolute transition-all duration-300"
                style={{
                  top: pos.top,
                  left: pos.left,
                  transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                }}
              >
                <TablePlayerHand
                  player={p}
                  isCurrentTurn={gameState.currentPlayer === p.id}
                />
              </div>
            );
          })}

          {/* CENTER (Deck + Discard) */}
          <div className="absolute top-[50%] left-[50%] flex flex-col md:flex-row items-center gap-6 transform -translate-x-1/2 -translate-y-1/2">
            <DeckSection deck={gameState?.deck || []}/>
            <DiscardPileSection
              pile={gameState?.pile || []}
              onOpenModal={() => setShowPileModal(true)}
            />
            <p>{message}</p>
          </div>

          {/* BOTTOM PLAYER HAND */}
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-full flex flex-col items-center gap-2">
            {/* Hand + Stack */}  
              {player?.hand?.length > 0 ? (
                  // Hand and Stack side by side
                  <div className="flex justify-center items-end gap-12 w-[200px]">
                    <div className="absolute top-0 items-center">
                      <AvatarCircle playerName={player?.id || "??" }  
                                    borderColor={gameState.currentPlayer === player.id ? "ring-green-500" : "ring-gray-300" }/>
                    </div>
                    {/* Hand */}
                    <HandFanSpread
                      cards={player?.hand || []}
                      selectedCards={selectedCards}
                      onCardClick={handleSelectedCard}
                    />
                    {/* Stack */}
                    {/* <div className="ml-12">
                      <StackedCardGroup
                        faceUpCards={player?.faceUp || []}
                        faceDownCount={player?.faceDownCount || 0}
                      />
                    </div> */}
                  </div>
                ) : (
                  <div className="flex justify-center items-center w-[400px]">
                    <StackedCardGroup
                      faceUpCards={player?.faceUp || []}
                      faceDownCount={player?.faceDownCount || 0}
                      isCentered={player?.hand?.length === 0}
                      onCardClick={handleSelectedCard}
                      selectedCards={selectedCards}
                    />
                  </div>
                )}
        </div>

         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full flex flex-col items-center">
            {/* Buttons */}
            <div className="flex gap-4">
              {!mustTakePile && (
                <button onClick={handlePlaySelected} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Play {selectedCards.length} Card{selectedCards.length > 1 ? "s" : ""}
                </button>
              )}

              <button onClick={handleTakePile} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Take the Pile
              </button>
            </div>
          </div>

          {/* MODAL */}
          <DiscardPileModal
            pile={gameState.pile}
            isOpen={showPileModal}
            onClose={() => setShowPileModal(false)}
          />
        </>
      )}
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
              <button
                onClick={handleSkipOptionalCard}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}