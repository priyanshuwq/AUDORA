import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious } =
    usePlayerStore();

  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");

    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      try {
        if (audio.currentTime && !isNaN(audio.currentTime)) {
          setCurrentTime(audio.currentTime);
        }
      } catch (error) {
        console.warn("Error updating time:", error);
      }
    };

    const updateDuration = () => {
      try {
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      } catch (error) {
        console.warn("Error updating duration:", error);
      }
    };

    // Set initial volume
    audio.volume = isMuted ? 0 : volume / 100;

    // More frequent updates for smoother animation
    const interval = setInterval(() => {
      try {
        if (audio && isPlaying && !audio.paused && !isNaN(audio.currentTime)) {
          setCurrentTime(audio.currentTime);
        }
      } catch (error) {
        // Silently handle errors to prevent console spam
      }
    }, 100);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("canplay", updateDuration);

    const handleEnded = () => {
      usePlayerStore.setState({ isPlaying: false });
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      clearInterval(interval);
      if (audio) {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
        audio.removeEventListener("canplay", updateDuration);
        audio.removeEventListener("ended", handleEnded);
      }
    };
  }, [currentSong, isPlaying, volume, isMuted]);

  const handleSeek = (value: number[]) => {
    try {
      if (audioRef.current && !isNaN(value[0])) {
        audioRef.current.currentTime = value[0];
        setCurrentTime(value[0]);
      }
    } catch (error) {
      console.warn("Error seeking:", error);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        setIsMuted(false);
        setVolume(previousVolume);
        audioRef.current.volume = previousVolume / 100;
      } else {
        setPreviousVolume(volume);
        setIsMuted(true);
        setVolume(0);
        audioRef.current.volume = 0;
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);

    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
      setPreviousVolume(newVolume);
    }

    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  return (
    <footer className="h-16 sm:h-20 md:h-24 bg-zinc-950/95 backdrop-blur-xl border-t border-white/10 px-2 sm:px-4 shadow-lg md:relative fixed bottom-16 md:bottom-0 left-0 right-0 z-30">
      <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
        {/* currently playing song */}
        <div className="hidden lg:flex items-center gap-3 min-w-[180px] w-[30%]">
          {currentSong && (
            <>
              <div className="relative">
                <img
                  src={currentSong.imageUrl}
                  alt={currentSong.title}
                  className="w-14 h-14 object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-red-500/15 rounded-xl animate-pulse" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold tracking-widest truncate hover:underline cursor-pointer text-white hover:text-red-300 transition-colors">
                  {currentSong.title}
                </div>
                <div className="text-sm text-zinc-400 truncate hover:underline cursor-pointer hover:text-zinc-300 transition-colors">
                  {currentSong.artist}
                </div>
                {isPlaying && (
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-0.5 h-2 bg-red-500 rounded-full animate-musicBar"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* player controls*/}
        <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1 max-w-full">
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 text-red-400">
            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex hover:text-white text-red-400 hover:bg-red-500/10 rounded-md transition-all duration-200"
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-red-400 hover:bg-red-500/10 rounded-md transition-all duration-200"
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              className="bg-red-600 hover:bg-red-500 text-white rounded-full h-10 w-10 shadow-[0_0_10px_rgba(255,0,51,0.35)] hover:shadow-[0_0_16px_rgba(255,0,51,0.6)] hover:scale-105 transition-all duration-200"
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-red-400 hover:bg-red-500/10 rounded-md transition-all duration-200"
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex hover:text-white text-red-400 hover:bg-red-500/10 rounded-md transition-all duration-200"
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-3 w-full">
            <div className="text-xs text-zinc-400 font-medium tabular-nums min-w-[35px]">
              {formatTime(currentTime)}
            </div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className={`w-full hover:cursor-grab active:cursor-grabbing [&_[role=slider]]:bg-red-500 [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-[0_0_10px_rgba(255,0,51,0.35)] [&>span:first-child]:bg-red-500/30 [&_[role=slider]:focus-visible]:ring-red-500/50 [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:transition-all [&_[role=slider]]:duration-200 ${
                isPlaying ? "[&>span:first-child]:animate-pulse" : ""
              }`}
              onValueChange={handleSeek}
            />
            <div className="text-xs text-zinc-400 font-medium tabular-nums min-w-[35px] text-right">
              {formatTime(duration)}
            </div>
          </div>
        </div>
        {/* volume controls */}
        <div className="hidden xl:flex items-center gap-2 min-w-[120px] w-[25%] justify-end">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleMute}
            className="hover:text-white text-red-400 hover:bg-red-500/10 rounded-md transition-all duration-200"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : volume < 50 ? (
              <Volume1 className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          <Slider
            value={[volume]}
            max={100}
            step={1}
            className="w-24 hover:cursor-grab active:cursor-grabbing [&_[role=slider]]:bg-red-500 [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-[0_0_10px_rgba(255,0,51,0.35)] [&>span:first-child]:bg-red-500/30 [&_[role=slider]:focus-visible]:ring-red-500/50 [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:transition-transform"
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
    </footer>
  );
};
