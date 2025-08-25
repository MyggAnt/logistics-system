import { io, Socket } from "socket.io-client";

let socket: Socket;

export const initializeSocket = () => {
  if (!socket && typeof window !== "undefined") {
    socket = io("http://localhost:3001", {
      reconnection: true,
      transports: ["websocket"]
    });
  }
  return socket;
};