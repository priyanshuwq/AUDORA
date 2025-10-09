import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Song } from "@/types";
import SongCard from "./SongCard";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";

interface VirtualizedListProps {
  songs: Song[];
  itemHeight?: number;
  containerHeight?: number;
  buffer?: number;
  onPlay?: (song: Song) => void;
  onAddToAlbum?: (song: Song) => void;
  currentSong?: Song | null;
  isPlaying?: boolean;
}

const VirtualizedList = ({
  songs,
  itemHeight = 80,
  containerHeight = 600,
  buffer = 5,
  onPlay,
  onAddToAlbum,
  currentSong,
  isPlaying,
}: VirtualizedListProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleRange = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight),
      songs.length - 1
    );

    const bufferedStart = Math.max(0, visibleStart - buffer);
    const bufferedEnd = Math.min(songs.length - 1, visibleEnd + buffer);

    return { start: bufferedStart, end: bufferedEnd };
  }, [scrollTop, itemHeight, containerHeight, buffer, songs.length]);

  const visibleSongs = useMemo(() => {
    return songs.slice(visibleRange.start, visibleRange.end + 1);
  }, [songs, visibleRange]);

  const totalHeight = songs.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Reset scroll position when songs change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, [songs]);

  if (songs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-zinc-400">No songs to display</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <div className="space-y-4">
            {visibleSongs.map((song, index) => {
              const actualIndex = visibleRange.start + index;
              return (
                <div
                  key={`${song._id}-${actualIndex}`}
                  className="group relative"
                >
                  <SongCard
                    song={song}
                    isCurrentSong={currentSong?._id === song._id}
                    isPlaying={isPlaying && currentSong?._id === song._id}
                    onPlay={onPlay}
                    className="hover:scale-[1.01] transition-transform duration-200"
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualizedList;
