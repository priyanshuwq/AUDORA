import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import { useEffect, useRef } from "react";
import { Play, Pause, SkipForward } from "lucide-react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { currentSong, isPlaying, playNext, isFullscreenPlayer } = usePlayerStore();
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

  const togglePlay = usePlayerStore.getState().togglePlay;
  const setIsFullscreen = usePlayerStore.getState().setIsFullscreenPlayer;

  return (
    <>
      <audio ref={audioRef} />

      {/* Mobile mini-player: visible on small screens, shows current song and centered play/pause */}
      {!isFullscreenPlayer && (
        <div
          className="md:hidden fixed left-3 right-3 bottom-24 z-50"
          onClick={() => setIsFullscreen(true)}
          role="button"
          aria-label="Open full player"
        >
          <div className="flex items-center justify-between p-3 rounded-2xl shadow-lg border border-white/6 bg-zinc-900/70 backdrop-blur-sm backdrop-saturate-90">
            {/* small poster */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                {currentSong && currentSong.imageUrl ? (
                  // stopPropagation so clicking the image doesn't open the full player
                  <img
                    src={currentSong.imageUrl}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {currentSong ? currentSong.title : "Nothing playing"}
                </div>
                <div className="text-xs text-zinc-400 truncate">
                  {currentSong ? currentSong.artist : ""}
                </div>
              </div>
            </div>

            {/* controls: play/pause + next */}
            <div className="flex items-center gap-3 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="bg-red-600 hover:bg-red-500 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playNext();
                }}
                aria-label="Next"
                className="bg-white/3 hover:bg-white/6 text-white rounded-md p-2 flex items-center justify-center"
              >
                <SkipForward className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default AudioPlayer;
