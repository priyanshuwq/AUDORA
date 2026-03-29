import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import PlayButton from "./PlayButton";
import GlassCard from "@/components/ui/GlassCard";
import { getMediaUrl } from "@/lib/mediaUrl";

type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
};
const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
  if (isLoading) return <SectionGridSkeleton />;

  return (
    <div className="mb-6 sm:mb-8 md:mb-10">
      <div className="flex items-center justify-start mb-4 sm:mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-1 bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="h-1 w-16 rounded bg-red-600 mb-2" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 md:gap-6">
        {songs.map((song) => (
          <GlassCard key={song._id}>
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
              <h3 className="text-sm font-medium text-white truncate">
                {song.title}
              </h3>
              <p className="text-xs text-zinc-400 truncate">
                {song.artist}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
export default SectionGrid;
