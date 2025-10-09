import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as mm from "music-metadata";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

// Set ffmpeg path from ffmpeg-static
ffmpeg.setFfmpegPath(ffmpegStatic);

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to songs folder
const songsFolder = path.resolve(__dirname, "../../../frontend/public/songs");
// Path to extracted covers folder
const extractedCoversFolder = path.resolve(
  __dirname,
  "../../../frontend/public/extracted-covers"
);
// Output file
const outputFile = path.resolve(__dirname, "../seeds/generatedSongs.js");

// Function to get song metadata using music-metadata
async function getSongMetadata(filePath) {
  try {
    // Parse metadata from the file
    const metadata = await mm.parseFile(filePath);

    // Extract useful information
    const result = {
      duration: Math.round(metadata.format.duration || 180),
      title: metadata.common.title,
      artist: metadata.common.artist || "Unknown Artist",
      album: metadata.common.album,
      year: metadata.common.year,
      // Check if picture data exists
      hasPicture: metadata.common.picture && metadata.common.picture.length > 0,
      picture: metadata.common.picture ? metadata.common.picture[0] : null,
    };

    return result;
  } catch (error) {
    console.error(`Error getting metadata for ${filePath}:`, error.message);
    // Return default values if metadata extraction fails
    return {
      duration: 180,
      title: null,
      artist: "Unknown Artist",
      album: null,
      year: null,
      hasPicture: false,
      picture: null,
    };
  }
}

// Function to parse song filename into title and artist (fallback if metadata extraction fails)
function parseFilename(filename) {
  // Remove file extension
  const withoutExtension = filename.replace(".mp3", "");

  // Split by " - " to separate artist and title
  const parts = withoutExtension.split(" - ");

  if (parts.length >= 2) {
    // Last part is the title
    const title = parts[parts.length - 1];
    // Everything before is the artist (joined if multiple " - " exist)
    const artist = parts.slice(0, parts.length - 1).join(" - ");
    return { title, artist };
  } else {
    // If no separator found, use the whole string as title and "Unknown" as artist
    return {
      title: withoutExtension,
      artist: "Unknown Artist",
    };
  }
}

// Function to save embedded cover art to a file
async function saveEmbeddedCoverArt(metadata, songFileName) {
  if (!metadata.hasPicture || !metadata.picture) {
    return null;
  }

  try {
    // Create the extracted covers directory if it doesn't exist
    if (!fs.existsSync(extractedCoversFolder)) {
      fs.mkdirSync(extractedCoversFolder, { recursive: true });
    }

    // Create a unique filename for the cover art based on the song name
    const cleanSongName = songFileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    const coverFileName = `${cleanSongName}_cover.${
      metadata.picture.format.split("/")[1]
    }`;
    const coverFilePath = path.join(extractedCoversFolder, coverFileName);

    // Save the cover art data to a file
    fs.writeFileSync(coverFilePath, Buffer.from(metadata.picture.data));
    console.log(`Saved cover art for ${songFileName} to ${coverFileName}`);

    // Return the path relative to the public folder
    return `/extracted-covers/${coverFileName}`;
  } catch (error) {
    console.error(`Error saving cover art for ${songFileName}:`, error);
    return null;
  }
}

// Create a mapping of songs to appropriate cover images
async function createCoverImageMapping() {
  // Get all cover images
  const coverImagesDir = path.resolve(
    __dirname,
    "../../../frontend/public/cover-images"
  );
  let coverFiles = [];

  try {
    coverFiles = fs.readdirSync(coverImagesDir);
    console.log(`Found ${coverFiles.length} cover images`);
  } catch (error) {
    console.error(`Error reading cover images directory: ${error.message}`);
    console.log("Using default cover images");
    // Create array of numbers 1-18 for default covers
    coverFiles = Array.from({ length: 18 }, (_, i) => `${i + 1}.jpg`);
  }

  return coverFiles;
}

// Find the best matching cover image for a song
function findCoverImage(songFile, songTitle, artist, coverFiles) {
  // Clean the artist and title for better matching
  const cleanArtist = artist.toLowerCase().trim();
  const cleanTitle = songTitle.toLowerCase().trim();

  // Try to find a matching cover by looking for artist or title in the filename
  const potentialMatches = coverFiles.filter((file) => {
    const fileName = file.toLowerCase();
    return fileName.includes(cleanArtist) || fileName.includes(cleanTitle);
  });

  if (potentialMatches.length > 0) {
    // Return the first potential match
    return `/cover-images/${potentialMatches[0]}`;
  } else {
    // If no match, use a consistent cover based on the song name hash
    const songNameHash = (songFile.length + artist.length) % coverFiles.length;
    return `/cover-images/${coverFiles[songNameHash]}`;
  }
}

async function generateSongsData() {
  try {
    // Ensure the extracted covers directory exists
    if (!fs.existsSync(extractedCoversFolder)) {
      fs.mkdirSync(extractedCoversFolder, { recursive: true });
    }

    // Read all files in the songs directory
    const files = fs.readdirSync(songsFolder);

    // Filter for MP3 files only
    const mp3Files = files.filter((file) =>
      file.toLowerCase().endsWith(".mp3")
    );

    console.log(`Found ${mp3Files.length} MP3 files`);

    // Get all available cover images
    const coverFiles = await createCoverImageMapping();

    // Process each file
    const songs = [];

    for (let i = 0; i < mp3Files.length; i++) {
      const file = mp3Files[i];
      const filePath = path.join(songsFolder, file);

      // Get metadata from the file
      const metadata = await getSongMetadata(filePath);

      // Fallback to filename parsing if metadata doesn't contain title or artist
      let title = metadata.title;
      let artist = metadata.artist;

      if (!title || !artist) {
        const filenameData = parseFilename(file);
        title = title || filenameData.title;
        artist = artist || filenameData.artist;
      }

      // Try to extract and save cover art from the audio file
      let coverImage = null;
      if (metadata.hasPicture) {
        coverImage = await saveEmbeddedCoverArt(metadata, file);
      }

      // If no embedded cover art was found or saved, fall back to the previous method
      if (!coverImage) {
        coverImage = findCoverImage(file, title, artist, coverFiles);
      }

      // Create song object
      const song = {
        title: title,
        artist: artist,
        imageUrl: coverImage,
        audioUrl: `/songs/${file}`,
        duration: metadata.duration,
      };

      songs.push(song);

      // Show progress
      if (i % 10 === 0 || i === mp3Files.length - 1) {
        console.log(`Processed ${i + 1}/${mp3Files.length} songs...`);
      }
    }

    // Generate the output file content
    const fileContent = `import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

const songs = ${JSON.stringify(songs, null, 2)};

// Export the songs array directly
export { songs };

const seedSongs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing songs
    await Song.deleteMany({});

    // Insert new songs
    await Song.insertMany(songs);

    console.log("Songs seeded successfully!");
  } catch (error) {
    console.error("Error seeding songs:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Uncomment the next line to run the seed function directly from this file
// seedSongs();
`;

    // Write the output file
    fs.writeFileSync(outputFile, fileContent);

    console.log(
      `Generated seed file with ${songs.length} songs at ${outputFile}`
    );
  } catch (error) {
    console.error("Error generating songs data:", error);
  }
}

// Run the function
generateSongsData();
