import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { songs } from "./generatedSongs.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  // Prepare output path in frontend/public
  const repoRoot = path.resolve(__dirname, "..", "..", "..");
  const outDir = path.join(repoRoot, "frontend", "public");
  const outPath = path.join(outDir, "songs_metadata.json");

  // Map songs to a minimal metadata shape and ensure no album references
  const exported = songs.map((s) => ({
    title: s.title,
    artist: s.artist,
    imageUrl: s.imageUrl,
    audioUrl: s.audioUrl,
    duration: s.duration,
  }));

  await fs.writeFile(outPath, JSON.stringify(exported, null, 2), "utf8");
  console.log(`Wrote ${exported.length} songs to ${outPath}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
