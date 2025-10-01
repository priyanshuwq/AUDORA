import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { currentSong, isPlaying, playNext } = usePlayerStore();
  const { isJamSession, isJamHost } = useEnhancedRoomStore();

  // handle play/pause logic
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  // handle song ends
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      playNext();
    };

    audio?.addEventListener("ended", handleEnded);

    return () => audio?.removeEventListener("ended", handleEnded);
  }, [playNext]);

  // handle song changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;

    // check if this is actually a new song
    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
    if (isSongChange) {
      audio.src = currentSong?.audioUrl;
      // reset the playback position
      audio.currentTime = 0;

      prevSongRef.current = currentSong?.audioUrl;

      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);

  // Handle room sync events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleSyncEvent = (event: CustomEvent) => {
      const {
        song,
        position,
        isPlaying: syncIsPlaying,
        timestamp,
      } = event.detail;

      // Only sync if not the host (hosts control their own playback)
      if (!isJamHost && isJamSession) {
        const timeDiff = (Date.now() - timestamp) / 1000;
        const adjustedPosition = Math.max(0, position + timeDiff);

        if (song && song.audioUrl !== audio.src) {
          audio.src = song.audioUrl;
          prevSongRef.current = song.audioUrl;
        }

        // Clear any pending sync timeout
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }

        // Set position and play state
        syncTimeoutRef.current = setTimeout(() => {
          audio.currentTime = adjustedPosition;
          if (syncIsPlaying) {
            audio.play();
          } else {
            audio.pause();
          }
        }, 50);
      }
    };

    // Listen for sync events from enhanced room store
    window.addEventListener("room-sync", handleSyncEvent as EventListener);

    return () => {
      window.removeEventListener("room-sync", handleSyncEvent as EventListener);
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isJamSession, isJamHost]);

  return <audio ref={audioRef} />;
};
export default AudioPlayer;
