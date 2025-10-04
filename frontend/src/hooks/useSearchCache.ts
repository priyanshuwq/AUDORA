import { useRef, useCallback } from "react";
import { SearchResponse } from "@/types";

interface CacheEntry {
  data: SearchResponse;
  timestamp: number;
}

interface SearchCacheOptions {
  maxSize?: number;
  ttlMs?: number; // Time to live in milliseconds
}

export const useSearchCache = (options: SearchCacheOptions = {}) => {
  const { maxSize = 50, ttlMs = 5 * 60 * 1000 } = options; // Default 5 minutes TTL
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());

  const generateCacheKey = useCallback(
    (query: string, page: number, limit: number) => {
      return `${query.toLowerCase().trim()}:${page}:${limit}`;
    },
    []
  );

  const get = useCallback(
    (query: string, page: number, limit: number): SearchResponse | null => {
      const key = generateCacheKey(query, page, limit);
      const entry = cacheRef.current.get(key);

      if (!entry) return null;

      // Check if entry has expired
      if (Date.now() - entry.timestamp > ttlMs) {
        cacheRef.current.delete(key);
        return null;
      }

      return entry.data;
    },
    [generateCacheKey, ttlMs]
  );

  const set = useCallback(
    (query: string, page: number, limit: number, data: SearchResponse) => {
      const key = generateCacheKey(query, page, limit);

      // If cache is at max size, remove oldest entry
      if (cacheRef.current.size >= maxSize) {
        const firstKey = cacheRef.current.keys().next().value;
        if (firstKey) {
          cacheRef.current.delete(firstKey);
        }
      }

      cacheRef.current.set(key, {
        data,
        timestamp: Date.now(),
      });
    },
    [generateCacheKey, maxSize]
  );

  const clear = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  const invalidate = useCallback(
    (query?: string) => {
      if (!query) {
        clear();
        return;
      }

      const keysToDelete: string[] = [];
      cacheRef.current.forEach((_, key) => {
        if (key.startsWith(query.toLowerCase().trim())) {
          keysToDelete.push(key);
        }
      });

      keysToDelete.forEach((key) => cacheRef.current.delete(key));
    },
    [clear]
  );

  return { get, set, clear, invalidate };
};
