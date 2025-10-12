import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import cron from "node-cron";

import { initializeSocket } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Debug environment variables
console.log("Environment loaded:");
console.log("- PORT:", process.env.PORT);
console.log(
  "- MONGODB_URI:",
  process.env.MONGODB_URI ? "✓ Loaded" : "✗ Missing"
);
console.log("- NODE_ENV:", process.env.NODE_ENV);

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 8000;

const httpServer = createServer(app);
initializeSocket(httpServer);

// CORS
// Configure allowed origins via env var for production. Defaults include local dev hosts.
const allowedOrigins = (
  process.env.FRONTEND_ORIGINS ||
  "http://localhost:5173,http://localhost:5174,http://localhost:3000"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Apply CORS only to API routes
app.use(
  '/api',
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g. curl, server-to-server) when origin is undefined
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS origin not allowed"), false);
    },
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type", "Accept", "Origin"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// Basic security headers
app.use(helmet());

// Content Security Policy: allow Clerk's hosted JS and related endpoints
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://*.clerk.accounts.dev",
        "https://*.clerk.dev",
        "https://cdn.jsdelivr.net",
        "https://challenges.cloudflare.com",
        "blob:"
      ],
      scriptSrcElem: [
        "'self'",
        "https://*.clerk.accounts.dev",
        "https://*.clerk.dev",
        "https://cdn.jsdelivr.net",
        "https://challenges.cloudflare.com"
      ],
      workerSrc: ["'self'", "blob:"],
      frameSrc: ["https://challenges.cloudflare.com", "https://*.clerk.accounts.dev", "https://*.clerk.dev"],
      connectSrc: ["'self'", "https://*.clerk.accounts.dev", "https://*.clerk.dev"],
      imgSrc: ["'self'", 'data:', 'https:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
      fontSrc: ["'self'", 'https:', 'data:'],
    },
  })
);

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX) || 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", apiLimiter);

// Body parser
app.use(express.json());

// Apply Clerk middleware only to API routes
app.use('/api', clerkMiddleware());

// File uploads
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(process.cwd(), "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
  })
);

// cron jobs to clean up temp directory
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.log("Error cleaning temp directory:", err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {
          if (err) console.log(`Error removing temp file ${file}:`, err);
        });
      }
    });
  }
});

// Serve static files from frontend public directory
const publicPath = path.join(process.cwd(), "../frontend/public");
app.use(express.static(publicPath));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

// Production setup for serving frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "Hidden in production" : err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
  
  res.status(500).json({
    message: process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : err.message,
  });
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
