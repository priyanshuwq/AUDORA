import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import EnhancedRoomControls from "@/components/EnhancedRoomControls";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";

import { HomeIcon, Library, Radio, Search } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  const { isInRoom } = useEnhancedRoomStore();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation menu - Floating Card */}
      <div className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-4">
        <div className="space-y-1">
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className:
                  "w-full justify-start text-white hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/10 hover:text-red-300 transition-all duration-300 rounded-xl tracking-wide group",
              })
            )}
          >
            <HomeIcon className="mr-3 size-5 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline font-medium">Home</span>
          </Link>

          <Link
            to={"/browse"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className:
                  "w-full justify-start text-white hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/10 hover:text-red-300 transition-all duration-300 rounded-xl tracking-wide group",
              })
            )}
          >
            <Search className="mr-3 size-5 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline font-medium">Browse</span>
          </Link>
        </div>
      </div>

      {/* Jam Rooms section - Floating Card */}
      <div className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-4">
        <div className="flex items-center text-white px-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mr-3">
            <Radio className="size-5 text-red-400" />
          </div>
          <span className="hidden md:inline font-semibold tracking-wider text-red-300">
            Jam Rooms
          </span>
        </div>

        {/* Room controls moved to Activity Bar, show create/join options only */}
        {!isInRoom && <EnhancedRoomControls />}
        {isInRoom && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
            <p className="text-green-300 text-sm font-medium">✓ Connected to Room</p>
            <p className="text-zinc-400 text-xs mt-1">Check Activity tab →</p>
          </div>
        )}
      </div>

      {/* Library section - Floating Card with Glassmorphism */}
      <div className="flex-1 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-white">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mr-3">
              <Library className="size-5 text-red-400" />
            </div>
            <span className="hidden md:inline font-semibold tracking-wider text-white">
              Your Library
            </span>
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-3.5rem)] overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              albums.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className="p-2.5 hover:bg-red-500/10 rounded-lg flex items-center gap-3 group cursor-pointer transition-all duration-200 border border-transparent hover:border-red-500/20"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={album.imageUrl}
                      alt="Playlist img"
                      className="size-12 rounded-lg object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 hidden md:block">
                    <p className="font-medium truncate text-white group-hover:text-red-300 transition-colors text-sm">
                      {album.title}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">
                      Album • {album.artist}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
export default LeftSidebar;
