import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Load songs
import { songs } from "./generatedSongs.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MB_BASE = "https://musicbrainz.org/ws/2";
const CAA_BASE = "https://coverartarchive.org/release";

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function normalizeForCompare(s = "") {
  return s
    .toString()
    .toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D]/g, "'")
    .replace(/[’‘“”]/g, "'")
    .replace(/[’]/g, "'")
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 ]+/g, "")
    .trim();
}

async function searchRecording(title, artist) {
  const query = `recording:"${title}" AND artist:"${artist}"`;
  const url = `${MB_BASE}/recording?fmt=json&limit=5&query=${encodeURIComponent(
    query
  )}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "AudoraVerifier/1.0 ( priyanshuwq@example.com )" },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.recordings || [];
}

async function releaseHasCover(releaseId) {
  const url = `${CAA_BASE}/${releaseId}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "AudoraVerifier/1.0 ( priyanshuwq@example.com )" },
  });
  return res.ok;
}

function stripParenthetical(s) {
  return s
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/\s*\[.*?\]\s*/g, " ")
    .trim();
}

function titleVariants(title) {
  const v = new Set();
  v.add(title);
  v.add(stripParenthetical(title));
  v.add(title.replace(/From\s+\".*?\"/i, "").trim());
  v.add(title.replace(/\"/g, "'").trim());
  return Array.from(v).filter(Boolean);
}

async function verifyAll() {
  console.log(
    `Verifying ${songs.length} songs with MusicBrainz (this may take a while — rate-limited)`
  );

  const results = [];

  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    const localDurationMs = (Number(song.duration) || 0) * 1000;
    const artistPrimary = (song.artist || "")
      .split(/,|&|feat\.|feat|ft\./i)[0]
      .trim();
    const titles = titleVariants(song.title);

    let found = null;
    for (const t of titles) {
      // Respect MusicBrainz rate limit: 1 request/sec is polite. We'll pause 1100ms between external calls.
      await sleep(1100);
      try {
        const recs = await searchRecording(t, artistPrimary);
        if (recs && recs.length) {
          // pick best candidate by normalized title/artist matching
          const normTargetTitle = normalizeForCompare(song.title);
          const normTargetArtist = normalizeForCompare(artistPrimary);

          let best = null;
          for (const r of recs) {
            const rTitle = normalizeForCompare(r.title || "");
            const rArtist = normalizeForCompare(
              (r["artist-credit"] &&
                r["artist-credit"][0] &&
                (r["artist-credit"][0].name ||
                  (r["artist-credit"][0].artist &&
                    r["artist-credit"][0].artist.name))) ||
                ""
            );
            // score: title equality or contains
            const titleScore =
              rTitle === normTargetTitle
                ? 2
                : rTitle.includes(normTargetTitle) ||
                  normTargetTitle.includes(rTitle)
                ? 1
                : 0;
            const artistScore =
              rArtist === normTargetArtist
                ? 2
                : rArtist.includes(normTargetArtist) ||
                  normTargetArtist.includes(rArtist)
                ? 1
                : 0;
            const score = titleScore * 3 + artistScore;
            if (!best || score > best.score)
              best = { rec: r, score, rTitle, rArtist };
          }
          if (best && best.score > 0) {
            found = best.rec;
            break;
          }
        }
      } catch (err) {
        console.error("search error", err.message || err);
      }
    }

    // If we didn't find using artist+title, try title-only searches (less strict)
    if (!found) {
      for (const t of titles) {
        await sleep(1100);
        try {
          const url = `${MB_BASE}/recording?fmt=json&limit=3&query=${encodeURIComponent(
            'recording:"' + t + '"'
          )}`;
          const res = await fetch(url, {
            headers: {
              "User-Agent": "AudoraVerifier/1.0 ( priyanshuwq@example.com )",
            },
          });
          if (res.ok) {
            const json = await res.json();
            if (json.recordings && json.recordings.length) {
              found = json.recordings[0];
              break;
            }
          }
        } catch (err) {
          console.error("title-only search error", err.message || err);
        }
      }
    }

    let mbDuration = null;
    let durationMatch = false;
    let artistMatch = false;
    let coverFound = false;
    let mbRecordingId = null;
    let mbTitle = null;
    let mbArtistCredit = null;

    if (found) {
      mbRecordingId = found.id;
      mbTitle = found.title;
      mbArtistCredit = (found["artist-credit"] || [])
        .map((a) => a.name || (a.artist && a.artist.name))
        .filter(Boolean)
        .join(", ");
      if (found.length) mbDuration = Number(found.length);
      // duration match tolerance: 5 seconds
      if (Number.isFinite(mbDuration)) {
        durationMatch = Math.abs(mbDuration - localDurationMs) <= 5000;
      }
      const normLocalArtist = normalizeForCompare(artistPrimary);
      const normMbArtist = normalizeForCompare(mbArtistCredit || "");
      artistMatch =
        normLocalArtist &&
        normMbArtist &&
        (normLocalArtist === normMbArtist ||
          normMbArtist.includes(normLocalArtist) ||
          normLocalArtist.includes(normMbArtist));

      // check cover art on any release attached to the recording
      if (found.releases && found.releases.length) {
        for (const rel of found.releases) {
          try {
            // pause before each CAA call
            await sleep(1100);
            const ok = await releaseHasCover(rel.id);
            if (ok) {
              coverFound = true;
              break;
            }
          } catch (err) {
            // ignore
          }
        }
      }
    }

    results.push({
      index: i,
      title: song.title,
      artist: song.artist,
      localDurationSec: song.duration,
      mbRecordingId,
      mbTitle,
      mbArtistCredit,
      mbDurationMs: mbDuration,
      durationMatch,
      artistMatch,
      coverFound,
      found: !!found,
    });

    if ((i + 1) % 50 === 0) console.log(`Processed ${i + 1}/${songs.length}`);
  }

  const outJson = path.join(
    __dirname,
    "external_verification_musicbrainz.json"
  );
  await fs.writeFile(
    outJson,
    JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2),
    "utf8"
  );

  // generate a brief markdown summary
  const total = results.length;
  const foundCount = results.filter((r) => r.found).length;
  const durMismatch = results.filter((r) => r.found && !r.durationMatch).length;
  const artistMismatch = results.filter(
    (r) => r.found && !r.artistMatch
  ).length;
  const coverMissing = results.filter((r) => r.found && !r.coverFound).length;

  const md = [];
  md.push("# MusicBrainz External Verification Summary");
  md.push(`Generated: ${new Date().toISOString()}`);
  md.push("");
  md.push(`- Total songs checked: ${total}`);
  md.push(`- Recordings found on MusicBrainz: ${foundCount}`);
  md.push(`- Duration mismatches (±5s tolerance): ${durMismatch}`);
  md.push(`- Artist mismatches: ${artistMismatch}`);
  md.push(
    `- Releases missing cover art (where MB recording found): ${coverMissing}`
  );
  md.push("");
  md.push("## Next steps");
  md.push(
    "- Review the songs listed in `external_verification_musicbrainz.json` with mismatches."
  );
  md.push(
    "- For missing or ambiguous matches we can try additional heuristics (alternate title forms, search by ISRC if available)."
  );

  await fs.writeFile(
    path.join(__dirname, "external_verification_musicbrainz.md"),
    md.join("\n"),
    "utf8"
  );

  console.log(
    "External verification complete. Results saved to external_verification_musicbrainz.json and .md"
  );
}

verifyAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
