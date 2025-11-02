import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  X,
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
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [dominantColor, setDominantColor] = useState<string>("#1a1a1a");
  const [isLiked, setIsLiked] = useState(false);

  // Attach to the existing audio element on the page
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
      audio.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

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
        let r = 0,
          g = 0,
          b = 0;
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
      } catch (error) {
        console.warn("Could not extract color:", error);
        setDominantColor("#1a1a1a");
      }
    };

    img.onerror = () => {
      setDominantColor("#1a1a1a");
    };
  }, [currentSong?.imageUrl]);

  // Lock body scroll when open
  useEffect(() => {
    if (isFullscreenPlayer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isFullscreenPlayer]);

  if (!isFullscreenPlayer || !currentSong) return null;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setProgress(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration ? (progress / duration) * 100 : 0;

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
          backgroundImage: `url(${currentSong.imageUrl})`,
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
                  src={currentSong.imageUrl}
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
                <p className="text-2xl text-white/70">
                  {currentSong.artist}
                </p>
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
            <div className="space-y-3">
              <div className="relative h-2 bg-white/20 rounded-full overflow-hidden group cursor-pointer">
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
              <div className="flex justify-between text-sm text-white/60 font-medium">
                <span>{formatTime(progress)}</span>
                <span>{duration ? formatTime(duration) : "0:00"}</span>
              </div>
            </div>

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
                <Heart
                  className={cn("w-6 h-6", isLiked && "fill-current")}
                />
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
      {showQueue && (
        <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Up Next</h2>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowQueue(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="space-y-3">
              {queue.map((song, idx) => (
                <div
                  key={song._id}
                  onClick={() => {
                    setCurrentSong(song);
                    setShowQueue(false);
                  }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer",
                    idx === currentIndex && "bg-red-500/20 border border-red-500/30"
                  )}
                >
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "font-medium truncate text-lg",
                        idx === currentIndex && "text-red-400"
                      )}
                    >
                      {song.title}
                    </p>
                    <p className="text-sm text-white/60 truncate">
                      {song.artist}
                    </p>
                  </div>
                  {idx === currentIndex && (
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-5 bg-red-500 rounded-full animate-musicBar"
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
  );
};

export default FullPlayer;
