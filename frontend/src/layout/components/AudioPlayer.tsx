import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import { useEffect, useRef } from "react";
import { Play, Pause, SkipForward } from "lucide-react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { currentSong, isPlaying, playNext, isFullscreenPlayer } = usePlayerStore();
  const { isJamSession, isJamHost, isStreamingAudio, startAudioStream } = useEnhancedRoomStore();

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

  // Auto-start WebRTC streaming when host plays music in jam session
  useEffect(() => {
    const audio = audioRef.current;
    
    // Only for jam session hosts
    if (!isJamSession || !isJamHost || !audio) return;
    
    // If audio is playing but WebRTC streaming is not active, start it
    if (currentSong && isPlaying && !isStreamingAudio) {
      console.log('🎵 Host playing music - starting WebRTC stream...');
      
      // Small delay to ensure audio element is ready
      const startTimeout = setTimeout(() => {
        if (audio && !audio.paused) {
          startAudioStream(audio);
        }
      }, 300);
      
      return () => clearTimeout(startTimeout);
    }
  }, [isJamSession, isJamHost, currentSong, isPlaying, isStreamingAudio, startAudioStream]);

  // Handle room sync events with smooth drift correction
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

        // Smooth sync with drift tolerance
        syncTimeoutRef.current = setTimeout(() => {
          const drift = Math.abs(audio.currentTime - adjustedPosition);
          
          // Only hard sync if drift is significant (> 3 seconds)
          if (drift > 3) {
            console.log(`⚡ Hard sync: drift ${drift.toFixed(2)}s`);
            audio.currentTime = adjustedPosition;
          } else if (drift > 0.5) {
            // Smooth correction for smaller drifts using playback rate
            const correction = drift > 1.5 ? 0.1 : 0.05;
            audio.playbackRate = audio.currentTime < adjustedPosition 
              ? 1 + correction  // Speed up slightly
              : 1 - correction; // Slow down slightly
            
            // Reset playback rate after correction
            setTimeout(() => {
              if (audio) audio.playbackRate = 1.0;
            }, 2000);
          }
          
          // Update play state
          if (syncIsPlaying && audio.paused) {
            audio.play().catch(e => console.warn('Play interrupted:', e));
          } else if (!syncIsPlaying && !audio.paused) {
            audio.pause();
          }
        }, 50);
      }
    };

    // Handle periodic sync updates (less aggressive)
    const handlePeriodicSync = (event: CustomEvent) => {
      const { position, isPlaying: syncIsPlaying, serverTime } = event.detail;
      
      if (!isJamHost && isJamSession && audio && !audio.seeking) {
        const timeDiff = (Date.now() - serverTime) / 1000;
        const expectedPosition = position + timeDiff;
        const drift = Math.abs(audio.currentTime - expectedPosition);
        
        // Only apply gentle corrections during periodic sync
        if (drift > 2.5) {
          console.log(`📊 Periodic correction: drift ${drift.toFixed(2)}s`);
          // Use smooth playback rate adjustment
          audio.playbackRate = audio.currentTime < expectedPosition ? 1.08 : 0.92;
          setTimeout(() => {
            if (audio) audio.playbackRate = 1.0;
          }, 3000);
        }
        
        // Sync play state
        if (syncIsPlaying && audio.paused) {
          audio.play().catch(() => {});
        } else if (!syncIsPlaying && !audio.paused) {
          audio.pause();
        }
      }
    };

    // Listen for sync events from enhanced room store
    window.addEventListener("room-sync", handleSyncEvent as EventListener);
    window.addEventListener("periodicSync", handlePeriodicSync as EventListener);

    return () => {
      window.removeEventListener("room-sync", handleSyncEvent as EventListener);
      window.removeEventListener("periodicSync", handlePeriodicSync as EventListener);
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
