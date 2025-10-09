import { useState, useCallback, useEffect } from "react";

interface SearchHistoryOptions {
  maxItems?: number;
  storageKey?: string;
}

export const useSearchHistory = (options: SearchHistoryOptions = {}) => {
  const { maxItems = 10, storageKey = "audora-search-history" } = options;
  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.warn("Failed to load search history:", error);
    }
  }, [storageKey]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(history));
    } catch (error) {
      console.warn("Failed to save search history:", error);
    }
  }, [history, storageKey]);

  const addToHistory = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery || trimmedQuery.length < 2) return;

      setHistory((prev) => {
        // Remove existing entry if it exists
        const filtered = prev.filter(
          (item) => item.toLowerCase() !== trimmedQuery.toLowerCase()
        );

        // Add to beginning and limit size
        const updated = [trimmedQuery, ...filtered].slice(0, maxItems);
        return updated;
      });
    },
    [maxItems]
  );

  const removeFromHistory = useCallback((query: string) => {
    setHistory((prev) =>
      prev.filter((item) => item.toLowerCase() !== query.toLowerCase())
    );
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getFilteredHistory = useCallback(
    (currentQuery: string) => {
      if (!currentQuery.trim()) return history;

      return history.filter((item) =>
        item.toLowerCase().includes(currentQuery.toLowerCase())
      );
    },
    [history]
  );

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getFilteredHistory,
  };
};
