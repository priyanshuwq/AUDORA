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
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { AudioSyncManager, formatLatency } from "../lib/jamSyncUtils";

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
  const [networkQuality, setNetworkQuality] = useState<
    "excellent" | "good" | "fair" | "poor"
  >("good");
  const [lastSyncLatency, setLastSyncLatency] = useState(0);

  const syncManagerRef = useRef<AudioSyncManager | null>(null);

  // Initialize sync manager
  useEffect(() => {
    const audio = document.querySelector("audio") as HTMLAudioElement;
    if (audio && !syncManagerRef.current) {
      syncManagerRef.current = new AudioSyncManager(audio);
    }
  }, []);

  // Real-time sync with shared playback
  useEffect(() => {
    if (isJamSession && !isDragging && !isJamHost) {
      setLocalPosition(sharedPosition);
    }
  }, [sharedPosition, isJamSession, isDragging, isJamHost]);

  // Enhanced jam sync with adaptive sync manager
  useEffect(() => {
    const handleJamSync = (event: CustomEvent) => {
      const syncData = event.detail;
      const { song, position, isPlaying: jamIsPlaying, timestamp, serverTime } = syncData;

      if (isJamHost) return; // Host doesn't sync to others

      // Calculate and display latency
      if (serverTime) {
        const latency = Date.now() - serverTime;
        setLastSyncLatency(latency);
      }

      // Immediate sync - switch to the synced song if different
      if (currentSong?._id !== song._id) {
        playAlbum([song], 0);
      }

      // Use sync manager for improved synchronization
      if (syncManagerRef.current) {
        syncManagerRef.current.applySync({
          song,
          position,
          isPlaying: jamIsPlaying,
          timestamp,
          serverTime,
        });

        // Update network quality indicator
        setNetworkQuality(syncManagerRef.current.getNetworkQuality());
      } else {
        // Fallback to basic sync
        setLocalPosition(position);
        if (jamIsPlaying !== isPlaying) {
          const playerStore = usePlayerStore.getState();
          playerStore.togglePlay();
        }

        const audio = document.querySelector("audio") as HTMLAudioElement;
        if (audio && Math.abs(audio.currentTime - position) > 1) {
          audio.currentTime = position;
        }
      }

      console.log(
        "🎵 Sync received:",
        song.title,
        "playing:",
        jamIsPlaying,
        "at position:",
        position.toFixed(2),
        "latency:",
        lastSyncLatency + "ms"
      );
    };

    const handlePeriodicSync = (event: CustomEvent) => {
      const { position, isPlaying: jamIsPlaying } = event.detail;

      if (isJamHost || isDragging) return; // Don't sync when host or dragging

      // Use sync manager for adaptive thresholds
      if (syncManagerRef.current) {
        const audio = document.querySelector("audio") as HTMLAudioElement;
        if (audio) {
          const threshold = syncManagerRef.current.getSyncThreshold();
          
          // Only adjust if significantly out of sync (adaptive threshold)
          if (Math.abs(audio.currentTime - position) > threshold) {
            audio.currentTime = position;
          }

          // Sync playback state
          if (jamIsPlaying && audio.paused) {
            audio.play().catch(() => {});
          } else if (!jamIsPlaying && !audio.paused) {
            audio.pause();
          }
        }
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
  }, [currentSong, isPlaying, playAlbum, isJamHost, isDragging, lastSyncLatency]);

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

  // Get network quality icon and color
  const getNetworkIcon = () => {
    if (networkQuality === "excellent" || networkQuality === "good") {
      return <Wifi className="w-3 h-3 text-green-400" />;
    }
    return <WifiOff className="w-3 h-3 text-yellow-400" />;
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
          {!isJamHost && (
            <div className="flex items-center gap-1 bg-zinc-800/50 px-2 py-1 rounded-full" title={`Network: ${networkQuality} • Latency: ${formatLatency(lastSyncLatency)}`}>
              {getNetworkIcon()}
              <span className="text-zinc-400 text-xs">{formatLatency(lastSyncLatency)}</span>
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
