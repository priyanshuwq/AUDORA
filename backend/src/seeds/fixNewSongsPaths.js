import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

async function fixPaths() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set. Set it in a .env file or export it.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find songs with wrong audioUrl paths
    const songsWithWrongAudioUrl = await Song.find({
      audioUrl: { $regex: /^\/New songs\// },
    });
    console.log(`\nFound ${songsWithWrongAudioUrl.length} songs with /New songs/ audioUrl`);

    // Find songs with wrong imageUrl paths
    const songsWithWrongImageUrl = await Song.find({
      imageUrl: { $regex: /^\/New songs\// },
    });
    console.log(`Found ${songsWithWrongImageUrl.length} songs with /New songs/ imageUrl`);

    // Fix audioUrl paths: /New songs/ -> /songs/
    if (songsWithWrongAudioUrl.length > 0) {
      console.log("\n--- Fixing audioUrl paths ---");
      let audioFixed = 0;

      for (const song of songsWithWrongAudioUrl) {
        const oldUrl = song.audioUrl;
        const newUrl = oldUrl.replace("/New songs/", "/songs/");

        await Song.updateOne({ _id: song._id }, { audioUrl: newUrl });
        audioFixed++;

        if (audioFixed % 20 === 0) {
          console.log(`  Progress: ${audioFixed}/${songsWithWrongAudioUrl.length}`);
        }
      }
      console.log(`Fixed ${audioFixed} audioUrl paths`);
    }

    // Fix imageUrl paths: /New songs/covers/ -> /extracted-covers/
    if (songsWithWrongImageUrl.length > 0) {
      console.log("\n--- Fixing imageUrl paths ---");
      let imageFixed = 0;

      for (const song of songsWithWrongImageUrl) {
        const oldUrl = song.imageUrl;
        // Convert filename: "G-Eazy - Lady Killers II.jpg" -> "g_eazy___lady_killers_ii_cover.jpeg"
        // Format: artist_name___song_title_cover.jpeg (triple underscore between artist and title)
        const filename = oldUrl.replace("/New songs/covers/", "");
        const baseName = filename.replace(/\.(jpg|jpeg|png)$/i, "");
        // Split by " - " to get artist and title
        const parts = baseName.split(" - ");
        let newFilename;
        if (parts.length >= 2) {
          const artist = parts[0].toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
          const title = parts.slice(1).join(" - ").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
          newFilename = `${artist}___${title}_cover.jpeg`;
        } else {
          newFilename = baseName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") + "_cover.jpeg";
        }
        const newUrl = `/extracted-covers/${newFilename}`;

        console.log(`  "${song.title}"`);
        console.log(`    Old: ${oldUrl}`);
        console.log(`    New: ${newUrl}`);

        await Song.updateOne({ _id: song._id }, { imageUrl: newUrl });
        imageFixed++;
      }
      console.log(`Fixed ${imageFixed} imageUrl paths`);
    }

    // Verify fix
    console.log("\n=== Verification ===");
    const remainingAudio = await Song.countDocuments({
      audioUrl: { $regex: /^\/New songs\// },
    });
    const remainingImage = await Song.countDocuments({
      imageUrl: { $regex: /^\/New songs\// },
    });
    console.log(`Remaining /New songs/ audioUrl: ${remainingAudio}`);
    console.log(`Remaining /New songs/ imageUrl: ${remainingImage}`);

    if (remainingAudio === 0 && remainingImage === 0) {
      console.log("\n✓ All paths fixed successfully!");
    } else {
      console.log("\n⚠ Some paths may still need attention");
    }
  } catch (err) {
    console.error("Error:", err.message || err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  }
}

fixPaths();
