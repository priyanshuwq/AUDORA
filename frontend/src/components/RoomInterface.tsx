import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import { useUser } from "@clerk/clerk-react";
import { Music, Play, Pause, Loader2 } from "lucide-react";

const RoomInterface = () => {
  const { user } = useUser();
  const { currentRoom, joinedUsers, isInRoom, isLoading, error, clearError } =
    useEnhancedRoomStore();

  if (!isInRoom || !currentRoom) return null;

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

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
              className="flex items-center gap-3 p-2 rounded-md bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xs font-bold">
                {roomUser.user.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium truncate">
                    {roomUser.user.fullName}
                  </span>
                  {roomUser.user._id === user?.id && (
                    <span className="text-xs text-blue-400">(You)</span>
                  )}
                </div>
                {roomUser.currentSong ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {roomUser.isPlaying ? (
                        <Play className="w-3 h-3 text-green-400" />
                      ) : (
                        <Pause className="w-3 h-3 text-zinc-400" />
                      )}
                      <Music className="w-3 h-3 text-red-400" />
                    </div>
                    <span className="text-xs text-zinc-300 truncate">
                      {roomUser.currentSong.title} -{" "}
                      {roomUser.currentSong.artist}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {formatTime(roomUser.timestamp)}
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
