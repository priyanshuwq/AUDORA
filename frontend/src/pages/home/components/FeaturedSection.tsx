import { useMusicStore } from "@/stores/useMusicStore";
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import PlayButton from "./PlayButton";
import GlassCard from "@/components/ui/GlassCard";

const FeaturedSection = () => {
  const { isLoading, featuredSongs, error } = useMusicStore();

  if (isLoading) return <FeaturedGridSkeleton />;

  if (error) return <p className="text-red-500 mb-4 text-lg">{error}</p>;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-1 bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent tracking-wide sm:tracking-widest">
          Daily Mix
        </h2>
        <div className="h-1 w-16 rounded bg-red-600 mb-2" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {featuredSongs.map((song) => (
          <GlassCard
            key={song._id}
            className="overflow-hidden bg-gradient-to-b from-zinc-900/60 to-black/40 shadow-md"
          >
            <div className="w-full aspect-w-1 aspect-h-1 relative group">
              <img
                src={song.imageUrl}
                alt={song.title}
                className="w-full h-full object-cover rounded-md transform group-hover:scale-105 transition-transform duration-300"
              />
              <PlayButton
                song={song}
                className="absolute inset-0 m-auto w-12 h-12 flex items-center justify-center"
              />
            </div>
            <div className="p-2">
              <p className="text-sm font-semibold text-white truncate">
                {song.title}
              </p>
              <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
            </div>
            <div className="absolute top-2 right-2 hidden group-hover:block md:block transition-opacity">
              <PlayButton song={song} />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
export default FeaturedSection;
