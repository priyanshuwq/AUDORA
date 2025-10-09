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

  console.log(`Seeding ${songs.length} songs (no albums will be created)...`);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const s of songs) {
    const doc = {
      title: s.title,
      artist: s.artist,
      imageUrl: s.imageUrl,
      audioUrl: s.audioUrl,
      duration: s.duration,
      // intentionally do not set albumId
    };

    try {
      // upsert by unique combination of title + artist + audioUrl
      const res = await Song.updateOne(
        { title: s.title, artist: s.artist, audioUrl: s.audioUrl },
        { $set: doc },
        { upsert: true }
      );

      if (res.upsertedId) {
        inserted++;
      } else if (res.modifiedCount && res.modifiedCount > 0) {
        updated++;
      } else {
        skipped++;
      }
    } catch (err) {
      console.error(
        `Error upserting song "${s.title}" by ${s.artist}:`,
        err.message || err
      );
    }
  }

  console.log(
    `Done. inserted: ${inserted}, updated: ${updated}, skipped: ${skipped}`
  );

  await mongoose.connection.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
