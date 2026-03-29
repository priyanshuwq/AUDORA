import GlassCard from "@/components/ui/GlassCard";

interface SongGridSkeletonProps {
  count?: number;
}

const SongGridSkeleton = ({ count = 12 }: SongGridSkeletonProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
      {[...Array(count)].map((_, i) => (
        <GlassCard key={i} className="animate-pulse">
          <div className="aspect-square rounded-lg bg-zinc-800 mb-3" />
          <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
          <div className="h-3 bg-zinc-800 rounded w-1/2" />
        </GlassCard>
      ))}
    </div>
  );
};

export default SongGridSkeleton;
