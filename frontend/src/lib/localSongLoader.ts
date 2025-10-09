import type { Song } from "@/types";

function simpleId(s: string) {
  // deterministic short id from string
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return "ls_" + (h >>> 0).toString(36);
}

export async function loadSongsToLocalStorage(): Promise<Song[]> {
  try {
    const existing = localStorage.getItem("audora:songs");
    if (existing) {
      try {
        return JSON.parse(existing) as Song[];
      } catch (e) {
        // fallthrough to re-fetch
      }
    }

    const res = await fetch("/songs_metadata.json");
    if (!res.ok) throw new Error("Failed to fetch songs metadata");
    const data = (await res.json()) as Array<{
      title: string;
      artist: string;
      imageUrl: string;
      audioUrl: string;
      duration: number;
    }>;

    const now = new Date().toISOString();
    const songs: Song[] = data.map((s) => ({
      _id: simpleId(s.title + "|" + s.artist + "|" + s.audioUrl),
      title: s.title,
      artist: s.artist,
      albumId: null,
      imageUrl: s.imageUrl,
      audioUrl: s.audioUrl,
      duration: s.duration,
      createdAt: now,
      updatedAt: now,
    }));

    localStorage.setItem("audora:songs", JSON.stringify(songs));
    return songs;
  } catch (err) {
    console.error("Error loading songs to localStorage", err);
    return [];
  }
}
