import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorMiddleware";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import mediaRoutes from "./routes/mediaRoutes";
import comboRoutes from "./routes/comboRoutes";
import orderRoutes from "./routes/orderRoutes";
import messageRoutes from "./routes/messageRoutes";
import settingRoutes from "./routes/settingRoutes";
import contentRoutes from "./routes/contentRoutes";
import couponRoutes from "./routes/couponRoutes";
import userRoutes from "./routes/userRoutes";
import reviewRoutes from "./routes/reviewRoutes";



dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "https://sri-rama-pooja-stores.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/combos", comboRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/settings", settingRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);



app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Sri Rama Pooja Store API is running smoothly",
    timestamp: new Date().toISOString()
  });
});

import http from 'http';
import path from 'path';
import fs from 'fs';
import { initSocket } from './services/socketService';

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static uploaded files
app.use('/uploads', express.static(uploadsDir));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`
    🚀 Server ready at: http://localhost:${PORT}
    🛡️ Mode: ${process.env.NODE_ENV || 'development'}
  `);
});

