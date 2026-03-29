import { useState } from "react";
import { Play, Pause, Music } from "lucide-react";
import { Song } from "@/types";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/formatters";
import { getMediaUrl } from "@/lib/mediaUrl";

interface SongCardProps {
  song: Song;
  isCurrentSong?: boolean;
  isPlaying?: boolean;
  onPlay?: (song: Song) => void;
  className?: string;
}

const SongCard = ({
  song,
  isCurrentSong = false,
  isPlaying = false,
  onPlay,
  className,
}: SongCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handlePlay = () => {
    if (onPlay) {
      onPlay(song);
    }
  };

  return (
    <div
      onClick={handlePlay}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handlePlay();
        }
      }}
      role="button"
      tabIndex={0}
      className={cn(
        "group relative bg-black/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-300 cursor-pointer mobile-tap-highlight transform opacity-0 translate-y-2 animate-fadeInUp",
        isCurrentSong && "bg-red-500/10",
        className
      )}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Album Art */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center">
            {!imageError ? (
              <img
                src={getMediaUrl(song.imageUrl)}
                alt={`${song.title} album art`}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-200",
                  imageLoading && "opacity-0"
                )}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            ) : (
              <Music className="w-8 h-8 text-zinc-400" />
            )}

            {imageLoading && (
              <div className="absolute inset-0 bg-zinc-700 animate-pulse rounded-xl" />
            )}
          </div>

          {/* Play button overlay: visible on md+ always, on small screens only on hover */}
          <div className="absolute inset-0 bg-black/30 rounded-lg sm:rounded-xl hidden group-hover:flex md:flex items-center justify-center">
            <button
              onClick={handlePlay}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transform scale-95 hover:scale-100 transition-transform duration-200 shadow-lg"
              title="Play"
            >
              {isCurrentSong && isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-semibold text-white truncate mb-1 text-sm sm:text-base group-hover:text-red-400 transition-colors duration-200",
              isCurrentSong && "text-red-400"
            )}
          >
            {song.title}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 truncate mb-0.5 sm:mb-1">
            {song.artist}
          </p>
          <p className="text-xs text-zinc-500">
            {formatDuration(song.duration)}
          </p>
        </div>

        {/* Current playing indicator */}
        {isCurrentSong && isPlaying && (
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1">
              <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" />
              <div
                className="w-1 h-2 bg-red-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-1 h-3 bg-red-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongCard;
