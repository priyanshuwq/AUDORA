import mongoose from "mongoose";
import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error(
      "MONGODB_URI is not set in the environment. Set it in backend/.env and rerun."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message || err);
    process.exit(1);
  }

  try {
    const albumCount = await Album.countDocuments();
    console.log(`Found ${albumCount} album(s) to delete.`);

    // Unset albumId on all songs first to avoid dangling refs
    const unsetRes = await Song.updateMany(
      { albumId: { $exists: true, $ne: null } },
      { $unset: { albumId: "" } }
    );
    console.log(
      `Unset albumId on ${unsetRes.modifiedCount || unsetRes.nModified || 0} song(s).`
    );

    const deleteRes = await Album.deleteMany({});
    console.log(`Deleted ${deleteRes.deletedCount || 0} album(s).`);
  } catch (err) {
    console.error("Error pruning albums:", err.message || err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
