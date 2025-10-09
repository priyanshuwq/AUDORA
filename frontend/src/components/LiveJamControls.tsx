import { Button } from "@/components/ui/button";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Users,
  Shuffle,
  Radio,
  Crown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";

const LiveJamControls = () => {
  const {
    isJamSession,
    isJamHost,
    currentSharedSong,
    sharedIsPlaying,
    sharedPosition,
    sharedQueue,
    startJamSession,
    stopJamSession,
    toggleSharedPlayback,
    seekSharedSong,
    playSharedSong,
  } = useEnhancedRoomStore();

  const { currentSong, isPlaying, playAlbum, playNext, playPrevious } =
    usePlayerStore();

  const [localPosition, setLocalPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Real-time sync with shared playback
  useEffect(() => {
    if (isJamSession && !isDragging && !isJamHost) {
      setLocalPosition(sharedPosition);
    }
  }, [sharedPosition, isJamSession, isDragging, isJamHost]);

  // Listen for jam sync events - improved real-time sync
  useEffect(() => {
    const handleJamSync = (event: CustomEvent) => {
      const { song, position, isPlaying: jamIsPlaying } = event.detail;

      if (isJamHost) return; // Host doesn't sync to others

      // Immediate sync - switch to the synced song if different
      if (currentSong?._id !== song._id) {
        playAlbum([song], 0);
      }

      // Real-time position and state sync
      setLocalPosition(position);
      if (jamIsPlaying !== isPlaying) {
        // Immediate playback state sync without delays
        const playerStore = usePlayerStore.getState();
        playerStore.togglePlay();
      }

      // Force audio element sync for precise timing
      const audio = document.querySelector("audio");
      if (audio && Math.abs(audio.currentTime - position) > 1) {
        audio.currentTime = position;
      }
    };

    const handlePeriodicSync = (event: CustomEvent) => {
      const { position } = event.detail;

      if (isJamHost || isDragging) return; // Don't sync when host or dragging

      // Continuous position sync for smooth playback
      const audio = document.querySelector("audio");
      if (audio && Math.abs(audio.currentTime - position) > 2) {
        // Only adjust if significantly out of sync (2 seconds)
        audio.currentTime = position;
      }

      setLocalPosition(position);
    };

    window.addEventListener("jamSync", handleJamSync as EventListener);
    window.addEventListener(
      "periodicSync",
      handlePeriodicSync as EventListener
    );

    return () => {
      window.removeEventListener("jamSync", handleJamSync as EventListener);
      window.removeEventListener(
        "periodicSync",
        handlePeriodicSync as EventListener
      );
    };
  }, [currentSong, isPlaying, playAlbum, isJamHost, isDragging]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSliderChange = (value: number[]) => {
    const newPosition = value[0];
    setLocalPosition(newPosition);
    if (isJamSession && isJamHost) {
      seekSharedSong(newPosition);
    }
  };

  const handleSliderStart = () => {
    setIsDragging(true);
  };

  const handleSliderEnd = () => {
    setIsDragging(false);
  };

  if (!isJamSession) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <Radio className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">
                Start Jam Session
              </h3>
              <p className="text-zinc-400 text-xs">
                Sync music with everyone in the room
              </p>
            </div>
          </div>
          <Button
            onClick={startJamSession}
            className="bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-[0_0_10px_rgba(255,0,51,0.35)]"
            size="sm"
          >
            <Radio className="w-4 h-4 mr-2" />
            Start Jam
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-3 md:p-4 mb-4 backdrop-blur-sm">
      {/* Jam Session Header */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-white font-semibold text-sm">
            LIVE JAM SESSION
          </span>
          {isJamHost && (
            <div className="flex items-center gap-1 bg-red-500/20 px-2 py-1 rounded-full">
              <Crown className="w-3 h-3 text-red-400" />
              <span className="text-red-300 text-xs font-medium">HOST</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isJamHost && (
            <Button
              onClick={stopJamSession}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20 text-xs"
            >
              Stop Jam
            </Button>
          )}
        </div>
      </div>

      {/* Current Shared Song */}
      {currentSharedSong && (
        <div className="bg-black/30 rounded-lg p-2 md:p-3 mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <img
              src={currentSharedSong.imageUrl}
              alt="Album cover"
              className="w-12 h-12 rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {currentSharedSong.title}
              </p>
              <p className="text-zinc-400 text-xs truncate">
                {currentSharedSong.artist}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm font-medium">
                {sharedQueue.length} queued
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[localPosition]}
              onValueChange={handleSliderChange}
              onPointerDown={handleSliderStart}
              onPointerUp={handleSliderEnd}
              max={currentSharedSong.duration || 180}
              step={1}
              className="w-full [&_[role=slider]]:bg-red-500 [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-[0_0_10px_rgba(255,0,51,0.35)] [&>span:first-child]:bg-red-500/30 [&_[role=slider]:focus-visible]:ring-red-500/50 [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:transition-transform disabled:[&_[role=slider]]:opacity-50"
              disabled={!isJamHost}
            />
            <div className="flex justify-between text-xs text-zinc-400">
              <span>{formatTime(localPosition)}</span>
              <span>{formatTime(currentSharedSong.duration || 180)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-white"
          disabled={!isJamHost}
        >
          <Shuffle className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => isJamHost && playPrevious()}
          disabled={!isJamHost}
          className="text-zinc-400 hover:text-white"
        >
          <SkipBack className="w-5 h-5" />
        </Button>

        <Button
          onClick={() => {
            if (isJamHost) {
              toggleSharedPlayback();
            }
          }}
          disabled={!isJamHost}
          className="w-10 h-10 md:w-12 md:h-12 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,0,51,0.35)] transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
        >
          {sharedIsPlaying ? (
            <Pause className="w-4 h-4 md:w-6 md:h-6 text-white" />
          ) : (
            <Play className="w-4 h-4 md:w-6 md:h-6 text-white ml-1" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => isJamHost && playNext()}
          disabled={!isJamHost}
          className="text-zinc-400 hover:text-white"
        >
          <SkipForward className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-white"
        >
          <Volume2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Queue Preview */}
      {sharedQueue.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-red-400" />
            <span className="text-white font-medium text-sm">Shared Queue</span>
            <span className="text-zinc-400 text-xs">
              ({sharedQueue.length} songs)
            </span>
          </div>
          <div className="space-y-2">
            {sharedQueue.slice(0, 3).map((song, index) => (
              <div
                key={song._id}
                className="flex items-center gap-2 bg-black/20 rounded-lg p-2"
              >
                <span className="text-zinc-500 text-xs w-4">{index + 1}</span>
                <img
                  src={song.imageUrl}
                  alt="Album cover"
                  className="w-8 h-8 rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">
                    {song.title}
                  </p>
                  <p className="text-zinc-400 text-xs truncate">
                    {song.artist}
                  </p>
                </div>
                {isJamHost && (
                  <Button
                    onClick={() => playSharedSong(song)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
            {sharedQueue.length > 3 && (
              <p className="text-zinc-500 text-xs text-center">
                +{sharedQueue.length - 3} more songs
              </p>
            )}
          </div>
        </div>
      )}

      {!isJamHost && (
        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <Crown className="w-3 h-3" />
            <span className="hidden md:inline">Host controls playback</span>
            <span className="md:hidden">Host mode</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveJamControls;
