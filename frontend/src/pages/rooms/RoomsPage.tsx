import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import RoomInterface from "@/components/RoomInterface";
import EnhancedRoomControls from "@/components/EnhancedRoomControls";
import { Button } from "@/components/ui/button";
import { DoorOpen, Users, Music } from "lucide-react";
import ActivityBar from "@/components/ActivityBar";
import LiveJamControls from "@/components/LiveJamControls";
import { useState } from "react";

const RoomsPage = () => {
  const { isInRoom, currentRoom, leaveRoom } = useEnhancedRoomStore();
  const [tab, setTab] = useState<"room" | "activity">("room");
  const [showHint, setShowHint] = useState(true);

  return (
    <main className="min-h-screen rounded-2xl overflow-hidden bg-black/95 backdrop-blur-xl border border-white/5 shadow-2xl flex flex-col mb-32 md:mb-0">
      <Topbar />

      <div className="px-4 pt-3 pb-2">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Rooms</h2>
          <div className="flex items-center gap-2">
            {isInRoom && currentRoom ? (
              <>
                <span className="text-sm text-red-300/80 truncate max-w-[140px]">
                  {currentRoom.name}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white bg-red-600/5 hover:bg-red-600/15"
                  onClick={() => leaveRoom && leaveRoom()}
                  title="Leave room"
                >
                  <DoorOpen className="w-4 h-4 text-red-400" />
                  <span className="ml-2 hidden sm:inline">Leave</span>
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-3 sm:p-6 md:p-8 mx-auto max-w-3xl">
          <div className="rounded-2xl overflow-hidden bg-black/40 backdrop-blur-sm border border-white/10">
            <div className="p-3 sm:p-4">
              {/* Tabs: Room / Activity */}
              {isInRoom ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-1 bg-zinc-900/50 rounded-xl border border-white/5">
                    <button
                      onClick={() => setTab("room")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        tab === "room" 
                          ? "bg-red-600/20 text-white border border-red-500/30" 
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Music className="w-4 h-4" />
                      <span className="text-sm font-medium">Room</span>
                    </button>
                    <button
                      onClick={() => setTab("activity")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        tab === "activity" 
                          ? "bg-red-600/20 text-white border border-red-500/30" 
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">Activity</span>
                    </button>
                  </div>

                  {/* Mobile-only short description for using the room */}
                  {tab === "room" && showHint && (
                    <div className="block sm:hidden bg-zinc-900/60 border border-white/10 p-4 rounded-xl relative">
                      <button
                        aria-label="Dismiss"
                        onClick={() => setShowHint(false)}
                        className="absolute top-3 right-3 text-zinc-400 hover:text-white transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
                      >
                        ✕
                      </button>

                      <p className="text-sm font-semibold text-white mb-2">
                        💡 How this room works
                      </p>
                      <p className="text-xs text-zinc-300 leading-relaxed pr-6">
                        The host controls playback — when the host plays or
                        seeks, everyone syncs. Tap the play button to play/pause
                        and open the full player for more controls. Use the
                        Activity tab to see who's listening. Leave anytime via
                        the Exit button in the topbar.
                      </p>
                    </div>
                  )}

                  {tab === "room" ? (
                    <>
                      <RoomInterface />
                      <LiveJamControls />
                    </>
                  ) : (
                    <div className="rounded-xl border border-white/5 overflow-hidden" style={{ height: 'calc(100vh - 300px)', minHeight: '400px' }}>
                      <ActivityBar />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <EnhancedRoomControls />
                </>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default RoomsPage;
