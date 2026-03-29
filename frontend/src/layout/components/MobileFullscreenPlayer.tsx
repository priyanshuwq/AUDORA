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
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getMediaUrl } from "@/lib/mediaUrl";
import { useDominantColor } from "@/hooks/useDominantColor";
import { useAudioProgress } from "@/hooks/useAudioProgress";
import { useVolumeControl } from "@/hooks/useVolumeControl";
import { QueueOverlay, PlayerProgressBar } from "./player";

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

  const [showQueue, setShowQueue] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Touch/swipe state for dismissal
  const touchStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Use shared hooks
  const dominantColor = useDominantColor(getMediaUrl(currentSong?.imageUrl), {
    updateMetaTheme: isFullscreenPlayer,
  });

  const { progress, duration, progressPercent, handleSeek, audioRef } =
    useAudioProgress(currentSong?._id);

  const {
    volume,
    isMuted,
    showVolumeBar,
    setVolume,
    toggleMute,
    setShowVolumeBar,
    syncWithAudio,
  } = useVolumeControl({ autoHideTimeout: 3000 });

  // Sync volume with audio element
  useEffect(() => {
    syncWithAudio(audioRef);
  }, [syncWithAudio, audioRef, volume, isMuted]);

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
        metaThemeColor.setAttribute("content", "#ef4444");
      }
    }
  }, [isFullscreenPlayer]);

  // Close volume bar when queue opens
  useEffect(() => {
    if (showQueue) {
      setShowVolumeBar(false);
    }
  }, [showQueue, setShowVolumeBar]);

  if (!isFullscreenPlayer || !currentSong) return null;

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
      hapticFeedback("medium");
      setIsFullscreenPlayer(false);
    }
    setDragOffset(0);
    setIsDragging(false);
    touchStartY.current = null;
  };

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
          backgroundImage: `url(${getMediaUrl(currentSong.imageUrl)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 h-full flex flex-col p-4 pb-8"
        style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
      >
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

          <div className="relative">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                hapticFeedback("medium");
                toggleMute();
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                hapticFeedback("light");
                setShowVolumeBar(!showVolumeBar);
              }}
              onTouchStart={(e) => {
                // Long press to show volume bar
                const timer = setTimeout(() => {
                  hapticFeedback("light");
                  setShowVolumeBar(true);
                }, 500);

                const touchEnd = () => {
                  clearTimeout(timer);
                  e.currentTarget.removeEventListener("touchend", touchEnd);
                  e.currentTarget.removeEventListener("touchcancel", touchEnd);
                };

                e.currentTarget.addEventListener("touchend", touchEnd);
                e.currentTarget.addEventListener("touchcancel", touchEnd);
              }}
              className={cn(
                "text-white hover:bg-white/10 transition-colors",
                isMuted && "text-red-400"
              )}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </Button>

            {/* Volume Slider */}
            {showVolumeBar && (
              <div className="absolute top-12 right-0 bg-black/80 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/10 min-w-[180px]">
                <div className="flex items-center gap-3">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400 flex-shrink-0" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-red-400 flex-shrink-0" />
                  )}
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
                        background: `linear-gradient(to right, rgb(239, 68, 68) 0%, rgb(239, 68, 68) ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-white/60 w-8 text-right">
                    {volume}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Album Art */}
        <div className="flex-1 flex items-center justify-center my-8 relative">
          <div className="relative w-full max-w-md aspect-square">
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
                src={getMediaUrl(currentSong.imageUrl)}
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
              <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <PlayerProgressBar
            progress={progress}
            duration={duration}
            progressPercent={progressPercent}
            onSeek={handleSeek}
            variant="mobile"
          />
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
        <QueueOverlay
          isOpen={showQueue}
          onClose={() => setShowQueue(false)}
          queue={queue}
          currentIndex={currentIndex}
          onSongSelect={(song) => {
            setCurrentSong(song);
            setShowQueue(false);
          }}
          variant="mobile"
          onHapticFeedback={hapticFeedback}
        />
      </div>
    </div>
  );
};

export default MobileFullscreenPlayer;
