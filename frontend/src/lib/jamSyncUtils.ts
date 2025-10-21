/**
 * Jam Sync Utilities - Enhanced time synchronization for live jam sessions
 */

interface SyncData {
  song: any;
  position: number;
  isPlaying: boolean;
  timestamp: number;
  serverTime?: number;
}

/**
 * Calculate network latency and adjusted position
 */
export const calculateAdjustedPosition = (syncData: SyncData): number => {
  const now = Date.now();
  const latency = syncData.serverTime
    ? (now - syncData.serverTime) / 2
    : 0;

  // If playing, adjust position forward by latency
  if (syncData.isPlaying) {
    return syncData.position + latency / 1000;
  }

  return syncData.position;
};

/**
 * Smooth seek to position with easing
 * Prevents jarring jumps in audio playback
 */
export const smoothSeek = (
  audio: HTMLAudioElement,
  targetPosition: number,
  threshold = 1.0
): void => {
  const currentPosition = audio.currentTime;
  const difference = Math.abs(targetPosition - currentPosition);

  // Only seek if difference is significant
  if (difference > threshold) {
    audio.currentTime = targetPosition;
  }
};

/**
 * Check if audio element is significantly out of sync
 */
export const isOutOfSync = (
  audio: HTMLAudioElement,
  expectedPosition: number,
  tolerance = 2.0
): boolean => {
  return Math.abs(audio.currentTime - expectedPosition) > tolerance;
};

/**
 * Get precise audio position with buffering consideration
 */
export const getPrecisePosition = (audio: HTMLAudioElement): number => {
  // Consider buffered ranges for more accurate position
  if (audio.buffered.length > 0) {
    const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
    // If current time is near the end of buffer, we might be buffering
    if (bufferedEnd - audio.currentTime < 1) {
      return audio.currentTime;
    }
  }
  return audio.currentTime;
};

/**
 * Debounce function for sync events
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for limiting sync frequency
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Adaptive sync threshold based on network quality
 * Lower threshold for good connections, higher for poor ones
 */
export class AdaptiveSyncManager {
  private latencyHistory: number[] = [];
  private readonly maxHistory = 10;
  private averageLatency = 0;

  recordLatency(latency: number): void {
    this.latencyHistory.push(latency);
    if (this.latencyHistory.length > this.maxHistory) {
      this.latencyHistory.shift();
    }
    this.averageLatency =
      this.latencyHistory.reduce((a, b) => a + b, 0) /
      this.latencyHistory.length;
  }

  getSyncThreshold(): number {
    // Good connection (< 100ms): tight sync (1s threshold)
    if (this.averageLatency < 100) return 1.0;
    
    // Medium connection (100-300ms): moderate sync (2s threshold)
    if (this.averageLatency < 300) return 2.0;
    
    // Poor connection (> 300ms): loose sync (3s threshold)
    return 3.0;
  }

  getSyncFrequency(): number {
    // Good connection: sync every 2 seconds
    if (this.averageLatency < 100) return 2000;
    
    // Medium connection: sync every 3 seconds
    if (this.averageLatency < 300) return 3000;
    
    // Poor connection: sync every 5 seconds
    return 5000;
  }

  getNetworkQuality(): "excellent" | "good" | "fair" | "poor" {
    if (this.averageLatency < 50) return "excellent";
    if (this.averageLatency < 150) return "good";
    if (this.averageLatency < 300) return "fair";
    return "poor";
  }
}

/**
 * Audio playback state manager for sync
 */
export class AudioSyncManager {
  private audio: HTMLAudioElement;
  private syncManager: AdaptiveSyncManager;
  private lastSyncTime = 0;
  private isSeeking = false;

  constructor(audio: HTMLAudioElement) {
    this.audio = audio;
    this.syncManager = new AdaptiveSyncManager();

    // Track seeking state to prevent conflicts
    audio.addEventListener("seeking", () => {
      this.isSeeking = true;
    });
    audio.addEventListener("seeked", () => {
      this.isSeeking = false;
    });
  }

  /**
   * Apply sync data to audio element
   */
  applySync(syncData: SyncData): void {
    if (this.isSeeking) return; // Don't sync while user is seeking

    const now = Date.now();
    const latency = syncData.serverTime ? now - syncData.serverTime : 0;

    // Record latency for adaptive sync
    if (latency > 0 && latency < 5000) {
      // Sanity check
      this.syncManager.recordLatency(latency);
    }

    // Calculate adjusted position
    const adjustedPosition = calculateAdjustedPosition(syncData);
    const threshold = this.syncManager.getSyncThreshold();

    // Sync position if needed
    if (isOutOfSync(this.audio, adjustedPosition, threshold)) {
      smoothSeek(this.audio, adjustedPosition, threshold);
    }

    // Sync playback state
    if (syncData.isPlaying && this.audio.paused) {
      this.audio.play().catch((err) => {
        console.warn("Failed to play audio:", err);
      });
    } else if (!syncData.isPlaying && !this.audio.paused) {
      this.audio.pause();
    }

    this.lastSyncTime = now;
  }

  /**
   * Check if it's time for periodic sync
   */
  shouldSync(): boolean {
    const frequency = this.syncManager.getSyncFrequency();
    return Date.now() - this.lastSyncTime >= frequency;
  }

  /**
   * Get network quality for UI display
   */
  getNetworkQuality() {
    return this.syncManager.getNetworkQuality();
  }

  /**
   * Get current sync threshold
   */
  getSyncThreshold() {
    return this.syncManager.getSyncThreshold();
  }
}

/**
 * Format milliseconds to readable latency string
 */
export const formatLatency = (ms: number): string => {
  if (ms < 1) return "< 1ms";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

/**
 * Check if browser supports necessary audio features
 */
export const checkAudioSupport = (): {
  supported: boolean;
  issues: string[];
} => {
  const issues: string[] = [];

  if (!window.Audio) {
    issues.push("Audio API not supported");
  }

  if (!navigator.mediaDevices) {
    issues.push("Media devices API not supported");
  }

  // Check for autoplay support
  const audio = new Audio();
  const canAutoplay = audio.play !== undefined;
  if (!canAutoplay) {
    issues.push("Autoplay may be blocked");
  }

  return {
    supported: issues.length === 0,
    issues,
  };
};

export default {
  calculateAdjustedPosition,
  smoothSeek,
  isOutOfSync,
  getPrecisePosition,
  debounce,
  throttle,
  AdaptiveSyncManager,
  AudioSyncManager,
  formatLatency,
  checkAudioSupport,
};
