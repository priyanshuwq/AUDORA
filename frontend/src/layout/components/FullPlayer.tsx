import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  List,
  Heart,
  Repeat,
  Shuffle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getMediaUrl } from "@/lib/mediaUrl";
import { useDominantColor } from "@/hooks/useDominantColor";
import { useAudioProgress } from "@/hooks/useAudioProgress";
import { useVolumeControl } from "@/hooks/useVolumeControl";
import { QueueOverlay, PlayerProgressBar } from "./player";

const FullPlayer = () => {
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

  // Use shared hooks
  const dominantColor = useDominantColor(getMediaUrl(currentSong?.imageUrl));

  const { progress, duration, progressPercent, handleSeek, audioRef } =
    useAudioProgress(currentSong?._id);

  const { volume, isMuted, toggleMute, handleVolumeChange, syncWithAudio } =
    useVolumeControl({ autoHideTimeout: 0 }); // No auto-hide on desktop

  // Sync volume with audio element
  useEffect(() => {
    syncWithAudio(audioRef);
  }, [syncWithAudio, audioRef, volume, isMuted]);

  // Lock body scroll when open
  useEffect(() => {
    if (isFullscreenPlayer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isFullscreenPlayer]);

  if (!isFullscreenPlayer || !currentSong) return null;

  return (
    <div
      className="fixed inset-0 z-[100] text-white transition-all duration-300"
      style={{
        background: `linear-gradient(180deg, ${dominantColor} 0%, #0a0a0a 50%, #000 100%)`,
      }}
    >
      {/* Blurred background effect */}
      <div
        className="absolute inset-0 opacity-20 blur-3xl"
        style={{
          backgroundImage: `url(${getMediaUrl(currentSong.imageUrl)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center p-8">
        <div className="w-full max-w-6xl flex items-center gap-12">
          {/* Left Side - Album Art */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full max-w-xl aspect-square">
              {/* Static glow effect */}
              <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-40"
                style={{
                  background: `radial-gradient(circle, ${dominantColor} 0%, transparent 70%)`,
                }}
              />

              {/* Cover Image */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={getMediaUrl(currentSong.imageUrl)}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Controls */}
          <div className="flex-1 flex flex-col justify-center space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm text-white/60 uppercase tracking-wider font-medium mb-2">
                  Now Playing
                </p>
                <h1 className="text-5xl font-bold mb-3 leading-tight">
                  {currentSong.title}
                </h1>
                <p className="text-2xl text-white/70">{currentSong.artist}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsFullscreenPlayer(false)}
                className="text-white hover:bg-white/10 rounded-full"
              >
                <ChevronDown className="w-8 h-8" />
              </Button>
            </div>

            {/* Progress Bar */}
            <PlayerProgressBar
              progress={progress}
              duration={duration}
              progressPercent={progressPercent}
              onSeek={handleSeek}
              variant="desktop"
            />

            {/* Main Controls */}
            <div className="flex items-center justify-center gap-8 py-4">
              <Button
                size="icon"
                variant="ghost"
                className="text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Shuffle className="w-6 h-6" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={playPrevious}
                className="text-white hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <SkipBack className="w-8 h-8 fill-current" />
              </Button>

              <Button
                size="icon"
                onClick={togglePlay}
                className="bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 rounded-full h-20 w-20 shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:shadow-[0_0_40px_rgba(239,68,68,0.7)] hover:scale-105 transition-all duration-200"
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10 fill-current" />
                ) : (
                  <Play className="w-10 h-10 fill-current ml-1" />
                )}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={playNext}
                className="text-white hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <SkipForward className="w-8 h-8 fill-current" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Repeat className="w-6 h-6" />
              </Button>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-4">
              {/* Like Button */}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  "transition-colors",
                  isLiked ? "text-red-500" : "text-white/70 hover:text-red-400"
                )}
              >
                <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
              </Button>

              {/* Volume Controls */}
              <div className="flex items-center gap-3 flex-1 max-w-xs mx-8">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleMute}
                  className="text-white/70 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : volume < 50 ? (
                    <Volume1 className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
                <div className="flex-1 relative h-1 bg-white/20 rounded-full overflow-hidden group">
                  <div
                    className="absolute top-0 left-0 h-full bg-white/70 rounded-full transition-all"
                    style={{ width: `${volume}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={handleVolumeChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-xs text-white/60 w-8">{volume}%</span>
              </div>

              {/* Queue Button */}
              <Button
                variant="ghost"
                onClick={() => setShowQueue(!showQueue)}
                className="text-white/70 hover:text-white hover:bg-white/10 gap-2 transition-colors"
              >
                <List className="w-5 h-5" />
                <span className="text-sm">Queue</span>
              </Button>
            </div>
          </div>
        </div>
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
        variant="desktop"
      />
    </div>
  );
};

export default FullPlayer;
