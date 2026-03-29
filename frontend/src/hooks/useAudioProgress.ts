import { useEffect, useRef, useState, useCallback } from "react";

interface UseAudioProgressReturn {
  /** Current playback position in seconds */
  progress: number;
  /** Total duration in seconds (null if not loaded) */
  duration: number | null;
  /** Progress as percentage (0-100) */
  progressPercent: number;
  /** Seek to a specific time in seconds */
  seek: (time: number) => void;
  /** Handler for range input onChange */
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Reference to the audio element */
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

/**
 * Hook to attach to the global audio element and track playback progress.
 * Automatically finds the audio element in the DOM and syncs with it.
 */
export function useAudioProgress(
  /** Dependency to re-attach when song changes */
  currentSongId?: string
): UseAudioProgressReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

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

    // Initialize duration if already loaded
    if (!isNaN(audio.duration)) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDur);
      audio.removeEventListener("canplay", onDur);
    };
  }, [currentSongId]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    seek(val);
  }, [seek]);

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  return {
    progress,
    duration,
    progressPercent,
    seek,
    handleSeek,
    audioRef,
  };
}

export default useAudioProgress;
