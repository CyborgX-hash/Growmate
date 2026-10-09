import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import apiRouter from "./routes/api.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env") });

const app = express();

// Enable CORS for frontend clients
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for preview/MVP deployments
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-guest-id"]
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Root health & welcome ping
app.get("/", (req, res) => {
  res.json({
    name: "GrowMate API",
    version: "1.0.0",
    theme: "Touch Grass",
    documentation: "/api/health"
  });
});

// Mount REST API
app.use("/api", apiRouter);

// 404 & centralized error handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
