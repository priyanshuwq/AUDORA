import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import EnhancedRoomControls from "@/components/EnhancedRoomControls";
import RoomInterface from "@/components/RoomInterface";
import LiveJamControls from "@/components/LiveJamControls";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";

import { HomeIcon, Library, Radio } from "lucide-react";
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
      <div className="rounded-xl bg-black/40 backdrop-blur-sm border border-white/5 p-4">
        <div className="space-y-2">
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className:
                  "w-full justify-start text-white hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-200 rounded-xl",
              })
            )}
          >
            <HomeIcon className="mr-3 size-5" />
            <span className="hidden md:inline font-medium">Home</span>
          </Link>
        </div>
      </div>

      {/* Jam Rooms section */}
      <div className="rounded-xl bg-black/40 backdrop-blur-sm border border-white/5 p-4">
        <div className="flex items-center text-white px-2 mb-3">
          <Radio className="size-5 mr-3 text-purple-400" />
          <span className="hidden md:inline font-semibold">Jam Rooms</span>
        </div>

        {/* Show room interface if in a room, otherwise show controls */}
        {isInRoom ? (
          <>
            <RoomInterface />
            <LiveJamControls />
          </>
        ) : (
          <EnhancedRoomControls />
        )}
      </div>

      {/* Library section */}
      <div className="flex-1 rounded-xl bg-black/40 backdrop-blur-sm border border-white/5 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-white px-2">
            <Library className="size-5 mr-3 text-purple-400" />
            <span className="hidden md:inline font-semibold">Your Library</span>
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
                  className="p-3 hover:bg-white/5 rounded-xl flex items-center gap-3 group cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                >
                  <img
                    src={album.imageUrl}
                    alt="Playlist img"
                    className="size-12 rounded-xl flex-shrink-0 object-cover shadow-lg"
                  />

                  <div className="flex-1 min-w-0 hidden md:block">
                    <p className="font-semibold truncate text-white group-hover:text-purple-300 transition-colors">
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
