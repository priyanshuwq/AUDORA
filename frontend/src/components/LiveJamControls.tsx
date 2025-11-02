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
import ScrollingText from "./ScrollingText";

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
    isLocalPlaybackMode,
    toggleLocalPlaybackMode,
    // WebRTC additions
    isStreamingAudio,
    remoteAudioStream,
    audioQuality,
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

  // WebRTC stream quality indicators
  const getStreamQualityIcon = () => {
    if (!audioQuality) return <Wifi className="w-3 h-3 text-zinc-400" />;
    
    if (audioQuality.packetLoss > 5 || audioQuality.latency > 200) {
      return <WifiOff className="w-3 h-3 text-yellow-400" />;
    } else if (audioQuality.latency > 100) {
      return <Wifi className="w-3 h-3 text-yellow-400" />;
    }
    return <Wifi className="w-3 h-3 text-green-400" />;
  };

  const getStreamQualityText = () => {
    if (!audioQuality) return "Connecting...";
    
    const latency = Math.round(audioQuality.latency);
    const packetLoss = audioQuality.packetLoss.toFixed(1);
    
    if (audioQuality.packetLoss > 5 || audioQuality.latency > 200) {
      return `Poor (${latency}ms, ${packetLoss}% loss)`;
    } else if (audioQuality.latency > 100) {
      return `Good (${latency}ms)`;
    }
    return `Excellent (${latency}ms)`;
  };

  if (!isJamSession) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Radio className="w-5 h-5 text-red-400" />
            </div>
            <div className="min-w-0">
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
            className="bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-[0_0_10px_rgba(255,0,51,0.35)] w-full sm:w-auto flex-shrink-0"
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 md:mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
          <span className="text-white font-semibold text-xs sm:text-sm">
            LIVE JAM SESSION
          </span>
          {isJamHost && (
            <div className="flex items-center gap-1 bg-red-500/20 px-2 py-1 rounded-full flex-shrink-0">
              <Crown className="w-3 h-3 text-red-400" />
              <span className="text-red-300 text-xs font-medium">HOST</span>
            </div>
          )}
          {!isJamHost && (
            <button
              onClick={toggleLocalPlaybackMode}
              className={`flex items-center gap-1 px-2 py-1 rounded-full flex-shrink-0 transition-all ${
                isLocalPlaybackMode
                  ? "bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40"
                  : "bg-zinc-800/50 hover:bg-zinc-700/50 border border-white/10"
              }`}
              title={isLocalPlaybackMode ? "Independent playback - your music won't affect others" : "Synced to room playback"}
            >
              {isLocalPlaybackMode ? (
                <>
                  <Users className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-300 text-xs font-medium">INDEPENDENT</span>
                </>
              ) : (
                <>
                  <Radio className="w-3 h-3 text-zinc-400" />
                  <span className="text-zinc-300 text-xs font-medium">SYNCED</span>
                </>
              )}
            </button>
          )}
          {isJamHost && isStreamingAudio && (
            <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full flex-shrink-0">
              <Radio className="w-3 h-3 text-green-400" />
              <span className="text-green-300 text-xs font-medium hidden md:inline">STREAMING</span>
            </div>
          )}
          {!isJamHost && remoteAudioStream && (
            <div className="flex items-center gap-1 bg-blue-500/20 px-2 py-1 rounded-full flex-shrink-0" title={getStreamQualityText()}>
              {getStreamQualityIcon()}
              <span className="text-blue-300 text-xs font-medium hidden md:inline">
                {getStreamQualityText().split(' ')[0]}
              </span>
            </div>
          )}
          {!isJamHost && !remoteAudioStream && (
            <div className="flex items-center gap-1 bg-zinc-800/50 px-2 py-1 rounded-full flex-shrink-0" title={`Network: ${networkQuality} • Latency: ${formatLatency(lastSyncLatency)}`}>
              {getNetworkIcon()}
              <span className="text-zinc-400 text-xs hidden sm:inline">{formatLatency(lastSyncLatency)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isJamHost && (
            <Button
              onClick={stopJamSession}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20 text-xs w-full sm:w-auto"
            >
              Stop Jam
            </Button>
          )}
        </div>
      </div>

      {/* Current Shared Song */}
      {currentSharedSong && (
        <div className="bg-black/40 rounded-xl p-3 mb-3 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={currentSharedSong.imageUrl}
              alt="Album cover"
              className="w-12 h-12 rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <ScrollingText 
                text={currentSharedSong.title}
                className="text-white font-medium text-sm"
              />
              <p className="text-zinc-400 text-xs truncate mt-0.5">
                {currentSharedSong.artist}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Users className="w-3 h-3 text-red-400" />
              <span className="text-red-300 text-xs font-medium">
                {sharedQueue.length}
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
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-white p-2"
          disabled={!isJamHost}
        >
          <Shuffle className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (isJamHost || isLocalPlaybackMode) {
              playPrevious();
            }
          }}
          disabled={!isJamHost && !isLocalPlaybackMode}
          className="text-zinc-400 hover:text-white p-2"
        >
          <SkipBack className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => {
            if (isJamHost) {
              toggleSharedPlayback();
            } else if (isLocalPlaybackMode) {
              // Guest in independent mode - toggle local playback
              const playerStore = usePlayerStore.getState();
              playerStore.togglePlay();
            }
          }}
          disabled={!isJamHost && !isLocalPlaybackMode}
          className="w-10 h-10 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,0,51,0.35)] transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
        >
          {(isJamHost ? sharedIsPlaying : isPlaying) ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (isJamHost || isLocalPlaybackMode) {
              playNext();
            }
          }}
          disabled={!isJamHost && !isLocalPlaybackMode}
          className="text-zinc-400 hover:text-white p-2"
        >
          <SkipForward className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-white p-2"
        >
          <Volume2 className="w-4 h-4" />
        </Button>
      </div>


    </div>
  );
};

export default LiveJamControls;
