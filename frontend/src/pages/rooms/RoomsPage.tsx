import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import RoomInterface from "@/components/RoomInterface";
import EnhancedRoomControls from "@/components/EnhancedRoomControls";
import { Button } from "@/components/ui/button";
import { DoorOpen, Users, Music } from "lucide-react";
import ActivityBar from "@/components/ActivityBar";
import LiveJamControls from "@/components/LiveJamControls";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";

const RoomsPage = () => {
  const { isInRoom, currentRoom, leaveRoom } = useEnhancedRoomStore();
  const [tab, setTab] = useState<"room" | "activity">("room");
  const [showHint, setShowHint] = useState(true);
  const [catAnimation, setCatAnimation] = useState<any>(null);

  // Load animation data
  useEffect(() => {
    fetch('/8-bit-cat.json')
      .then(res => res.json())
      .then(data => setCatAnimation(data))
      .catch(err => console.error('Failed to load animation:', err));
  }, []);

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
                  
                  {/* Mobile Preview Section - Enhanced Visual */}
                  <div className="mt-6 mb-32 md:hidden">
                    <div className="relative rounded-2xl overflow-hidden border border-red-500/20 bg-gradient-to-br from-zinc-900/80 to-black shadow-2xl shadow-red-500/10">
                      <div className="p-6 space-y-6">
                        {/* 8-bit Cat Animation */}
                        <div className="flex justify-center">
                          <div className="w-48 h-48">
                            {catAnimation ? (
                              <Lottie 
                                animationData={catAnimation} 
                                loop={true}
                                autoplay={true}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Music className="w-16 h-16 text-red-500/50 animate-pulse" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quote */}
                        <div className="text-center space-y-3">
                          <h3 className="text-2xl font-bold bg-white bg-clip-text text-transparent">
                            Join a Room
                          </h3>
                          <p className="text-base text-zinc-300 leading-relaxed px-4 italic">
                            "Music sounds better when we listen together"
                          </p>
                          <p className="text-sm text-zinc-500 px-6">
                            Create or join a room above to start your live jam session
                          </p>
                        </div>

                        {/* Call to Action Hint */}
                        <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                          <span>Enter a room code or create your own room</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
