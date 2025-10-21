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

// Validate critical environment variables
const requiredEnvVars = ['MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingEnvVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.error("❌ Critical environment variables are missing:");
  missingEnvVars.forEach(key => console.error(`   - ${key}`));
  console.error("\nPlease set these variables in your deployment environment.");
  process.exit(1);
}

// Debug environment variables
console.log("Environment loaded:");
console.log("- PORT:", process.env.PORT);
console.log(
  "- MONGODB_URI:",
  process.env.MONGODB_URI ? "✓ Loaded" : "✗ Missing"
);
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- CLERK_PUBLISHABLE_KEY:", process.env.CLERK_PUBLISHABLE_KEY ? "✓ Loaded" : "⚠ Missing (Clerk auth may fail)");
console.log("- CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY ? "✓ Loaded" : "⚠ Missing (Clerk auth may fail)");

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 8000;

// Trust proxy - required for Render.com and other reverse proxies
// This fixes the express-rate-limit X-Forwarded-For header error
app.set('trust proxy', 1);

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

// In production, also allow the deployment URL
if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
  allowedOrigins.push(process.env.RENDER_EXTERNAL_URL);
}

console.log("Allowed CORS origins:", allowedOrigins);

// Apply CORS only to API routes
app.use(
  '/api',
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g. curl, server-to-server) when origin is undefined
      if (!origin) return callback(null, true);
      
      // In production, also allow same-origin requests
      if (process.env.NODE_ENV === 'production' && !origin.includes('localhost')) {
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin)) return callback(null, true);
      
      console.warn(`⚠ CORS blocked origin: ${origin}`);
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

// Apply Clerk middleware only to API routes with error handling
app.use('/api', clerkMiddleware());

// Clerk error handler - catch authentication errors gracefully
app.use('/api', (err, req, res, next) => {
  if (err.name === 'ClerkAuthenticationError' || err.message?.includes('Clerk')) {
    console.error('Clerk authentication error:', err.message);
    return res.status(401).json({ 
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'production' ? 'Unauthorized' : err.message
    });
  }
  next(err);
});

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
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  console.log("✓ Serving static files from:", publicPath);
} else {
  console.warn("⚠ Public directory not found:", publicPath);
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  const healthCheck = {
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      mongodb: false,
      clerk: !!process.env.CLERK_SECRET_KEY,
      frontend: process.env.NODE_ENV === 'production' 
        ? fs.existsSync(path.join(__dirname, "../frontend/dist"))
        : true
    }
  };

  // Quick MongoDB connection check
  import('./lib/db.js').then(({ default: mongoose }) => {
    healthCheck.checks.mongodb = mongoose.connection.readyState === 1;
    
    const statusCode = Object.values(healthCheck.checks).every(v => v) ? 200 : 503;
    res.status(statusCode).json(healthCheck);
  }).catch(() => {
    res.status(503).json(healthCheck);
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
  const frontendDistPath = path.join(__dirname, "../frontend/dist");
  
  if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));
    console.log("✓ Serving frontend from:", frontendDistPath);
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendDistPath, "index.html"));
    });
  } else {
    console.error("❌ Frontend dist folder not found:", frontendDistPath);
    console.error("   Please run 'npm run build' from the project root.");
  }
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
