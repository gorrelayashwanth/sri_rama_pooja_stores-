"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const mediaRoutes_1 = __importDefault(require("./routes/mediaRoutes"));
const comboRoutes_1 = __importDefault(require("./routes/comboRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const settingRoutes_1 = __importDefault(require("./routes/settingRoutes"));
const contentRoutes_1 = __importDefault(require("./routes/contentRoutes"));
const couponRoutes_1 = __importDefault(require("./routes/couponRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: [
            process.env.FRONTEND_URL || "http://localhost:5173",
            "https://sri-rama-pooja-stores.vercel.app",
            "http://localhost:5173"
        ],
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        credentials: true
    }
});
app.set("io", io);
io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    socket.on("join_admin", () => {
        socket.join("admin");
        console.log(`👤 Admin joined admin room: ${socket.id}`);
    });
    socket.on("disconnect", () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
});
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "https://sri-rama-pooja-stores.vercel.app",
        "http://localhost:5173"
    ],
    credentials: true
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/v1/auth", authRoutes_1.default);
app.use("/api/v1/products", productRoutes_1.default);
app.use("/api/v1/categories", categoryRoutes_1.default);
app.use("/api/v1/media", mediaRoutes_1.default);
app.use("/api/v1/combos", comboRoutes_1.default);
app.use("/api/v1/orders", orderRoutes_1.default);
app.use("/api/v1/messages", messageRoutes_1.default);
app.use("/api/v1/settings", settingRoutes_1.default);
app.use("/api/v1/content", contentRoutes_1.default);
app.use("/api/v1/coupons", couponRoutes_1.default);
app.use("/api/v1/users", userRoutes_1.default);
app.use("/api/v1/reviews", reviewRoutes_1.default);
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Sri Rama Pooja Store API is running smoothly",
        timestamp: new Date().toISOString()
    });
});
// Error Handler
app.use(errorMiddleware_1.errorHandler);
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`
    🚀 Server ready at: http://localhost:${PORT}
    🛡️ Mode: ${process.env.NODE_ENV || 'development'}
  `);
});
