import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { PalaceGame } from "./game/PalaceGame";
import { RoomInfo } from "./game/types";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const gameRooms: Record<string, RoomInfo> = {};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // CREATE ROOM
  socket.on("create_room", (room) => {
    socket.join(room);

    gameRooms[room] = {
      game: undefined,
      leader: socket.id,
      players: [socket.id],
      isStarted: false,
    };

    io.to(room).emit("room_update", {
      leader: socket.id,
      players: gameRooms[room].players,
      isStarted: false,
    });

    console.log(`Room ${room} created by player ${socket.id}`);

  });

  // JOIN ROOM
  socket.on("join_room", (room) => {
    if (!gameRooms[room] || gameRooms[room].isStarted) return;
    socket.join(room);
    gameRooms[room].players.push(socket.id);

    io.to(room).emit("room_update", {
      leader: gameRooms[room].leader,
      players: gameRooms[room].players,
      isStarted: gameRooms[room].isStarted,
    });

    console.log(`User ${socket.id} joined room ${room}`);
  });

  // START GAME
  socket.on("start_game", (room) => {
    const roomInfo = gameRooms[room];
    if (!roomInfo) return;

    console.log(`[DEBUG] Starting game in room ${room}. Players:`, roomInfo.players);

    if (roomInfo.isStarted) return;
    if (socket.id !== roomInfo.leader) return;
    if (roomInfo.players.length < 2) return;

    // Start the game
    const playerIds = roomInfo.players;
    roomInfo.game = new PalaceGame(playerIds);
    roomInfo.isStarted = true;

    io.to(room).emit("update_state", roomInfo.game.getGameState());
    
    io.to(room).emit("room_update", {
      leader: roomInfo.leader,
      players: roomInfo.players,
      isStarted: true,
    });
    console.log(`[DEBUG] Game started in room ${room}`);
  });

  // PLAY CARD
  socket.on("play_cards", ({ room, player, cards }) => {
    const roomInfo = gameRooms[room];
    if (!roomInfo?.game) return;

    const moveResult = roomInfo.game.playCards(player, cards);
    if(typeof moveResult === "boolean"){
        if (moveResult === true) {
          const state = roomInfo.game.getGameState();
          io.to(room).emit("update_state", state);

          // If pile was burned
          if (state.pile.length === 0) {
            io.to(room).emit("pile_burned", { message: "Pile was burned!" });
          }

          // Check for winner
          const winner = state.players.find((p) => p.hand.length === 0 && p.faceUp.length === 0 && p.faceDownCount === 0);
          if (winner) {
            io.to(room).emit("game_over", { winner: winner.id });
          }
      } 
     }
    else if ("playableCard" in moveResult) {
      io.to(player).emit("play_optional_card", {card: moveResult.playableCard})
    }
    else {
      io.to(player).emit("invalid_move", { reason: "Invalid move!" });
    }
});

  // SKIP OPTIONAL CARD
  socket.on("skip_optional_card", ({ room }) => {
    const roomInfo = gameRooms[room];
    if (!roomInfo?.game) return;

    roomInfo.game.skipOptionalCard();
    const state = roomInfo.game.getGameState();
    io.to(room).emit("update_state", state)
  })

  // TAKE PILE
  socket.on("take_pile", ({ room, player }) => {
    const roomInfo = gameRooms[room];
    if (!roomInfo?.game) return;

    const success = roomInfo.game.takePile(player);

    if (success) {
      const state = roomInfo.game.getGameState();
      io.to(room).emit("update_state", state);
    }
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);

    for (const room of Object.keys(gameRooms)) {
      const roomInfo = gameRooms[room];
      const index = roomInfo.players.indexOf(socket.id);

      if (index !== -1) {
        roomInfo.players.splice(index, 1);

        // Promote leader if needed
        if (roomInfo.leader === socket.id && roomInfo.players.length > 0) {
          roomInfo.leader = roomInfo.players[0];
        }

        // Delete room if empty
        if (roomInfo.players.length === 0) {
          delete gameRooms[room];
          console.log(`Room ${room} deleted`);
        } 

        else {
          // Update room state
          io.to(room).emit("room_update", {
            leader: roomInfo.leader,
            players: roomInfo.players,
            isStarted: roomInfo.isStarted,
          });
        }
      }
    }
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));