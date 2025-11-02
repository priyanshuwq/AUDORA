import { useEffect, useState } from "react";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import {
  Music,
  Play,
  Pause,
  Users,
  Headphones,
  Wifi,
  Copy,
  LogOut,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import LiveJamControls from "./LiveJamControls";
import ScrollingText from "./ScrollingText";

interface UserActivity {
  id: string;
  name: string;
  avatar?: string; // Make avatar optional since we're not using it
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
        avatar: "", // Remove avatar since we can't fetch from Clerk
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
      <div className="w-full h-full rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col animate-slideInFromRight overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold text-lg flex items-center gap-3">
              <Users className="w-5 h-5 text-red-400" />
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
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto animate-float">
              <Headphones className="w-8 h-8 text-red-400" />
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
                <div className="text-xs text-red-300 bg-red-500/10 rounded-lg p-3 border border-red-500/20 text-left">
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
      <div className="w-full h-full rounded-2xl bg-black backdrop-blur-xl border-none sm:border sm:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col animate-slideInFromRight overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold text-base md:text-lg flex items-center gap-2">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
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
          <div className="p-3 sm:p-4 border-b border-white/10 animate-fadeInUp">
          <div className="bg-black/40 rounded-2xl p-4 border border-white/5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-300 font-medium text-sm">
                  {currentRoom.isJamSession ? "JAM ROOM" : "MUSIC ROOM"}
                </span>
              </div>
              <p className="text-white font-semibold text-base truncate mb-2">
                {currentRoom.name}
              </p>
              <p className="text-zinc-300 text-sm flex items-center gap-2">
                <span>Code:</span>
                <span className="font-mono bg-black/40 px-2 py-1 rounded text-xs">
                  {currentRoom.code}
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center p-6 min-h-0">
          <div className="text-center space-y-6 animate-fadeInUp max-w-xs">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto animate-float border border-red-500/20">
              <Users className="w-10 h-10 text-red-400" />
            </div>
            <div className="space-y-4">
              <p className="text-white font-semibold text-lg">
                Waiting for Others
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                You're alone in this room. Share the room code with friends to
                see their activity!
              </p>
              <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-red-300 font-medium">🎵 SHARE CODE</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-zinc-400 text-xs">Code:</span>
                  <span className="font-mono bg-red-500/10 px-3 py-1.5 rounded-lg text-base font-bold text-white border border-red-500/20">
                    {currentRoom?.code}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-2xl bg-black backdrop-blur-xl border-none sm:border sm:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col animate-slideInFromRight overflow-hidden">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-base md:text-lg flex items-center gap-2">
            <Users className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
            <span>Activity</span>
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

      <ScrollArea className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Room Info & Controls */}
        {currentRoom && (
          <div className="p-3 sm:p-4 border-b border-white/10 animate-fadeInUp space-y-3">
          <div className="bg-black/40 rounded-2xl p-4 border border-white/5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-red-300 font-medium text-sm">
                {currentRoom.isJamSession ? "JAM ROOM" : "MUSIC ROOM"}
              </span>
            </div>
            <p className="text-white font-semibold text-base truncate mb-3">
              {currentRoom.name}
            </p>

            {/* Room Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-zinc-300 text-xs">Room Code:</span>
                <span className="font-mono bg-black/30 px-2 py-1 rounded text-xs text-white">
                  {currentRoom.code}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(currentRoom.code);
                    toast.success("Room code copied!");
                  }}
                  className="hover:bg-white/6 rounded-lg p-2"
                  title="Copy room code"
                >
                  <Copy className="w-3 h-3 text-zinc-200" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    // Get leaveRoom function from store
                    const { leaveRoom } = useEnhancedRoomStore.getState();
                    leaveRoom();
                  }}
                  className="text-zinc-200 hover:text-zinc-100 hover:bg-white/6 rounded-lg p-2"
                  title="Leave room"
                >
                  <LogOut className="w-3 h-3 text-zinc-200" />
                </Button>
              </div>
            </div>
          </div>

          {/* Jam Session Controls - Moved from Sidebar */}
          {currentRoom.isJamSession && (
            <div className="animate-fadeInUp">
              <LiveJamControls />
            </div>
          )}
        </div>
        )}

        {/* Activities List */}
        <div className="p-3 sm:p-4 space-y-3">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="opacity-0 animate-fadeInUp"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "forwards",
              }}
            >
              <div className="bg-black/40 rounded-2xl p-3 sm:p-4 border border-white/5 hover:border-white/10 transition-all duration-300 shadow-sm">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-sm font-bold border-2 border-red-500/30 hover:border-red-500/50 transition-colors">
                      {activity.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2) || "U"}
                    </div>
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-900",
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
                      <span className="text-red-300">In your room</span>
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
                    className={`bg-black/40 rounded-lg p-3 border border-white/5 ${
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
                        </div>
                        <ScrollingText 
                          text={activity.currentSong.title}
                          className="text-white text-sm font-medium leading-tight mb-1"
                        />
                        <ScrollingText 
                          text={`by ${activity.currentSong.artist}`}
                          className="text-zinc-400 text-xs"
                        />
                      </div>
                    </div>

                    {activity.isPlaying && (
                      <div className="flex justify-center">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1 h-4 bg-gradient-to-t from-zinc-500 to-zinc-300 rounded-full animate-musicBar"
                              style={{ animationDelay: `${i * 100}ms` }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-black/40 rounded-lg p-3 border border-white/5">
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
