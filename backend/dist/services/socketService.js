"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitNewOrder = exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io = null;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
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
exports.initSocket = initSocket;
const getIO = () => io;
exports.getIO = getIO;
const emitNewOrder = (order) => {
    if (io) {
        console.log(`📢 Broadcasting new order event for Order #${order.orderNumber}`);
        io.emit("newOrder", order);
    }
    else {
        console.log("⚠️ Socket.io is not initialized. Cannot broadcast new order.");
    }
};
exports.emitNewOrder = emitNewOrder;
