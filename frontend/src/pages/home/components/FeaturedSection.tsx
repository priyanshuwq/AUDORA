import { useMusicStore } from "@/stores/useMusicStore";
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import PlayButton from "./PlayButton";

const FeaturedSection = () => {
  const { isLoading, featuredSongs, error } = useMusicStore();

  if (isLoading) return <FeaturedGridSkeleton />;

  if (error) return <p className="text-red-500 mb-4 text-lg">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white tracking-widest">
        Daily Mix
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {featuredSongs.map((song) => (
          <div
            key={song._id}
            className="flex items-center bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden
						 hover:bg-black/50 hover:border-red-500/30 transition-all duration-300 group cursor-pointer relative shadow-xl hover:shadow-2xl hover:shadow-red-500/10 hover:scale-[1.02]"
          >
            <img
              src={song.imageUrl}
              alt={song.title}
              className="w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0 rounded-l-2xl"
            />
            <div className="flex-1 p-4">
              <p className="font-semibold tracking-widest truncate text-white group-hover:text-red-200 transition-colors">
                {song.title}
              </p>
              <p className="text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
                {song.artist}
              </p>
            </div>
            <PlayButton song={song} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default FeaturedSection;
