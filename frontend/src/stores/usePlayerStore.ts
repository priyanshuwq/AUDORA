import { create } from "zustand";
import { Song } from "@/types";
import { useEnhancedRoomStore } from "./useEnhancedRoomStore";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  isFullscreenPlayer: boolean;
  setIsFullscreenPlayer: (val: boolean) => void;
}

// Helper function to update room with current song
const updateRoomSong = (
  song: Song | null,
  isPlaying: boolean,
  position = 0
) => {
  const roomStore = useEnhancedRoomStore.getState();
  if (roomStore.currentRoom && roomStore.socket) {
    roomStore.updateCurrentSong(song, isPlaying, position);
  }
};

// Helper to get current audio position
const getCurrentAudioPosition = (): number => {
  const audioElement = document.querySelector("audio") as HTMLAudioElement;
  return audioElement ? audioElement.currentTime : 0;
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  isFullscreenPlayer: false,
  queue: [],
  currentIndex: -1,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];
    const currentPosition = getCurrentAudioPosition();

    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });

    // Update room if user is in one
    updateRoomSong(song, true, currentPosition);

    // If in a jam session and is host, sync playback to all users
    const roomStore = useEnhancedRoomStore.getState();
    if (roomStore.isJamSession && roomStore.isJamHost) {
      setTimeout(() => {
        const newPosition = getCurrentAudioPosition();
        roomStore.syncPlayback(song, newPosition, true);
      }, 100);
    }
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    const newState = {
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    };

    set(newState);

    // Update room if user is in one
    updateRoomSong(song, true);
  },

  togglePlay: () => {
    const currentState = get();
    const willStartPlaying = !currentState.isPlaying;
    const currentPosition = getCurrentAudioPosition();

    set({
      isPlaying: willStartPlaying,
    });

    // Update room if user is in one
    updateRoomSong(currentState.currentSong, willStartPlaying, currentPosition);

    // If in a jam session and is host, sync playback to all users
    const roomStore = useEnhancedRoomStore.getState();
    if (
      roomStore.isJamSession &&
      roomStore.isJamHost &&
      currentState.currentSong
    ) {
      setTimeout(() => {
        const newPosition = getCurrentAudioPosition();
        roomStore.syncPlayback(
          currentState.currentSong!,
          newPosition,
          willStartPlaying
        );
      }, 100);
    }
  },

  playNext: () => {
    const { currentIndex, queue } = get();
    const nextIndex = currentIndex + 1;

    // if there is a next song to play, let's play it
    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];

      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });

      // Update room if user is in one
      updateRoomSong(nextSong, true, 0);

      // If in a jam session and is host, sync playback to all users
      const roomStore = useEnhancedRoomStore.getState();
      if (roomStore.isJamSession && roomStore.isJamHost) {
        setTimeout(() => {
          roomStore.syncPlayback(nextSong, 0, true);
        }, 100);
      }
    } else {
      // no next song
      set({ isPlaying: false });

      // Update room if user is in one
      updateRoomSong(get().currentSong, false, getCurrentAudioPosition());
    }
  },

  playPrevious: () => {
    const { currentIndex, queue } = get();
    const prevIndex = currentIndex - 1;

    // theres a prev song
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];

      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      });

      // Update room if user is in one
      updateRoomSong(prevSong, true, 0);

      // If in a jam session and is host, sync playback to all users
      const roomStore = useEnhancedRoomStore.getState();
      if (roomStore.isJamSession && roomStore.isJamHost) {
        setTimeout(() => {
          roomStore.syncPlayback(prevSong, 0, true);
        }, 100);
      }
    } else {
      // no prev song
      set({ isPlaying: false });

      // Update room if user is in one
      updateRoomSong(get().currentSong, false, getCurrentAudioPosition());
    }
  },

  // fullscreen player toggle
  setIsFullscreenPlayer: (val: boolean) => set({ isFullscreenPlayer: val }),
}));
