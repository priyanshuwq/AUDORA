import { useEffect, useState } from "react";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import { Music, Play, Pause, Users, Headphones, Wifi } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface UserActivity {
  id: string;
  name: string;
  avatar: string;
  currentSong: {
    title: string;
    artist: string;
    imageUrl: string;
  } | null;
  isPlaying: boolean;
  timestamp: number;
  isInSameRoom: boolean;
}

const ActivityBar = () => {
  const { joinedUsers, currentRoom, isConnected, socket } =
    useEnhancedRoomStore();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");

  useEffect(() => {
    // Monitor connection status
    if (socket?.connected) {
      setConnectionStatus("connected");
    } else if (socket) {
      setConnectionStatus("connecting");
    } else {
      setConnectionStatus("disconnected");
    }
  }, [socket, isConnected]);

  useEffect(() => {
    if (currentRoom && joinedUsers.length > 0) {
      const roomActivities = joinedUsers.map((user) => ({
        id: user.user._id,
        name: user.user.fullName,
        avatar: user.user.imageUrl || "/default-avatar.png",
        currentSong: user.currentSong,
        isPlaying: user.isPlaying,
        timestamp: user.timestamp,
        isInSameRoom: true,
      }));
      setActivities(roomActivities);
    } else {
      setActivities([]);
    }
  }, [joinedUsers, currentRoom]);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 60) return "now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    return `${Math.floor(diff / 3600)}h`;
  };

  if (!currentRoom) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-[#1C1B29]/90 to-[#0D0C1D]/90 backdrop-blur-xl border-l border-white/10 flex flex-col animate-slideInFromRight">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold text-lg flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-400" />
              <span>Activity</span>
            </h2>
            <div
              className={cn(
                "flex items-center gap-2",
                connectionStatus === "connected"
                  ? "text-green-400"
                  : connectionStatus === "connecting"
                  ? "text-yellow-400"
                  : "text-red-400"
              )}
            >
              <Wifi
                className={cn(
                  "w-3 h-3 md:w-4 md:h-4",
                  connectionStatus === "connecting" && "animate-pulse"
                )}
              />
              <span className="text-xs font-medium">
                {connectionStatus === "connected"
                  ? "Online"
                  : connectionStatus === "connecting"
                  ? "Connecting..."
                  : "Offline"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 min-h-0">
          <div className="text-center space-y-6 animate-fadeInUp max-w-xs">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto animate-float">
              <Headphones className="w-8 h-8 text-purple-400" />
            </div>
            <div className="space-y-3">
              <p className="text-white font-medium text-base">
                No Active Sessions
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {connectionStatus === "connected"
                  ? "Create or join a room to see live activity"
                  : connectionStatus === "connecting"
                  ? "Connecting to server..."
                  : "Connection lost. Check your internet."}
              </p>
              {connectionStatus === "connected" && (
                <div className="text-xs text-purple-300 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20 text-left">
                  <span className="block">
                    💡 <strong>Tip:</strong>
                  </span>
                  <span className="block mt-1">
                    Create a room in the sidebar to start jamming with friends!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-[#1C1B29]/90 to-[#0D0C1D]/90 backdrop-blur-xl border-l border-white/10 flex flex-col animate-slideInFromRight">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold text-lg flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-400" />
              <span>Activity</span>
            </h2>
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Online</span>
            </div>
          </div>
        </div>

        {/* Room Info */}
        {currentRoom && (
          <div className="p-4 border-b border-white/10 animate-fadeInUp">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30 animate-glow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-300 font-medium text-sm">
                  {currentRoom.isJamSession ? "JAM ROOM" : "MUSIC ROOM"}
                </span>
              </div>
              <p className="text-white font-semibold text-base truncate mb-2">
                {currentRoom.name}
              </p>
              <p className="text-zinc-300 text-sm flex items-center gap-2">
                <span>Code:</span>
                <span className="font-mono bg-black/30 px-2 py-1 rounded text-xs">
                  {currentRoom.code}
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center p-6 min-h-0">
          <div className="text-center space-y-6 animate-fadeInUp max-w-xs">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto animate-float">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <div className="space-y-3">
              <p className="text-white font-medium text-base">
                Waiting for Others
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                You're alone in this room. Share the room code with friends to
                see their activity!
              </p>
              <div className="text-xs text-purple-300 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20 text-left">
                <span className="block">
                  🎵 <strong>Share:</strong>
                </span>
                <span className="block mt-1">
                  Invite friends with code: <strong>{currentRoom?.code}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#1C1B29]/90 to-[#0D0C1D]/90 backdrop-blur-xl border-l border-white/10 flex flex-col animate-slideInFromRight">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-base md:text-lg flex items-center gap-2">
            <Users className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
            <span className="hidden sm:inline">Activity</span>
          </h2>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                connectionStatus === "connected"
                  ? "bg-green-400 animate-pulse"
                  : connectionStatus === "connecting"
                  ? "bg-yellow-400 animate-pulse"
                  : "bg-red-400"
              )}
            ></div>
            <span
              className={cn(
                "text-xs md:text-sm font-medium",
                connectionStatus === "connected"
                  ? "text-green-400"
                  : connectionStatus === "connecting"
                  ? "text-yellow-400"
                  : "text-red-400"
              )}
            >
              {activities.length} in room
            </span>
          </div>
        </div>
      </div>

      {/* Room Info */}
      {currentRoom && (
        <div className="p-4 border-b border-white/10 animate-fadeInUp">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30 animate-glow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-purple-300 font-medium text-sm">
                {currentRoom.isJamSession ? "JAM ROOM" : "MUSIC ROOM"}
              </span>
            </div>
            <p className="text-white font-semibold text-base truncate mb-2">
              {currentRoom.name}
            </p>
            <p className="text-zinc-300 text-sm flex items-center gap-2">
              <span>Code:</span>
              <span className="font-mono bg-black/30 px-2 py-1 rounded text-xs">
                {currentRoom.code}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Activities List */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4 min-h-full">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="opacity-0 animate-fadeInUp"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "forwards",
              }}
            >
              <div className="bg-black/30 rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={activity.avatar || "/default-avatar.png"}
                      alt={activity.name}
                      className="w-10 h-10 rounded-full border-2 border-purple-500/30 hover:border-purple-500/50 transition-colors"
                      onError={(e) => {
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                    />
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1C1B29]",
                        activity.isPlaying
                          ? "bg-green-400 animate-pulse"
                          : "bg-zinc-500"
                      )}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {activity.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-purple-300">In your room</span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-zinc-500">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>{" "}
                {/* Current Song */}
                {activity.currentSong ? (
                  <div
                    className={`bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20 ${
                      activity.isPlaying ? "animate-pulseSubtle" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={activity.currentSong.imageUrl}
                        alt="Song cover"
                        className="w-12 h-12 rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {activity.isPlaying ? (
                            <div className="animate-spin">
                              <Play className="w-3 h-3 text-green-400" />
                            </div>
                          ) : (
                            <Pause className="w-3 h-3 text-zinc-400" />
                          )}
                          <Music className="w-3 h-3 text-purple-400" />
                        </div>
                        <p className="text-white text-sm font-medium truncate leading-tight">
                          {activity.currentSong.title}
                        </p>
                        <p className="text-zinc-400 text-xs truncate mt-1">
                          by {activity.currentSong.artist}
                        </p>
                      </div>
                    </div>

                    {activity.isPlaying && (
                      <div className="flex justify-center">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1 h-4 bg-gradient-to-t from-purple-500 to-pink-400 rounded-full animate-musicBar"
                              style={{ animationDelay: `${i * 100}ms` }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-3 text-zinc-500">
                      <Music className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">Not playing anything</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ActivityBar;
