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
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
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

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
    🚀 Server ready at: http://localhost:${PORT}
    🛡️ Mode: ${process.env.NODE_ENV || 'development'}
  `);
});
