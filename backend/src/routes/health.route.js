import { Router } from "express";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const router = Router();

// Basic health check
router.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Detailed health check
router.get("/details", async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    
    // Check Cloudinary connection
    let cloudinaryStatus = "unknown";
    try {
      const result = await cloudinary.api.ping();
      cloudinaryStatus = result.status === "ok" ? "connected" : "error";
    } catch (error) {
      cloudinaryStatus = "error: " + error.message;
    }
    
    res.status(200).json({
      status: "ok",
      environment: process.env.NODE_ENV || "unknown",
      database: dbStatus,
      cloudinary: cloudinaryStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
