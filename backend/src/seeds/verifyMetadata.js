/**
 * Song Metadata Verification Script
 * This script checks for mismatches between song metadata in generatedSongs.js and actual files
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { songs } from "./generatedSongs.js";

// Get directory name equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths configuration - update these to match your environment
const EXTRACTED_COVERS_PATH = "../../../frontend/public/extracted-covers";
const SONGS_PATH = "../../../frontend/public/songs";

// Results arrays
const missingCovers = [];
const missingAudio = [];
const artistMismatches = [];
const titleMismatches = [];
const allVerified = [];
const issueSongs = [];

console.log(`Verifying ${songs.length} songs...`);

// Get lists of files
const coverFiles = fs.readdirSync(
  path.resolve(__dirname, EXTRACTED_COVERS_PATH)
);
const audioFiles = fs
  .readdirSync(path.resolve(__dirname, SONGS_PATH))
  .filter((file) => file.endsWith(".mp3"));

// Verify each song
songs.forEach((song) => {
  const songResult = {
    title: song.title,
    artist: song.artist,
    status: "Verified",
    issues: [],
  };

  // Extract filenames from paths
  const coverFilename = path.basename(song.imageUrl);
  const audioFilename = path.basename(song.audioUrl);

  // Check if cover exists
  if (!coverFiles.includes(coverFilename)) {
    songResult.status = "Issue";
    songResult.issues.push(`Missing cover image: ${coverFilename}`);
    missingCovers.push(song);
  }

  // Check if audio exists
  if (!audioFiles.includes(audioFilename)) {
    songResult.status = "Issue";
    songResult.issues.push(`Missing audio file: ${audioFilename}`);
    missingAudio.push(song);
  }

  // Check artist/title consistency (tolerant normalization)
  const normalizeForAudio = (s) =>
    s
      .toLowerCase()
      // normalize fancy quotes to plain
      .replace(/[’‘“”]/g, "'")
      // remove quotes and extra punctuation that cause mismatches
      .replace(/["'`]/g, "")
      // normalize various dashes to hyphen
      .replace(/[–—−]/g, "-")
      // remove file extension if present
      .replace(/\.mp3$/i, "")
      // collapse multiple spaces
      .replace(/\s+/g, " ")
      .trim();

  const normalizeForCover = (s) =>
    s
      .toLowerCase()
      // replace any non-alphanumeric with underscore
      .replace(/[^a-z0-9]+/g, "_")
      // collapse multiple underscores
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");

  const audioNorm = normalizeForAudio(audioFilename);
  const expectedNorm = normalizeForAudio(`${song.artist} - ${song.title}`);
  const artistPrefixNorm = normalizeForAudio(song.artist);

  // Consider it a match if the normalized audio filename contains the normalized expected string
  const audioMatches =
    audioNorm.includes(expectedNorm) || audioNorm.startsWith(artistPrefixNorm);

  if (!audioMatches) {
    songResult.status = "Issue";
    songResult.issues.push(
      `Artist/title mismatch in filename: ${audioFilename}`
    );
    artistMismatches.push({
      song,
      audioFilename,
      expectedAudioStart: `${song.artist} - ${song.title}`,
    });
  }

  // Check cover image naming using a robust normalization that tolerates hyphens, $, en-dash, etc.
  const coverNorm = normalizeForCover(coverFilename);
  const expectedCoverArtist = normalizeForCover(song.artist);

  if (!coverNorm.includes(expectedCoverArtist)) {
    songResult.status = "Issue";
    songResult.issues.push(
      `Artist name pattern mismatch in cover: ${coverFilename}`
    );
  }

  // Add to verification results
  if (songResult.status === "Verified") {
    allVerified.push(song);
  } else {
    // record full issue details for reporting
    issueSongs.push({
      song,
      audioFilename,
      coverFilename,
      issues: songResult.issues,
    });
  }

  // Print status for this song
  console.log(`${songResult.status}: ${song.artist} - ${song.title}`);
  if (songResult.issues.length > 0) {
    songResult.issues.forEach((issue) => console.log(`  - ${issue}`));
  }
});

// Print summary
console.log("\n----- VERIFICATION SUMMARY -----");
console.log(`Total songs: ${songs.length}`);
console.log(`Successfully verified: ${allVerified.length}`);
console.log(`Missing covers: ${missingCovers.length}`);
console.log(`Missing audio: ${missingAudio.length}`);
console.log(`Artist/title mismatches: ${artistMismatches.length}`);

// Write detailed report
const report = {
  timestamp: new Date().toISOString(),
  totalSongs: songs.length,
  verifiedCount: allVerified.length,
  missingCovers,
  missingAudio,
  artistMismatches,
  issueSongs,
};

fs.writeFileSync(
  path.resolve(__dirname, "verification_results.json"),
  JSON.stringify(report, null, 2)
);

console.log("\nDetailed report written to verification_results.json");
