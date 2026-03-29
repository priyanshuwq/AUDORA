/**
 * Time formatting utilities
 * Consolidated from multiple files to avoid duplication
 */

/**
 * Converts seconds to MM:SS format
 * Used for audio playback time display
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Alias for backward compatibility
export const formatDuration = formatTime;

/**
 * Converts a timestamp to a relative time string (e.g., "2m ago", "1h ago")
 * Used for activity timestamps
 */
export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = Math.floor((now - timestamp) / 1000);

  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

/**
 * Converts a timestamp to a short relative time (e.g., "2m", "1h")
 * Used for compact activity displays
 */
export const formatTimeAgoShort = (timestamp: number): string => {
  const now = Date.now();
  const diff = Math.floor((now - timestamp) / 1000);

  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
};
