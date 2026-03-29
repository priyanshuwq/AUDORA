import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
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
    console.log("Connected to MongoDB\n");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message || err);
    process.exit(1);
  }

  const initialCount = await Song.countDocuments();
  console.log(`Initial song count: ${initialCount}\n`);

  // Find duplicates by title + artist
  const duplicates = await Song.aggregate([
    {
      $group: {
        _id: { title: "$title", artist: "$artist" },
        count: { $sum: 1 },
        songs: { $push: { id: "$_id", audioUrl: "$audioUrl", imageUrl: "$imageUrl" } }
      }
    },
    { $match: { count: { $gt: 1 } } },
    { $sort: { count: -1 } }
  ]);

  console.log(`Found ${duplicates.length} sets of duplicate songs\n`);

  let removed = 0;

  for (const dup of duplicates) {
    const { title, artist } = dup._id;
    const songs = dup.songs;

    console.log(`\n📀 "${title}" by ${artist} (${songs.length} copies)`);

    // Prefer songs with extracted covers
    songs.sort((a, b) => {
      const aHasExtracted = a.imageUrl?.includes("/extracted-covers/");
      const bHasExtracted = b.imageUrl?.includes("/extracted-covers/");
      if (aHasExtracted && !bHasExtracted) return -1;
      if (!aHasExtracted && bHasExtracted) return 1;

      return 0;
    });

    // Keep the first one (best priority), remove the rest
    const toKeep = songs[0];
    const toRemove = songs.slice(1);

    console.log(`  ✅ Keeping: ${toKeep.audioUrl}`);

    for (const song of toRemove) {
      console.log(`  ❌ Removing: ${song.audioUrl}`);
      await Song.deleteOne({ _id: song.id });
      removed++;
    }
  }

  const finalCount = await Song.countDocuments();

  console.log("\n=== Duplicate Cleanup Complete ===");
  console.log(`Songs removed: ${removed}`);
  console.log(`Songs before: ${initialCount}`);
  console.log(`Songs after: ${finalCount}`);
  console.log(`\n✅ Database cleaned!`);

  await mongoose.connection.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
