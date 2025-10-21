import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

async function attachSongsToAlbum(albumDoc, match) {
  // match: { by: "filename"|"exact"|"contains", songs: string[] }
  if (!match || !Array.isArray(match.songs) || match.songs.length === 0) return;

  const attachedSongIds = [];
  for (const key of match.songs) {
    let song = null;
    if (match.by === "filename") {
      song = await Song.findOne({ audioUrl: new RegExp(`${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") });
    } else if (match.by === "exact") {
      const [title, artist] = String(key).split("||");
      song = await Song.findOne({ title: title?.trim(), artist: artist?.trim() });
    } else if (match.by === "contains") {
      const q = normalize(key);
      const candidates = await Song.find({});
      song = candidates.find(
        (s) => normalize(`${s.title} ${s.artist} ${s.audioUrl}`).includes(q)
      );
    }

    if (song) {
      attachedSongIds.push(song._id);
      // set the song's albumId
      await Song.updateOne({ _id: song._id }, { $set: { albumId: albumDoc._id } });
    } else {
      console.warn(`Could not match song for album "${albumDoc.title}":`, key);
    }
  }

  if (attachedSongIds.length > 0) {
    await Album.updateOne({ _id: albumDoc._id }, { $addToSet: { songs: { $each: attachedSongIds } } });
  }
}

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error(
      "MONGODB_URI is not set in the environment. Set it in backend/.env and rerun."
    );
    process.exit(1);
  }

  const jsonPath = process.argv[2] || path.resolve(__dirname, "manual_albums.json");
  let payload;

  try {
    const raw = await fs.readFile(jsonPath, "utf8");
    payload = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read manual albums JSON:", jsonPath, err.message || err);
    process.exit(1);
  }

  if (!payload || !Array.isArray(payload.albums)) {
    console.error("manual albums JSON must be of shape: { albums: [...] }");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message || err);
    process.exit(1);
  }

  try {
    let created = 0;
    for (const a of payload.albums) {
      const doc = {
        title: a.title,
        artist: a.artist,
        imageUrl: a.imageUrl,
        releaseYear: a.releaseYear,
        songs: [],
      };
      const albumDoc = await Album.create(doc);
      created++;

      if (a.match) {
        await attachSongsToAlbum(albumDoc, a.match);
      }
    }
    console.log(`Created ${created} manual album(s).`);
  } catch (err) {
    console.error("Error importing manual albums:", err.message || err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
