import { Song } from "@/types";
import GlassCard from "@/components/ui/GlassCard";
import PlayButton from "@/pages/home/components/PlayButton";
import { ReactNode } from "react";
import { getMediaUrl } from "@/lib/mediaUrl";

interface BrowseSongCardProps {
  song: Song;
  index?: number;
  animationDelay?: number;
  className?: string;
  additionalInfo?: ReactNode;
}

const BrowseSongCard = ({
  song,
  index = 0,
  animationDelay = 50,
  className = "",
  additionalInfo,
}: BrowseSongCardProps) => {
  return (
    <GlassCard
      className={`search-result-item ${className}`}
      style={{ animationDelay: `${index * animationDelay}ms` }}
    >
      <div className="relative mb-2 group">
        <div className="aspect-square rounded-md overflow-hidden bg-zinc-900">
          <img
            src={getMediaUrl(song.imageUrl)}
            alt={song.title}
            className="w-full h-full object-cover"
          />
        </div>
        <PlayButton
          song={song}
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
        />
      </div>
      <div className="space-y-0.5 px-0.5">
        <h3 className="text-sm font-medium text-white truncate">{song.title}</h3>
        <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
        {additionalInfo}
      </div>
    </GlassCard>
  );
};

export default BrowseSongCard;
