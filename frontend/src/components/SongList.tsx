import { Music } from "lucide-react";
import { Song } from "@/types";
import SongCard from "./SongCard";

interface SongListProps {
  songs: Song[];
  isLoading?: boolean;
  onPlay?: (song: Song) => void;
  currentSong?: Song | null;
  isPlaying?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

const SongList = ({
  songs,
  isLoading = false,
  onPlay,
  currentSong,
  isPlaying,
  emptyMessage = "No songs available",
  emptyDescription = "Check back later for new music",
}: SongListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-black/20 rounded-2xl p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-zinc-700 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-700 rounded w-3/4" />
                <div className="h-3 bg-zinc-700 rounded w-1/2" />
                <div className="h-2 bg-zinc-700 rounded w-1/4" />
              </div>
            </div>
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
    <div className="space-y-4">
      {songs.map((song, index) => (
        <SongCard
          key={`${song._id}-${index}`}
          song={song}
          isCurrentSong={currentSong?._id === song._id}
          isPlaying={isPlaying && currentSong?._id === song._id}
          onPlay={onPlay}
          className="hover:scale-[1.01] transition-transform duration-200"
        />
      ))}
    </div>
  );
};

export default SongList;
