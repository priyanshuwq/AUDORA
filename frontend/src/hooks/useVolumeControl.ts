import { useEffect, useState, useCallback, useRef } from "react";

interface UseVolumeControlOptions {
  /** Initial volume (0-100) */
  initialVolume?: number;
  /** Auto-hide timeout in ms (0 to disable) */
  autoHideTimeout?: number;
}

interface UseVolumeControlReturn {
  /** Current volume (0-100) */
  volume: number;
  /** Whether audio is muted */
  isMuted: boolean;
  /** Whether volume bar is visible */
  showVolumeBar: boolean;
  /** Set volume (0-100) */
  setVolume: (value: number) => void;
  /** Toggle mute state */
  toggleMute: () => void;
  /** Set volume bar visibility */
  setShowVolumeBar: (show: boolean) => void;
  /** Handler for volume range input */
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Sync volume with audio element */
  syncWithAudio: (audioRef: React.RefObject<HTMLAudioElement | null>) => void;
}

/**
 * Hook to manage volume control state and sync with audio element.
 */
export function useVolumeControl(
  options: UseVolumeControlOptions = {}
): UseVolumeControlReturn {
  const { initialVolume = 75, autoHideTimeout = 3000 } = options;

  const [volume, setVolumeState] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeBar, setShowVolumeBar] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(initialVolume);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRefInternal = useRef<HTMLAudioElement | null>(null);

  // Auto-hide volume bar after timeout
  useEffect(() => {
    if (showVolumeBar && autoHideTimeout > 0) {
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }

      volumeTimeoutRef.current = setTimeout(() => {
        setShowVolumeBar(false);
      }, autoHideTimeout);
    }

    return () => {
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    };
  }, [showVolumeBar, volume, autoHideTimeout]);

  // Sync volume with audio element
  useEffect(() => {
    const audio = audioRefInternal.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume / 100;
      audio.muted = isMuted;
    }
  }, [volume, isMuted]);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
    if (value > 0) {
      setPreviousVolume(value);
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      setVolumeState(previousVolume);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      setVolumeState(0);
    }
  }, [isMuted, previousVolume, volume]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
  }, [setVolume]);

  const syncWithAudio = useCallback((audioRef: React.RefObject<HTMLAudioElement | null>) => {
    audioRefInternal.current = audioRef.current;
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume / 100;
      audio.muted = isMuted;
    }
  }, [isMuted, volume]);

  return {
    volume,
    isMuted,
    showVolumeBar,
    setVolume,
    toggleMute,
    setShowVolumeBar,
    handleVolumeChange,
    syncWithAudio,
  };
}

export default useVolumeControl;
