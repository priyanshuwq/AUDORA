import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import PlayButton from "./PlayButton";

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
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide sm:tracking-widest">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {songs.map((song) => (
          <div
            key={song._id}
            className="bg-black/20 backdrop-blur-sm border border-white/5 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl hover:bg-black/40 hover:border-red-500/20 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-xl hover:shadow-red-500/10 hover:scale-105"
          >
            <div className="relative mb-3 sm:mb-4">
              <div className="aspect-square rounded-lg sm:rounded-xl shadow-2xl overflow-hidden">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-500 
									group-hover:scale-110"
                />
              </div>
              <PlayButton song={song} />
            </div>
            <h3 className="font-semibold text-sm sm:text-base tracking-wide sm:tracking-widest mb-1 sm:mb-2 truncate text-white group-hover:text-red-200 transition-colors">
              {song.title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
              {song.artist}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SectionGrid;
