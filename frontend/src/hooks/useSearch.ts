import { useState, useEffect, useCallback, useRef } from "react";
import { axiosInstance } from "@/lib/axios";
import { SearchResponse, Song } from "@/types";
import { useSearchCache } from "./useSearchCache";

interface UseSearchOptions {
  debounceMs?: number;
  limit?: number;
  enabled?: boolean;
}

interface UseSearchReturn {
  songs: Song[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  totalSongs: number;
  currentPage: number;
  search: (query: string) => void;
  loadMore: () => void;
  clearSearch: () => void;
}

export const useSearch = (options: UseSearchOptions = {}): UseSearchReturn => {
  const { debounceMs = 300, limit = 20, enabled = true } = options;

  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalSongs, setTotalSongs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState("");

  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();
  const cache = useSearchCache({ maxSize: 100, ttlMs: 5 * 60 * 1000 });

  const performSearch = useCallback(
    async (query: string, page: number = 1, isLoadMore: boolean = false) => {
      if (!enabled || !query.trim()) {
        setSongs([]);
        setHasMore(false);
        setTotalSongs(0);
        setCurrentPage(1);
        return;
      }

      try {
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        // Check cache first
        const cachedData = cache.get(query, page, limit);
        if (cachedData && !isLoadMore) {
          setSongs(cachedData.songs);
          setHasMore(cachedData.hasMore);
          setTotalSongs(cachedData.totalSongs);
          setCurrentPage(cachedData.currentPage);
          return;
        }

        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
          setSongs([]);
        }

        setError(null);

        const response = await axiosInstance.get<SearchResponse>(
          "/songs/search",
          {
            params: { query: query.trim(), page, limit },
            signal: abortControllerRef.current.signal,
          }
        );

        const data = response.data;

        // Cache the response
        cache.set(query, page, limit, data);

        if (isLoadMore) {
          setSongs((prevSongs) => [...prevSongs, ...data.songs]);
        } else {
          setSongs(data.songs);
        }

        setHasMore(data.hasMore);
        setTotalSongs(data.totalSongs);
        setCurrentPage(data.currentPage);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.response?.data?.message || "Failed to search songs");
          console.error("Search error:", err);
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [enabled, limit]
  );

  const search = useCallback(
    (query: string) => {
      setCurrentQuery(query);

      // Clear previous timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new timeout for debouncing
      debounceTimeoutRef.current = setTimeout(() => {
        performSearch(query, 1, false);
      }, debounceMs);
    },
    [performSearch, debounceMs]
  );

  const loadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && currentQuery) {
      performSearch(currentQuery, currentPage + 1, true);
    }
  }, [hasMore, isLoadingMore, currentQuery, currentPage, performSearch]);

  const clearSearch = useCallback(() => {
    setCurrentQuery("");
    setSongs([]);
    setHasMore(false);
    setTotalSongs(0);
    setCurrentPage(1);
    setError(null);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    songs,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    totalSongs,
    currentPage,
    search,
    loadMore,
    clearSearch,
  };
};
