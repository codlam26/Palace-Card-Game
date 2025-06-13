// components/GameMenu.tsx
import React, { useState } from "react";

interface GameMenuProps {
  room: string;
  onLeaveRoom: () => void; // You pass this from GameBoard
}

export default function GameMenu({ room, onLeaveRoom }: GameMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  return (
    <>
      {/* TOP LEFT BUTTON */}
      <div className="absolute top-4 left-4 z-50">
        <button
          className="bg-gray-200 text-black px-3 py-2 rounded-full hover:bg-gray-300 shadow"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          ☰
        </button>

        {showMenu && (
          <div className="mt-2 bg-white border rounded shadow flex flex-col p-2 w-36">
            <button
              onClick={() => {
                alert(`Room ID: ${room}`);
                setShowMenu(false);
              }}
              className="text-left px-2 py-1 hover:bg-gray-100 rounded"
            >
              Room Info
            </button>

            <button
              onClick={() => {
                setShowLeaveConfirm(true);
                setShowMenu(false);
              }}
              className="text-left px-2 py-1 hover:bg-gray-100 rounded text-red-500"
            >
              Leave Room
            </button>
          </div>
        )}
      </div>

      {/* CONFIRM LEAVE */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow text-center max-w-sm">
            <p className="mb-4 text-lg">Are you sure you want to leave the room?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onLeaveRoom}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Leave
              </button>
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
