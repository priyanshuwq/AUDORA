import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { songs } from "./generatedSongs.js";
import { config } from "dotenv";

config();

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error(
      "MONGODB_URI is not set in the environment. Set it in a .env file or export it and rerun."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message || err);
    process.exit(1);
  }

  console.log(`Processing ${songs.length} songs from generated metadata...`);
  console.log("Will insert only new songs (no duplicates, no albums).");

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const s of songs) {
    try {
      // Check if song already exists by unique combination
      const existing = await Song.findOne({
        title: s.title,
        artist: s.artist,
        audioUrl: s.audioUrl,
      });

      if (existing) {
        skipped++;
        continue;
      }

      // Insert new song without albumId
      await Song.create({
        title: s.title,
        artist: s.artist,
        imageUrl: s.imageUrl,
        audioUrl: s.audioUrl,
        duration: s.duration,
        // intentionally do not set albumId
      });

      inserted++;

      if ((inserted + skipped) % 50 === 0) {
        console.log(
          `Progress: ${inserted + skipped}/${songs.length} (${inserted} new, ${skipped} skipped)`
        );
      }
    } catch (err) {
      errors++;
      console.error(
        `Error processing "${s.title}" by ${s.artist}:`,
        err.message || err
      );
    }
  }

  console.log("\n=== Reseeding Complete ===");
  console.log(`Total songs in metadata: ${songs.length}`);
  console.log(`New songs inserted: ${inserted}`);
  console.log(`Duplicates skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);

  const finalCount = await Song.countDocuments();
  console.log(`\nFinal song count in DB: ${finalCount}`);

  await mongoose.connection.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
