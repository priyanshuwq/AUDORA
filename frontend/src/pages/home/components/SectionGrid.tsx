import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import PlayButton from "./PlayButton";
import GlassCard from "@/components/ui/GlassCard";

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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {songs.map((song) => (
          <GlassCard key={song._id}>
              <div className="relative mb-3 sm:mb-4 group">
              <div className="aspect-square rounded-lg sm:rounded-xl shadow-2xl overflow-hidden">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <PlayButton song={song} className="absolute inset-0 m-auto w-10 h-10 flex items-center justify-center" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base tracking-wide sm:tracking-widest mb-1 sm:mb-2 truncate text-white group-hover:text-red-200 transition-colors">
              {song.title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
              {song.artist}
            </p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
export default SectionGrid;
