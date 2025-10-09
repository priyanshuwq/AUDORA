import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import * as mm from "music-metadata";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_\.\-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

async function run() {
  const repoRoot = path.resolve(__dirname, "..", "..", "..");
  const publicDir = path.join(repoRoot, "frontend", "public");
  const songsDir = path.join(publicDir, "songs");
  const coversDir = path.join(publicDir, "extracted-covers");
  const outPath = path.join(publicDir, "songs_metadata.json");

  // Ensure songs dir exists
  try {
    await fs.access(songsDir);
  } catch (err) {
    console.error(`Songs directory not found: ${songsDir}`);
    process.exit(1);
  }

  // Ensure covers dir exists
  try {
    await fs.access(coversDir);
  } catch (err) {
    await fs.mkdir(coversDir, { recursive: true });
  }

  const files = await fs.readdir(songsDir);
  const audioFiles = files.filter((f) => /\.(mp3|m4a|wav|flac|aac)$/i.test(f));
  let coverFiles = await fs.readdir(coversDir).catch(() => []);

  const exported = [];
  let warnings = 0;

  for (const filename of audioFiles) {
    const filePath = path.join(songsDir, filename);
    let title = null;
    let artist = null;
    let duration = null;
    let imageUrl = null;

    try {
      const metadata = await mm.parseFile(filePath, { duration: true });
      const common = metadata.common || {};
      const format = metadata.format || {};

      if (common.title) title = common.title;
      if (common.artist) artist = common.artist;
      if (!artist && common.artists)
        artist = Array.isArray(common.artists)
          ? common.artists.join(", ")
          : String(common.artists);
      if (format.duration) duration = Math.round(format.duration);

      if (common.picture && common.picture.length > 0) {
        const pic = common.picture[0];
        const ext = pic.format && pic.format.includes("png") ? ".png" : ".jpg";
        const outName = `${normalizeName(path.parse(filename).name)}${ext}`;
        const outFile = path.join(coversDir, outName);
        await fs.writeFile(outFile, pic.data);
        imageUrl = `/extracted-covers/${outName}`;
        coverFiles.push(outName);
      }
    } catch (err) {
      warnings++;
    }

    // fallback parsing from filename
    if (!title || !artist) {
      const name = path.parse(filename).name;
      const parts = name.split(" - ");
      if (parts.length >= 2) {
        if (!artist) artist = parts[0].trim();
        if (!title) title = parts.slice(1).join(" - ").trim();
      } else {
        const byParts = name.split(" by ");
        if (byParts.length >= 2) {
          if (!title) title = byParts[0].trim();
          if (!artist) artist = byParts.slice(1).join(" by ").trim();
        } else {
          if (!title) title = name;
          if (!artist) artist = "Unknown";
        }
      }
    }

    // try to match an existing cover file by normalized name if still missing
    if (!imageUrl) {
      const normalized = normalizeName(path.parse(filename).name);
      const match = coverFiles.find((c) =>
        normalizeName(c).includes(normalized)
      );
      if (match) imageUrl = `/extracted-covers/${match}`;
    }

    exported.push({
      title,
      artist,
      imageUrl: imageUrl || null,
      audioUrl: `/songs/${filename}`,
      duration: duration || null,
      filename,
    });
  }

  await fs.writeFile(outPath, JSON.stringify(exported, null, 2), "utf8");
  console.log(`Wrote ${exported.length} songs to ${outPath}`);
  if (warnings > 0)
    console.log(
      `Warnings: ${warnings} file(s) had metadata parse errors and were fallback-parsed from filenames.`
    );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
