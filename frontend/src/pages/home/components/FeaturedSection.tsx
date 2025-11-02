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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 md:gap-6 mb-8">
        {featuredSongs.map((song) => (
          <GlassCard key={song._id}>
            <div className="relative mb-2 group">
              <div className="aspect-square rounded-md overflow-hidden bg-zinc-900">
                <img
                  src={song.imageUrl}
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
              <p className="text-sm font-medium text-white truncate">
                {song.title}
              </p>
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
export default FeaturedSection;
