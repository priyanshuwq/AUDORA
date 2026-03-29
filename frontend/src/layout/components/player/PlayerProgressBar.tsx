import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/formatters";

interface PlayerProgressBarProps {
  /** Current playback position in seconds */
  progress: number;
  /** Total duration in seconds */
  duration: number | null;
  /** Progress as percentage (0-100) */
  progressPercent: number;
  /** Callback when user seeks */
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Visual variant */
  variant?: "mobile" | "desktop";
}

/**
 * Shared progress bar component for player interfaces.
 * Displays current time, duration, and allows seeking.
 */
export function PlayerProgressBar({
  progress,
  duration,
  progressPercent,
  onSeek,
  variant = "desktop",
}: PlayerProgressBarProps) {
  const isMobile = variant === "mobile";

  return (
    <div className={cn("space-y-2", !isMobile && "space-y-3")}>
      <div
        className={cn(
          "relative bg-white/20 rounded-full overflow-hidden",
          isMobile ? "h-1" : "h-2 group cursor-pointer"
        )}
      >
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-100 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
          style={{ width: `${progressPercent}%` }}
        />
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={onSeek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div
        className={cn(
          "flex justify-between text-white/60",
          isMobile ? "text-xs" : "text-sm font-medium"
        )}
      >
        <span>{formatTime(progress)}</span>
        <span>{duration ? formatTime(duration) : "0:00"}</span>
      </div>
    </div>
  );
}

export default PlayerProgressBar;
