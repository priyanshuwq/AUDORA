import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const repoRoot = path.resolve(__dirname, "..", "..", "..");
  const albumsDir = path.join(repoRoot, "frontend", "public", "albums");

  try {
    const files = await fs.readdir(albumsDir);
    const images = files.filter((f) => /\.jpg$|\.jpeg$|\.png$/i.test(f));

    for (const img of images) {
      const p = path.join(albumsDir, img);
      await fs.unlink(p);
      console.log(`Deleted ${p}`);
    }

    console.log("Album cover removal complete.");
  } catch (err) {
    console.error("Could not remove album covers:", err.message || err);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
