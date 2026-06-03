import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";

let io: Server | null = null;

export const initSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://sri-rama-pooja-stores.vercel.app",
        "https://sri-rama-pooja-store.vercel.app"
      ],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Admin live monitor connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`🔌 Admin live monitor disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => io;

export const emitNewOrder = (order: any) => {
  if (io) {
    console.log(`📢 Broadcasting new order event for Order #${order.orderNumber}`);
    io.emit("newOrder", order);
  } else {
    console.log("⚠️ Socket.io is not initialized. Cannot broadcast new order.");
  }
};
