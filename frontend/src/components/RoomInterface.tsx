import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import { useUser } from "@clerk/clerk-react";
import { Music, Play, Pause, Loader2 } from "lucide-react";
import ScrollingText from "./ScrollingText";
import { formatTimeAgo } from "@/lib/formatters";

const RoomInterface = () => {
  const { user } = useUser();
  const { currentRoom, joinedUsers, isInRoom, isLoading, error, clearError } =
    useEnhancedRoomStore();

  if (!isInRoom || !currentRoom) return null;

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-4 shadow-xl">
      {/* Room Members */}
      <div className="mb-4">
        <h3 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          Members ({joinedUsers.length})
        </h3>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-red-400 text-sm">{error}</span>
            <Button size="sm" variant="ghost" onClick={clearError}>
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Users List */}
      <ScrollArea className="max-h-64">
        <div className="space-y-2">
          {joinedUsers.map((roomUser) => (
            <div
              key={roomUser.user._id}
              className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors border border-white/5"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {roomUser.user.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white text-sm font-medium truncate">
                    {roomUser.user.fullName}
                  </span>
                  {roomUser.user._id === user?.id && (
                    <span className="text-xs text-blue-400 flex-shrink-0">(You)</span>
                  )}
                </div>
                {roomUser.currentSong ? (
                  <div className="flex items-start gap-2">
                    <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                      {roomUser.isPlaying ? (
                        <Play className="w-3 h-3 text-green-400" />
                      ) : (
                        <Pause className="w-3 h-3 text-zinc-400" />
                      )}
                      <Music className="w-3 h-3 text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <ScrollingText 
                        text={roomUser.currentSong.title}
                        className="text-xs text-zinc-300"
                      />
                      <p className="text-xs text-zinc-500 truncate mt-0.5">
                        {roomUser.currentSong.artist}
                      </p>
                    </div>
                    <span className="text-xs text-zinc-500 flex-shrink-0">
                      {formatTimeAgo(roomUser.timestamp)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-zinc-500">
                    Not playing anything
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
          <span className="ml-2 text-zinc-400 text-sm">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default RoomInterface;
