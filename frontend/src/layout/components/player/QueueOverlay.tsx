import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Song } from "@/types";
import { getMediaUrl } from "@/lib/mediaUrl";

interface QueueOverlayProps {
  /** Whether the overlay is visible */
  isOpen: boolean;
  /** Callback to close the overlay */
  onClose: () => void;
  /** List of songs in the queue */
  queue: Song[];
  /** Index of the currently playing song */
  currentIndex: number;
  /** Callback when a song is selected */
  onSongSelect: (song: Song) => void;
  /** Visual variant */
  variant?: "mobile" | "desktop";
  /** Optional haptic feedback function */
  onHapticFeedback?: (style?: "light" | "medium" | "heavy") => void;
}

/**
 * Shared queue overlay component for displaying the song queue.
 * Used by both MobileFullscreenPlayer and FullPlayer.
 */
export function QueueOverlay({
  isOpen,
  onClose,
  queue,
  currentIndex,
  onSongSelect,
  variant = "desktop",
  onHapticFeedback,
}: QueueOverlayProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    onHapticFeedback?.("light");
    onClose();
  };

  const handleSongClick = (song: Song) => {
    onHapticFeedback?.("medium");
    onSongSelect(song);
  };

  const isMobile = variant === "mobile";

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
      <div className={cn("p-4", !isMobile && "max-w-4xl mx-auto p-8")}>
        <div className={cn("flex items-center justify-between", isMobile ? "mb-6" : "mb-8")}>
          <h2 className={cn("font-bold", isMobile ? "text-xl" : "text-3xl")}>
            Up Next
          </h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleClose}
            className="text-white hover:bg-white/10"
          >
            {isMobile ? (
              <ChevronDown className="w-6 h-6" />
            ) : (
              <X className="w-6 h-6" />
            )}
          </Button>
        </div>

        <div className={cn("space-y-2", !isMobile && "space-y-3")}>
          {queue.map((song, idx) => (
            <div
              key={song._id}
              onClick={() => handleSongClick(song)}
              className={cn(
                "flex items-center gap-3 rounded-lg transition-colors cursor-pointer",
                isMobile
                  ? "p-3 active:bg-red-500/10"
                  : "gap-4 p-4 rounded-xl hover:bg-white/5",
                idx === currentIndex && "bg-red-500/20 border border-red-500/30"
              )}
            >
              <img
                src={getMediaUrl(song.imageUrl)}
                alt={song.title}
                className={cn(
                  "rounded object-cover",
                  isMobile ? "w-12 h-12" : "w-16 h-16 rounded-lg flex-shrink-0"
                )}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-medium truncate",
                    !isMobile && "text-lg",
                    idx === currentIndex && "text-red-400"
                  )}
                >
                  {song.title}
                </p>
                <p className="text-sm text-white/60 truncate">{song.artist}</p>
              </div>
              {idx === currentIndex && (
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1 bg-red-500 rounded-full animate-musicBar",
                        isMobile ? "h-4" : "h-5"
                      )}
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
  );
}

export default QueueOverlay;
