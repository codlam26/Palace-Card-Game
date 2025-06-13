"use client";

import { useEffect, useState } from "react";
import GameBoard from "./games/palace/components/GameBoard";
import socket from "./socket";

export default function Home() {
  const [room, setRoom] = useState("");
  const [gameState, setGameState] = useState<any>(null);
  const [playerId, setPlayerId] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // Room state:
  const [leader, setLeader] = useState<string>("");
  const [players, setPlayers] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState(false);

  const isLeader = playerId === leader;

  useEffect(() => {
    socket.connect(); // Now we control the connect manually

    socket.on("connect", () => {
        setPlayerId(socket.id ?? "");
        console.log("Connected with ID", socket.id);
    })

    // Game state update:
    socket.on("update_state", (state) => {
      setGameState(state);
    });

    // Game over:
    socket.on("game_over", ({ winner }) => {
      setMessage(`Player ${winner} wins!`);
    });

    // Room update (leader, players[], isStarted)
    socket.on("room_update", ({ leader, players, isStarted }) => {
        console.log("ROOM UPDATE:", players);
        setLeader(leader);
        setPlayers(players);
        setIsStarted(isStarted);
    });

    return () => {
        socket.off("connect")
        socket.off("update_state");
        socket.off("game_over");
        socket.off("room_update");
    };
  }, []);

  // Create room:
  const createRoom = () => {
    if(!room) return;
    socket.emit("create_room", room);
  };

  // Join room:
  const joinRoom = () => {
    socket.emit("join_room", room);
  };

  // Start game (only leader, 2+ players):
  const startGame = () => {
    socket.emit("start_game", room);
    console.log("Starting game")
  };

  return (
    <div className="flex flex-col items-center">
    {!isStarted && (
      <>
      {/* Room input */}
      <input
        type="text"
        placeholder="Enter room name"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="border p-2 m-2"
      />

      {/* Room buttons */}
      <div className="flex gap-2 mb-4">
        <button onClick={createRoom} className="bg-blue-500 text-white p-2 rounded">
          Create Room
        </button>
        
        <button onClick={joinRoom} className="bg-green-500 text-white p-2 rounded">
          Join Room
        </button>
      </div>
      

      {/* Room status */}
      {players.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold">Room: {room}</p>
          <p>Leader: {leader}</p>
          <p>Players: {players.length} ({players.join(", ")})</p>
          <p>Game started: {isStarted ? "Yes" : "No"}</p>
        </div>
      )}
      </>)}

      {/* Start game button */}
      {isLeader && players.length >= 2 && !isStarted && (
        <button
          onClick={startGame}
          className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 mb-4"
        >
          Start Game
        </button>
      )}

      {/* Message */}
      {message && (
        <p className="mt-2 text-red-500 font-semibold mb-4">{message}</p>
      )}

      {/* Game Board */}
      {isStarted && gameState && (
        <GameBoard
          socket={socket}
          room={room}
          playerId={playerId}
          gameState={gameState}
          setGameState={setGameState}
        />
      )}
    </div>
  );
}
