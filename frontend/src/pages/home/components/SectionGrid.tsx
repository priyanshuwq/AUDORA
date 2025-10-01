import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";

type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
};
const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
  if (isLoading) return <SectionGridSkeleton />;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
        <Button
          variant="link"
          className="text-sm text-purple-400 hover:text-purple-300 font-medium"
        >
          Show all
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {songs.map((song) => (
          <div
            key={song._id}
            className="bg-black/20 backdrop-blur-sm border border-white/5 p-4 sm:p-6 rounded-2xl hover:bg-black/40 hover:border-purple-500/20 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-xl hover:shadow-purple-500/10 hover:scale-105"
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-xl shadow-2xl overflow-hidden">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-500 
									group-hover:scale-110"
                />
              </div>
              <PlayButton song={song} />
            </div>
            <h3 className="font-semibold mb-2 truncate text-white group-hover:text-purple-200 transition-colors">
              {song.title}
            </h3>
            <p className="text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
              {song.artist}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SectionGrid;
