import { Song } from "@/types";
import BrowseSongCard from "./BrowseSongCard";
import { ReactNode } from "react";

interface SongGridProps {
  songs: Song[];
  gridClassName?: string;
  showAnimationDelay?: boolean;
  animationDelay?: number;
  renderAdditionalInfo?: (song: Song) => ReactNode;
}

const SongGrid = ({
  songs,
  gridClassName = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 md:gap-6",
  showAnimationDelay = true,
  animationDelay = 50,
  renderAdditionalInfo,
}: SongGridProps) => {
  return (
    <div className={gridClassName}>
      {songs.map((song, index) => (
        <BrowseSongCard
          key={song._id}
          song={song}
          index={showAnimationDelay ? index : 0}
          animationDelay={animationDelay}
          additionalInfo={renderAdditionalInfo?.(song)}
        />
      ))}
    </div>
  );
};

export default SongGrid;
