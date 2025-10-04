import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { songs } from "./generatedSongs.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch (e) {
    return false;
  }
}

async function run() {
  const extPath = path.join(
    __dirname,
    "external_verification_musicbrainz.json"
  );
  const dataRaw = await fs.readFile(extPath, "utf8");
  const data = JSON.parse(dataRaw);
  const results = data.results;

  const summary = {
    total: results.length,
    mbFound: 0,
    durationMatch: 0,
    artistMatch: 0,
    mbCoverFound: 0,
    localCoverPresent: 0,
    unknownMbDuration: 0,
  };

  const issues = {
    mbNotFound: [],
    durationMismatch: [],
    artistMismatch: [],
    mbCoverMissing: [],
    localCoverMissing: [],
  };

  for (const r of results) {
    if (r.found) summary.mbFound++;
    if (r.durationMatch) summary.durationMatch++;
    if (r.artistMatch) summary.artistMatch++;
    if (r.coverFound) summary.mbCoverFound++;
    if (r.mbDurationMs == null) summary.unknownMbDuration++;

    const song = songs[r.index];
    const imageUrl = song.imageUrl || "";
    const localCoverPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "frontend",
      "public",
      imageUrl.replace(/^\//, "")
    );
    const localExists = await fileExists(localCoverPath);
    if (localExists) summary.localCoverPresent++;

    if (!r.found)
      issues.mbNotFound.push({
        index: r.index,
        title: r.title,
        artist: r.artist,
      });
    if (r.found && !r.durationMatch)
      issues.durationMismatch.push({
        index: r.index,
        title: r.title,
        artist: r.artist,
        localDurationSec: r.localDurationSec,
        mbDurationMs: r.mbDurationMs,
      });
    if (r.found && !r.artistMatch)
      issues.artistMismatch.push({
        index: r.index,
        title: r.title,
        artist: r.artist,
        mbArtistCredit: r.mbArtistCredit,
      });
    if (r.found && !r.coverFound)
      issues.mbCoverMissing.push({
        index: r.index,
        title: r.title,
        artist: r.artist,
      });
    if (!localExists)
      issues.localCoverMissing.push({
        index: r.index,
        title: r.title,
        artist: r.artist,
        imageUrl,
      });
  }

  const out = { generatedAt: data.generatedAt, summary, issues };
  const outPath = path.join(__dirname, "external_verification_aggregated.json");
  await fs.writeFile(outPath, JSON.stringify(out, null, 2), "utf8");

  const md = [];
  md.push("# External Verification Aggregated Report");
  md.push(`Generated: ${new Date().toISOString()}`);
  md.push("");
  md.push("## Summary");
  md.push(`- Total songs checked: ${summary.total}`);
  md.push(`- MusicBrainz recordings found: ${summary.mbFound}`);
  md.push(`- Durations matched (±5s): ${summary.durationMatch}`);
  md.push(`- Artist matches: ${summary.artistMatch}`);
  md.push(
    `- Releases with cover art (MusicBrainz -> CAA): ${summary.mbCoverFound}`
  );
  md.push(`- Local cover images present: ${summary.localCoverPresent}`);
  md.push(
    `- Recordings with unknown MB duration: ${summary.unknownMbDuration}`
  );
  md.push("");
  md.push("## Issues");
  md.push(`- Recordings not found on MusicBrainz: ${issues.mbNotFound.length}`);
  md.push(`- Duration mismatches: ${issues.durationMismatch.length}`);
  md.push(`- Artist mismatches: ${issues.artistMismatch.length}`);
  md.push(`- MB releases missing cover art: ${issues.mbCoverMissing.length}`);
  md.push(`- Local cover images missing: ${issues.localCoverMissing.length}`);
  md.push("");
  md.push("## Samples (first 20 issues of each type)");
  md.push("");
  const sample = (arr) =>
    arr.slice(0, 20).map((a) => `- [${a.index}] ${a.title} — ${a.artist}`);
  md.push("### MB not found");
  md.push(...sample(issues.mbNotFound));
  md.push("");
  md.push("### Duration mismatches");
  md.push(...sample(issues.durationMismatch));
  md.push("");
  md.push("### Artist mismatches");
  md.push(...sample(issues.artistMismatch));
  md.push("");
  md.push("### MB cover missing");
  md.push(...sample(issues.mbCoverMissing));
  md.push("");
  md.push("### Local cover missing");
  md.push(...sample(issues.localCoverMissing));
  md.push("");

  await fs.writeFile(
    path.join(__dirname, "external_verification_aggregated.md"),
    md.join("\n"),
    "utf8"
  );

  console.log(
    "Aggregated external verification written to external_verification_aggregated.json and .md"
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
