import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import { useUser } from "@clerk/clerk-react";
import { Copy, LogOut, Music, Play, Pause, Loader2, Crown } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const RoomInterface = () => {
  const { user } = useUser();
  const {
    currentRoom,
    joinedUsers,
    isInRoom,
    isLoading,
    error,
    leaveRoom,
    clearError,
    isJamSession,
    isJamHost,
  } = useEnhancedRoomStore();

  const [showRoomCode, setShowRoomCode] = useState(false);

  if (!isInRoom || !currentRoom) return null;

  const copyRoomCode = () => {
    navigator.clipboard.writeText(currentRoom.code);
    toast.success("Room code copied!");
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-4 shadow-xl">
      {/* Room Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full animate-pulse shadow-lg ${
              isJamSession
                ? "bg-gradient-to-r from-red-400 to-orange-400"
                : "bg-gradient-to-r from-purple-400 to-pink-400"
            }`}
          ></div>
          <span className="text-white font-semibold">{currentRoom.name}</span>
          {isJamSession && (
            <div className="flex items-center gap-1 bg-red-500/20 px-2 py-1 rounded-full">
              <span className="text-red-400 text-xs font-medium">LIVE JAM</span>
            </div>
          )}
          {isJamHost && (
            <div className="flex items-center gap-1 bg-yellow-500/20 px-1 py-1 rounded-full">
              <Crown className="w-3 h-3 text-yellow-400" />
            </div>
          )}
          <span className="text-purple-300 text-sm font-medium">
            ({joinedUsers.length} {isJamSession ? "jamming" : "listening"})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowRoomCode(!showRoomCode)}
            className="text-xs border-purple-500/50 text-purple-300 hover:bg-purple-500/20 rounded-xl"
          >
            Code: {showRoomCode ? currentRoom.code : "****"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={copyRoomCode}
            className="hover:bg-white/10 rounded-xl"
          >
            <Copy className="w-3 h-3 text-purple-400" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={leaveRoom}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl"
          >
            <LogOut className="w-3 h-3" />
          </Button>
        </div>
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
              <img
                src={roomUser.user.imageUrl}
                alt={roomUser.user.fullName}
                className="w-8 h-8 rounded-full"
              />
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
                      <Music className="w-3 h-3 text-blue-400" />
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
