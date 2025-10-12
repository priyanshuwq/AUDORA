import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";
import path from "path";

// helper function for cloudinary uploads with better error handling
const uploadToCloudinary = async (file) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error("Cloudinary configuration is missing");
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
      timeout: 60000, // Increase timeout to 60s for larger files
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error in uploadToCloudinary:", error);

    // If Cloudinary is not configured, use a local path as fallback
    if (error.message.includes("configuration is missing")) {
      console.log("Using local path fallback for file upload");

      // Create a unique filename
      const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const publicDir = path.join(process.cwd(), "../frontend/public");
      const uploadDir = path.join(publicDir, "uploads");

      // Ensure upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Copy file to uploads directory
      const targetPath = path.join(uploadDir, filename);
      fs.copyFileSync(file.tempFilePath, targetPath);

      // Return a path that will be accessible from the frontend
      return `/uploads/${filename}`;
    }

    throw new Error(`Error uploading to cloudinary: ${error.message}`);
  }
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }

    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null,
    });

    await song.save();

    // if song belongs to an album, update the album's songs array
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }
    res.status(201).json(song);
  } catch (error) {
    console.log("Error in createSong", error);
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);

    // if song belongs to an album, update the album's songs array
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error in deleteSong", error);
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;

    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    });

    await album.save();

    res.status(201).json(album);
  } catch (error) {
    console.log("Error in createAlbum", error);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);
    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAlbum", error);
    next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    const userEmail =
      req.auth?.sessionClaims?.email ||
      req.auth?.sessionClaims?.primary_email ||
      null;
    // Fallback via Clerk if not present in session claims
    let email = userEmail;
    if (!email && req.auth?.userId) {
      try {
        const { clerkClient } = await import("@clerk/express");
        const u = await clerkClient.users.getUser(req.auth.userId);
        email = u.primaryEmailAddress?.emailAddress || null;
      } catch {}
    }

    const adminEmails = (
      process.env.ADMIN_EMAILS ||
      process.env.ADMIN_EMAIL ||
      ""
    )
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const isAdmin = adminEmails.includes((email || "").toLowerCase());
    return res.status(200).json({ admin: isAdmin });
  } catch (err) {
    next(err);
  }
};
