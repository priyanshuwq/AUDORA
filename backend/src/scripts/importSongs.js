import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Group songs by artist to create albums
async function createAlbumsFromSongs(songs) {
  // Import needed modules
  const fs = await import("fs");
  const path = await import("path");
  const { fileURLToPath } = await import("url");
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Path to albums folder
  const albumsFolder = path.resolve(
    __dirname,
    "../../../frontend/public/albums"
  );

  // Get available album covers
  const albumCovers = fs.existsSync(albumsFolder)
    ? fs.readdirSync(albumsFolder)
    : [];

  // Group songs by artist
  const artistGroups = {};

  songs.forEach((song) => {
    if (!artistGroups[song.artist]) {
      artistGroups[song.artist] = [];
    }
    artistGroups[song.artist].push(song);
  });

  const albums = [];
  let albumIndex = 1;

  // Function to find the best album cover for an artist
  function findAlbumCover(artist, songTitles) {
    // If we have no album covers, use a default
    if (albumCovers.length === 0) return "/albums/1.jpg";

    // Try to find a cover that matches the artist name
    const artistMatch = albumCovers.find((cover) =>
      cover.toLowerCase().includes(artist.toLowerCase())
    );

    if (artistMatch) return `/albums/${artistMatch}`;

    // Try to find a cover that matches any of the song titles
    for (const title of songTitles) {
      const titleMatch = albumCovers.find((cover) =>
        cover.toLowerCase().includes(title.toLowerCase())
      );
      if (titleMatch) return `/albums/${titleMatch}`;
    }

    // Use a cover image based on the albumIndex (rotating through available covers)
    return `/albums/${albumCovers[albumIndex % albumCovers.length]}`;
  }

  // Create an album for each artist with more than 3 songs
  for (const [artist, artistSongs] of Object.entries(artistGroups)) {
    // Only create albums for artists with enough songs
    if (artistSongs.length >= 3) {
      // Get song titles for cover matching
      const songTitles = artistSongs.map((song) => song.title);

      // Find the best album cover
      const albumCover = findAlbumCover(artist, songTitles);

      // Create the album
      const album = {
        title: `${artist} Collection`,
        artist: artist,
        imageUrl: albumCover,
        releaseYear: new Date().getFullYear(),
        songs: artistSongs.map((song) => song._id),
      };

      albums.push(album);
      albumIndex++;

      // Update the albumId for each song
      for (const song of artistSongs) {
        song.albumId = null; // Will be updated after album creation
      }
    }
  }

  return albums;
}

const seedDatabase = async () => {
  try {
    // Import the songs data from the generated file
    const { songs } = await import("../seeds/generatedSongs.js");

    if (!songs || !Array.isArray(songs)) {
      throw new Error("Generated songs data is not in the expected format");
    }

    console.log(`Importing ${songs.length} songs...`);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing data
    await Album.deleteMany({});
    await Song.deleteMany({});

    // Insert songs first
    const insertedSongs = await Song.insertMany(songs);
    console.log(`Inserted ${insertedSongs.length} songs`);

    // Create albums from the songs
    const albumsToCreate = await createAlbumsFromSongs(insertedSongs);
    console.log(`Creating ${albumsToCreate.length} albums...`);

    // Insert albums
    const insertedAlbums = await Album.insertMany(albumsToCreate);
    console.log(`Created ${insertedAlbums.length} albums`);

    // Update songs with their album references
    for (let i = 0; i < insertedAlbums.length; i++) {
      const album = insertedAlbums[i];
      await Song.updateMany(
        { _id: { $in: album.songs } },
        { albumId: album._id }
      );
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
};

seedDatabase();
