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
    <main className="min-h-screen rounded-none sm:rounded-xl overflow-hidden bg-zinc-950/90 backdrop-blur-sm flex flex-col mb-32 md:mb-0">
      <Topbar />

      <div className="px-4 pt-3 pb-2">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Rooms</h2>
          {isInRoom && currentRoom ? (
            <div className="flex items-center gap-2">
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
            </div>
          ) : null}
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8 mx-auto max-w-3xl">
          <div className="rounded-2xl overflow-hidden bg-neutral-900/60 backdrop-blur-sm">
            <div className="p-3">
              {/* Tabs: Room / Activity */}
              {isInRoom ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => setTab("room")}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-150 ${
                        tab === "room" ? "bg-white/6" : "hover:bg-white/3"
                      }`}
                    >
                      <Music className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-white">Room</span>
                    </button>
                    <button
                      onClick={() => setTab("activity")}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-150 ${
                        tab === "activity" ? "bg-white/6" : "hover:bg-white/3"
                      }`}
                    >
                      <Users className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-white">Activity</span>
                    </button>
                  </div>

                  {/* Mobile-only short description for using the room */}
                  {tab === "room" && showHint && (
                    <div className="block sm:hidden bg-neutral-900/60 border border-white/8 p-3 rounded-lg relative">
                      <button
                        aria-label="Dismiss"
                        onClick={() => setShowHint(false)}
                        className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-200"
                      >
                        ✕
                      </button>

                      <p className="text-sm font-semibold text-white">
                        How this room works
                      </p>
                      <p className="mt-1 text-xs text-zinc-300">
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
                    <div>
                      <ActivityBar />
                    </div>
                  )}
                </div>
              ) : (
                <EnhancedRoomControls />
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default RoomsPage;
