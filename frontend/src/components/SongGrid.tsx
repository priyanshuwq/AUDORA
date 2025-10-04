import { Music } from "lucide-react";
import { Song } from "@/types";

interface SongGridProps {
  songs: Song[];
  isLoading?: boolean;
  onPlay?: (song: Song) => void;
  currentSong?: Song | null;
  isPlaying?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

const SongGrid = ({
  songs,
  isLoading = false,
  onPlay,
  currentSong,
  isPlaying,
  emptyMessage = "No songs available",
  emptyDescription = "Check back later for new music",
}: SongGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="bg-black/20 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl animate-pulse"
          >
            <div className="aspect-square rounded-lg bg-zinc-800 mb-3" />
            <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
            <div className="h-3 bg-zinc-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Music className="w-16 h-16 text-zinc-600" />
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            {emptyMessage}
          </h3>
          <p className="text-zinc-400">{emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
      {songs.map((song) => (
        <div
          key={song._id}
          className="bg-black/20 backdrop-blur-sm border border-white/5 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl hover:bg-black/40 hover:border-red-500/20 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-xl hover:shadow-red-500/10 hover:scale-105"
        >
          <div className="relative mb-3 sm:mb-4">
            <div className="aspect-square rounded-lg sm:rounded-xl shadow-2xl overflow-hidden">
              <img
                src={song.imageUrl}
                alt={song.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <button
              onClick={() => onPlay && onPlay(song)}
              className="absolute right-2 bottom-2 bg-red-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-red-600 shadow-xl"
            >
              {isPlaying && currentSong?._id === song._id ? (
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-1 h-4 bg-white mx-0.5 animate-pulse-slow" />
                  <div className="w-1 h-4 bg-white mx-0.5 animate-pulse" />
                </div>
              ) : (
                <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent ml-0.5" />
              )}
            </button>
          </div>
          <h3 className="font-semibold text-sm sm:text-base tracking-wide mb-1 sm:mb-2 truncate text-white group-hover:text-red-200 transition-colors">
            {song.title}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
            {song.artist}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SongGrid;
