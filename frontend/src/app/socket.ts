// socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: false, // Important!
});

export default socket;
