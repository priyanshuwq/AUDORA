/**
 * Media URL utility for resolving media file paths.
 * 
 * In development: serves from local public folder (VITE_MEDIA_BASE_URL is empty)
 * In production: serves from external media repo/CDN (VITE_MEDIA_BASE_URL is set)
 * 
 * Usage:
 *   import { getMediaUrl } from "@/lib/mediaUrl";
 *   <img src={getMediaUrl(song.imageUrl)} />
 *   <audio src={getMediaUrl(song.audioUrl)} />
 */

const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL || '';

/**
 * Resolves a media path to a full URL.
 * 
 * @param path - Relative path like "/songs/track.mp3" or "/extracted-covers/cover.jpg"
 * @returns Full URL with media base prepended (if configured)
 * 
 * @example
 * // Development (VITE_MEDIA_BASE_URL is empty):
 * getMediaUrl("/songs/track.mp3") → "/songs/track.mp3"
 * 
 * // Production (VITE_MEDIA_BASE_URL = "https://user.github.io/audora-media"):
 * getMediaUrl("/songs/track.mp3") → "https://user.github.io/audora-media/songs/track.mp3"
 */
export function getMediaUrl(path: string | undefined | null): string {
  if (!path) return '';
  
  // Already an absolute URL - return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Data URLs (base64 images) - return as-is
  if (path.startsWith('data:')) {
    return path;
  }
  
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Prepend media base URL
  return `${MEDIA_BASE_URL}${cleanPath}`;
}

/**
 * Checks if media is being served from a remote source.
 * Useful for showing loading states or handling errors differently.
 */
export function isRemoteMedia(): boolean {
  return MEDIA_BASE_URL.length > 0;
}

export default getMediaUrl;
