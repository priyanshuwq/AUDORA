import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import EnhancedRoomControls from "@/components/EnhancedRoomControls";
import LiveJamControls from "@/components/LiveJamControls";
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
    <div className="h-full flex flex-col gap-3">
      {/* Navigation menu */}
      <div className="rounded-xl bg-zinc-950/80 backdrop-blur-sm p-4">
        <div className="space-y-2">
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className:
                  "w-full justify-start text-white hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 rounded-md tracking-wider",
              })
            )}
          >
            <HomeIcon className="mr-3 size-5" />
            <span className="hidden md:inline font-medium">Home</span>
          </Link>

          <Link
            to={"/browse"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className:
                  "w-full justify-start text-white hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 rounded-md tracking-wider",
              })
            )}
          >
            <Search className="mr-3 size-5" />
            <span className="hidden md:inline font-medium">Browse</span>
          </Link>
        </div>
      </div>

      {/* Jam Rooms section - Clean version */}
      <div className="rounded-xl bg-zinc-950/80 backdrop-blur-sm p-4">
        <div className="flex items-center text-white px-2 mb-3">
          <Radio className="size-5 mr-3 text-red-500" />
          <span className="hidden md:inline font-semibold tracking-widest">
            Jam Rooms
          </span>
        </div>

        {/* Always show room controls, activity is handled in ActivityBar */}
        {!isInRoom && <EnhancedRoomControls />}
        {isInRoom && <LiveJamControls />}
      </div>

      {/* Library section */}
      <div className="flex-1 rounded-xl bg-zinc-950/80 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-white px-2">
            <Library className="size-5 mr-3 text-red-500" />
            <span className="hidden md:inline font-semibold tracking-widest">
              Your Library
            </span>
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              albums.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className="p-3 hover:bg-white/5 rounded-md flex items-center gap-3 group cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                >
                  <img
                    src={album.imageUrl}
                    alt="Playlist img"
                    className="size-12 rounded-full flex-shrink-0 object-cover shadow-md"
                  />

                  <div className="flex-1 min-w-0 hidden md:block">
                    <p className="font-semibold tracking-widest truncate text-white group-hover:text-red-300 transition-colors">
                      {album.title}
                    </p>
                    <p className="text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
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
