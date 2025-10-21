import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getAllAudioFiles() {
  const repoRoot = path.resolve(__dirname, "..", "..", "..");
  const songsDir1 = path.join(repoRoot, "frontend", "public", "songs");
  const songsDir2 = path.join(repoRoot, "frontend", "public", "New songs");

  const audioExtensions = [".mp3", ".m4a", ".wav", ".flac", ".aac"];
  const allFiles = new Set();

  // Scan first directory
  try {
    const files1 = await fs.readdir(songsDir1);
    for (const f of files1) {
      const ext = path.extname(f).toLowerCase();
      if (audioExtensions.includes(ext)) {
        allFiles.add(`/songs/${f}`);
      }
    }
    console.log(`Found ${allFiles.size} audio files in /songs/`);
  } catch (err) {
    console.warn(`Could not read ${songsDir1}:`, err.message);
  }

  // Scan second directory
  try {
    const files2 = await fs.readdir(songsDir2);
    for (const f of files2) {
      const ext = path.extname(f).toLowerCase();
      if (audioExtensions.includes(ext)) {
        allFiles.add(`/New songs/${f}`);
      }
    }
    console.log(`Found ${allFiles.size} total audio files (including /New songs/)`);
  } catch (err) {
    console.warn(`Could not read ${songsDir2}:`, err.message);
  }

  return allFiles;
}

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error(
      "MONGODB_URI is not set in the environment. Set it in a .env file or export it and rerun."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message || err);
    process.exit(1);
  }

  // Get all actual audio files
  const actualFiles = await getAllAudioFiles();
  console.log(`\nTotal audio files on disk: ${actualFiles.size}`);

  // Get all songs from database
  const allSongs = await Song.find({});
  console.log(`Total songs in database: ${allSongs.length}\n`);

  // Track operations
  let removedMissing = 0;
  let removedDuplicates = 0;
  const seenUrls = new Map(); // audioUrl -> first song ID

  console.log("Scanning database songs...\n");

  for (const song of allSongs) {
    const audioUrl = song.audioUrl;

    // Check if file exists on disk
    if (!actualFiles.has(audioUrl)) {
      console.log(`❌ Removing (file missing): ${audioUrl}`);
      await Song.deleteOne({ _id: song._id });
      removedMissing++;
      continue;
    }

    // Check for duplicates (same audioUrl)
    if (seenUrls.has(audioUrl)) {
      console.log(`🔄 Removing duplicate: ${song.title} by ${song.artist} (${audioUrl})`);
      await Song.deleteOne({ _id: song._id });
      removedDuplicates++;
    } else {
      seenUrls.set(audioUrl, song._id);
    }
  }

  // Final count
  const finalCount = await Song.countDocuments();

  console.log("\n=== Cleanup Complete ===");
  console.log(`Songs removed (file missing): ${removedMissing}`);
  console.log(`Songs removed (duplicates): ${removedDuplicates}`);
  console.log(`Total removed: ${removedMissing + removedDuplicates}`);
  console.log(`Songs remaining in DB: ${finalCount}`);
  console.log(`Audio files on disk: ${actualFiles.size}`);

  if (finalCount !== actualFiles.size) {
    console.log(`\n⚠️  Warning: DB songs (${finalCount}) != disk files (${actualFiles.size})`);
    console.log("Some files may not be in the database yet.");
  } else {
    console.log("\n✅ Database is now in sync with disk files!");
  }

  await mongoose.connection.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
