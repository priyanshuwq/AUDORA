import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import { useEffect, useRef, useState } from "react";
import { getMediaUrl } from "@/lib/mediaUrl";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [dominantColor, setDominantColor] = useState<string>("rgba(82, 82, 91, 0.7)"); // zinc-700 fallback
  const [progress, setProgress] = useState(0);
  
  // Swipe gesture state
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const { currentSong, isPlaying, playNext, playPrevious, isFullscreenPlayer } = usePlayerStore();
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
    const isSongChange = prevSongRef.current !== currentSong?._id;
    if (isSongChange) {
      audio.src = getMediaUrl(currentSong?.audioUrl);
      // reset the playback position
      audio.currentTime = 0;

      prevSongRef.current = currentSong?._id;

      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);

  // Extract dominant color from album art
  useEffect(() => {
    if (!currentSong?.imageUrl) {
      setDominantColor("rgba(82, 82, 91, 0.7)"); // zinc-700 fallback
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = getMediaUrl(currentSong.imageUrl);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let r = 0, g = 0, b = 0;
      const step = 10; // Sample every 10th pixel for performance
      let count = 0;

      for (let i = 0; i < data.length; i += 4 * step) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      // Make it slightly darker and more saturated for better contrast
      const darkenFactor = 0.7;
      r = Math.floor(r * darkenFactor);
      g = Math.floor(g * darkenFactor);
      b = Math.floor(b * darkenFactor);

      setDominantColor(`rgba(${r}, ${g}, ${b}, 1)`);
    };

    img.onerror = () => {
      setDominantColor("rgba(82, 82, 91, 0.7)");
    };
  }, [currentSong?.imageUrl]);

  // Track progress for the progress bar
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, []);

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

        if (song && song._id !== prevSongRef.current) {
          audio.src = getMediaUrl(song.audioUrl);
          prevSongRef.current = song._id;
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

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    // Don't set isSwiping yet - wait for actual movement
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    const diff = touchEndX.current - touchStartX.current;
    
    // Only consider it a swipe if movement is more than 10px
    if (Math.abs(diff) > 10) {
      setIsSwiping(true);
      // Limit swipe offset to prevent excessive dragging
      const limitedDiff = Math.max(-150, Math.min(150, diff));
      setSwipeOffset(limitedDiff);
    }
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchEndX.current - touchStartX.current;
    const minSwipeDistance = 80; // Minimum distance to trigger song change

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped right - previous song
        playPrevious();
      } else {
        // Swiped left - next song
        playNext();
      }
    }

    // Reset swipe state
    setIsSwiping(false);
    setSwipeOffset(0);
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <>
      <audio ref={audioRef} />

      {/* Mobile mini-player: visible on small screens, shows current song and centered play/pause */}
      {!isFullscreenPlayer && (
        <div
          className="md:hidden fixed left-3 right-3 bottom-24 z-50"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translateX(${swipeOffset}px)`,
            transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          <div 
            className="relative flex items-center justify-between p-3 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 overflow-hidden"
            style={{ 
              backgroundColor: dominantColor,
              opacity: isSwiping ? 0.7 : 0.90, // slight fade when swiping -translucent effect
              transition: 'opacity 0.3s',
            }}
            onClick={() => !isSwiping && setIsFullscreen(true)}
            role="button"
            aria-label="Open full player"
          >
            {/* Thin white progress bar at the top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/20">
              <div 
                className="h-full bg-white transition-all duration-300 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Swipe direction indicators */}
            {isSwiping && swipeOffset > 30 && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronLeft className="w-8 h-8 text-white drop-shadow-lg animate-pulse" />
              </div>
            )}
            {isSwiping && swipeOffset < -30 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronRight className="w-8 h-8 text-white drop-shadow-lg animate-pulse" />
              </div>
            )}

            {/* small poster */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                {currentSong && currentSong.imageUrl ? (
                  // stopPropagation so clicking the image doesn't open the full player
                  <img
                    src={getMediaUrl(currentSong.imageUrl)}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate drop-shadow-md">
                  {currentSong ? currentSong.title : "Nothing playing"}
                </div>
                <div className="text-xs text-white/70 truncate drop-shadow-sm">
                  {currentSong ? currentSong.artist : ""}
                </div>
              </div>
            </div>

            {/* controls: centered play/pause button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="bg-white hover:bg-white/90 text-black rounded-full p-3 shadow-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 hover:scale-105"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default AudioPlayer;
