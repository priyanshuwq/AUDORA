import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Song } from "@/types";

interface LikedSongsStore {
  likedSongs: Song[];
  isLiked: (songId: string) => boolean;
  toggleLike: (song: Song) => void;
  clearLikedSongs: () => void;
}

export const useLikedSongsStore = create<LikedSongsStore>()(
  persist(
    (set, get) => ({
      likedSongs: [],

      isLiked: (songId: string) => {
        return get().likedSongs.some((song) => song._id === songId);
      },

      toggleLike: (song: Song) => {
        set((state) => {
          const isAlreadyLiked = state.likedSongs.some((s) => s._id === song._id);
          
          if (isAlreadyLiked) {
            // Remove from liked songs
            return {
              likedSongs: state.likedSongs.filter((s) => s._id !== song._id),
            };
          } else {
            // Add to liked songs
            return {
              likedSongs: [...state.likedSongs, song],
            };
          }
        });
      },

      clearLikedSongs: () => {
        set({ likedSongs: [] });
      },
    }),
    {
      name: "audora-liked-songs",
    }
  )
);
