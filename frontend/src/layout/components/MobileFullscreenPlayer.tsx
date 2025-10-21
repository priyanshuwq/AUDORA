import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Repeat,
  Shuffle,
  List,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Haptic feedback utility
const hapticFeedback = (style: "light" | "medium" | "heavy" = "light") => {
  if ("vibrate" in navigator) {
    switch (style) {
      case "light":
        navigator.vibrate(10);
        break;
      case "medium":
        navigator.vibrate(20);
        break;
      case "heavy":
        navigator.vibrate(40);
        break;
    }
  }
};

const MobileFullscreenPlayer = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    isFullscreenPlayer,
    setIsFullscreenPlayer,
    queue,
    currentIndex,
    setCurrentSong,
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [showQueue, setShowQueue] = useState(false);
  const [dominantColor, setDominantColor] = useState<string>("#1a1a1a");
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(75);
  const [showVolumeBar, setShowVolumeBar] = useState(false);
  
  // Touch/swipe state for dismissal
  const touchStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Attach to the existing audio element
  useEffect(() => {
    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setProgress(audio.currentTime);
    const onDur = () => setDuration(isNaN(audio.duration) ? 0 : audio.duration);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDur);
    audio.addEventListener("canplay", onDur);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDur);
      audio.removeEventListener("canplay", onDur);
    };
  }, [currentSong]);

  // Sync volume with audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume / 100;
    }
  }, [volume]);

  // Extract dominant color from cover image
  useEffect(() => {
    if (!currentSong?.imageUrl) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = currentSong.imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Sample pixels from the image
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let r = 0, g = 0, b = 0;
        const pixelCount = pixels.length / 4;

        for (let i = 0; i < pixels.length; i += 4) {
          r += pixels[i];
          g += pixels[i + 1];
          b += pixels[i + 2];
        }

        r = Math.floor(r / pixelCount);
        g = Math.floor(g / pixelCount);
        b = Math.floor(b / pixelCount);

        // Darken the color for better text contrast
        r = Math.floor(r * 0.4);
        g = Math.floor(g * 0.4);
        b = Math.floor(b * 0.4);

        const color = `rgb(${r}, ${g}, ${b})`;
        setDominantColor(color);

        // Update theme-color meta tag for browser UI (mobile address bar, status bar)
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', color);
        }
      } catch (error) {
        console.warn("Could not extract color:", error);
        setDominantColor("#1a1a1a");
      }
    };

    img.onerror = () => {
      setDominantColor("#1a1a1a");
    };
  }, [currentSong?.imageUrl]);

  // Lock body scroll when open and restore theme color when closed
  useEffect(() => {
    if (isFullscreenPlayer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setDragOffset(0);
      setIsDragging(false);
      
      // Restore default theme color when player is closed
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#ef4444'); // Default red theme
      }
    }
  }, [isFullscreenPlayer]);

  // Close volume bar when queue opens
  useEffect(() => {
    if (showQueue) {
      setShowVolumeBar(false);
    }
  }, [showQueue]);

  if (!isFullscreenPlayer || !currentSong) return null;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setProgress(val);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Swipe down to dismiss
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current == null) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) {
      setDragOffset(delta);
    }
  };

  const onTouchEnd = () => {
    if (dragOffset > 150) {
      hapticFeedback("medium"); // Vibrate on dismiss
      setIsFullscreenPlayer(false);
    }
    setDragOffset(0);
    setIsDragging(false);
    touchStartY.current = null;
  };

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  return (
    <div
      className={cn(
        "md:hidden fixed inset-0 z-[100] text-white transition-all duration-300 ease-out",
        isDragging && dragOffset > 0 ? "transition-none" : ""
      )}
      style={{
        background: `linear-gradient(180deg, ${dominantColor} 0%, #0a0a0a 50%, #000 100%)`,
        transform: `translateY(${dragOffset}px)`,
        opacity: 1 - dragOffset / 500,
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Blurred background effect */}
      <div
        className="absolute inset-0 opacity-30 blur-3xl"
        style={{
          backgroundImage: `url(${currentSong.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-4 pb-8" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              hapticFeedback("light");
              setIsFullscreenPlayer(false);
            }}
            className="text-white hover:bg-white/10"
          >
            <ChevronDown className="w-7 h-7" />
          </Button>

          <div className="flex-1 text-center">
            <p className="text-xs text-white-400/80 uppercase tracking-wider font-medium">
              Playing from Library
            </p>
          </div>

          <div className="relative">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                hapticFeedback("light");
                setShowVolumeBar(!showVolumeBar);
              }}
              className="text-white hover:bg-white/10"
            >
              <Volume2 className="w-6 h-6" />
            </Button>
            
            {/* Volume Slider */}
            {showVolumeBar && (
              <div className="absolute top-12 right-0 bg-black/80 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/10 min-w-[180px]">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => {
                        hapticFeedback("light");
                        setVolume(Number(e.target.value));
                      }}
                      className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-red-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, rgb(239, 68, 68) 0%, rgb(239, 68, 68) ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`
                      }}
                    />
                  </div>
                  <span className="text-xs text-white/60 w-8 text-right">{volume}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Album Art or Lyrics - Large and centered */}
        <div className="flex-1 flex items-center justify-center my-8 relative">
          {/* Album Art View */}
          <div 
            className="relative w-full max-w-md aspect-square"
          >
            {/* Static glow effect */}
            <div
              className="absolute inset-0 rounded-2xl blur-3xl opacity-40"
              style={{
                background: `radial-gradient(circle, ${dominantColor} 0%, transparent 70%)`,
              }}
            />
            
            {/* Cover Image */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Song Info */}
        <div className="space-y-2 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold truncate mb-1">
                {currentSong.title}
              </h1>
              <p className="text-base text-white/70 truncate">
                {currentSong.artist}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                hapticFeedback("medium");
                setIsLiked(!isLiked);
              }}
              className={cn(
                "flex-shrink-0 transition-colors",
                isLiked ? "text-red-500" : "text-white/70"
              )}
            >
              <Heart
                className={cn("w-6 h-6", isLiked && "fill-current")}
              />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-100 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={progress}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-xs text-white/60">
            <span>{formatTime(progress)}</span>
            <span>{duration ? formatTime(duration) : "0:00"}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6 px-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => hapticFeedback("light")}
            className="text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Shuffle className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                hapticFeedback("medium");
                playPrevious();
              }}
              className="text-white hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <SkipBack className="w-7 h-7 fill-current" />
            </Button>

            <Button
              size="icon"
              onClick={() => {
                hapticFeedback("heavy");
                togglePlay();
              }}
              className="bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 rounded-full h-16 w-16 shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.7)] hover:scale-105 transition-all duration-200"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                hapticFeedback("medium");
                playNext();
              }}
              className="text-white hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <SkipForward className="w-7 h-7 fill-current" />
            </Button>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => hapticFeedback("light")}
            className="text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Repeat className="w-5 h-5" />
          </Button>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              hapticFeedback("light");
              setShowQueue(!showQueue);
            }}
            className="text-white/70 hover:text-red-400 hover:bg-red-500/10 gap-2 transition-colors"
          >
            <List className="w-5 h-5" />
            <span className="text-sm">Up Next</span>
          </Button>
        </div>

        {/* Queue Overlay */}
        {showQueue && (
          <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Up Next</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    hapticFeedback("light");
                    setShowQueue(false);
                  }}
                  className="text-white hover:bg-white/10"
                >
                  <ChevronDown className="w-6 h-6" />
                </Button>
              </div>

              <div className="space-y-2">
                {queue.map((song, idx) => (
                  <div
                    key={song._id}
                    onClick={() => {
                      hapticFeedback("medium");
                      setCurrentSong(song);
                      setShowQueue(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg active:bg-red-500/10 transition-colors cursor-pointer",
                      idx === currentIndex && "bg-red-500/20 border border-red-500/30"
                    )}
                  >
                    <img
                      src={song.imageUrl}
                      alt={song.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium truncate",
                        idx === currentIndex && "text-red-400"
                      )}>{song.title}</p>
                      <p className="text-sm text-white/60 truncate">
                        {song.artist}
                      </p>
                    </div>
                    {idx === currentIndex && (
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-4 bg-red-500 rounded-full animate-musicBar"
                            style={{ animationDelay: `${i * 150}ms` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileFullscreenPlayer;
