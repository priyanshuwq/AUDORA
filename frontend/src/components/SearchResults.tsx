import { useEffect, useRef } from "react";
import { Loader2, Music, AlertCircle, PlusCircle } from "lucide-react";
import { Song } from "@/types";
import SongCard from "./SongCard";
import VirtualizedList from "./VirtualizedList";
import { Button } from "./ui/button";

interface SearchResultsProps {
  songs: Song[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  totalSongs: number;
  query: string;
  onLoadMore: () => void;
  onPlay?: (song: Song) => void;
  onAddToAlbum?: (song: Song) => void;
  currentSong?: Song | null;
  isPlaying?: boolean;
  showHeader?: boolean;
}

const SearchResults = ({
  songs,
  isLoading,
  isLoadingMore,
  error,
  hasMore,
  totalSongs,
  query,
  onLoadMore,
  onPlay,
  onAddToAlbum,
  currentSong,
  isPlaying,
  showHeader = true,
}: SearchResultsProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || isLoadingMore || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-fade-in">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-red-500/20 rounded-full animate-pulse-slow" />
        </div>
        <div className="text-center space-y-3">
          <h3 className="text-xl font-semibold text-white animate-slide-in-top">
            Searching for "{query}"
          </h3>
          <p className="text-zinc-400 animate-slide-in-bottom">
            Finding the perfect songs for you...
          </p>
          {/* Loading skeleton */}
          <div className="space-y-3 mt-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 animate-fade-in"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="w-12 h-12 bg-zinc-800 rounded-md loading-skeleton" />
                <div className="flex-1 space-y-2">
                  <div
                    className="h-4 bg-zinc-800 rounded loading-skeleton"
                    style={{ width: `${70 + Math.random() * 30}%` }}
                  />
                  <div
                    className="h-3 bg-zinc-800 rounded loading-skeleton"
                    style={{ width: `${50 + Math.random() * 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  // No query state
  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Music className="w-16 h-16 text-zinc-600" />
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Ready to discover music?
          </h3>
          <p className="text-zinc-400">
            Start typing to search for your favorite songs and artists
          </p>
        </div>
      </div>
    );
  }

  // No results state
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Music className="w-16 h-16 text-zinc-600" />
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            No results found
          </h3>
          <p className="text-zinc-400">
            We couldn't find any songs matching "{query}". Try a different
            search term.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results header - conditionally rendered */}
      {showHeader && (
        <div className="flex items-center justify-between animate-slide-in-top">
          <h3 className="text-xl font-semibold text-white">
            Search Results for "{query}"
          </h3>
          <span className="text-sm text-zinc-400 animate-fade-in bg-zinc-800/50 px-3 py-1 rounded-full">
            {totalSongs.toLocaleString()} song{totalSongs !== 1 ? "s" : ""}{" "}
            found
          </span>
        </div>
      )}

      {/* Song list - Use virtualization for large lists */}
      {songs.length > 50 ? (
        <VirtualizedList
          songs={songs}
          containerHeight={600}
          onPlay={onPlay}
          onAddToAlbum={onAddToAlbum}
          currentSong={currentSong}
          isPlaying={isPlaying}
        />
      ) : (
        <div className="space-y-4">
          {songs.map((song, index) => (
            <div
              key={`${song._id}-${index}`}
              className="search-result-item group relative"
              style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
            >
              <SongCard
                song={song}
                isCurrentSong={currentSong?._id === song._id}
                isPlaying={isPlaying && currentSong?._id === song._id}
                onPlay={onPlay}
                className="song-card-hover"
              />

              {/* Add to Album Button */}
              {onAddToAlbum && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToAlbum(song);
                  }}
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900/80 hover:bg-zinc-800"
                  title="Add to Album"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  <span className="text-xs">Add to Album</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Load more section */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isLoadingMore ? (
            <div className="flex items-center gap-2 text-zinc-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more songs...</span>
            </div>
          ) : (
            <Button
              onClick={onLoadMore}
              variant="outline"
              className="bg-black/20 border-white/10 hover:bg-black/40 hover:border-red-500/30 text-white"
            >
              Load More Songs
            </Button>
          )}
        </div>
      )}

      {/* End message */}
      {!hasMore && songs.length > 0 && (
        <div className="text-center py-8">
          <p className="text-zinc-400">
            That's all we've got! You've seen all {totalSongs.toLocaleString()}{" "}
            results.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
