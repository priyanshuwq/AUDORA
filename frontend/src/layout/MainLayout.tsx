import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import BottomNavigation from "@/components/BottomNavigation";
import ActivityBar from "@/components/ActivityBar";
import MobileActivityDialog from "@/components/MobileActivityDialog";
import DebugPanel from "@/components/DebugPanel";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, X } from "lucide-react";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isActivityBarVisible, setIsActivityBarVisible] = useState(true);
  const { isInRoom, joinedUsers } = useEnhancedRoomStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-show Activity Bar when someone enters the room
  useEffect(() => {
    if (isInRoom && joinedUsers.length > 0) {
      setIsActivityBarVisible(true);
    }
  }, [isInRoom, joinedUsers.length]);

  return (
    <div className="h-screen bg-gradient-to-br from-[#0D0C1D] via-[#161526] to-[#1C1B29] text-white flex flex-col overflow-hidden animate-fadeInUp">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 flex h-full overflow-hidden p-1 md:p-2 min-h-0"
      >
        <AudioPlayer />
        {/* left sidebar */}
        <ResizablePanel
          defaultSize={isMobile ? 0 : 20}
          minSize={isMobile ? 0 : 15}
          maxSize={isMobile ? 0 : 30}
          className={isMobile ? "hidden" : "animate-slideInFromLeft"}
        >
          <LeftSidebar />
        </ResizablePanel>

        {!isMobile && (
          <ResizableHandle className="w-1 md:w-2 bg-gradient-to-b from-purple-500/20 via-black/20 to-pink-500/20 rounded-lg transition-all duration-300 hover:bg-gradient-to-b hover:from-purple-500/40 hover:to-pink-500/40 hover:w-3" />
        )}

        {/* Main content */}
        <ResizablePanel
          defaultSize={
            isMobile ? 100 : isInRoom && isActivityBarVisible ? 50 : 70
          }
          className="animate-fadeInUp h-full relative"
        >
          <Outlet />

          {/* Activity Bar Toggle Button - Show when in room but activity bar is hidden */}
          {isInRoom && !isActivityBarVisible && !isMobile && (
            <Button
              onClick={() => setIsActivityBarVisible(true)}
              className="fixed top-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg animate-fadeInUp"
              size="sm"
            >
              <Users className="w-4 h-4" />
            </Button>
          )}
        </ResizablePanel>

        {/* Activity Bar - Show only when in room and visible */}
        {isInRoom && isActivityBarVisible && !isMobile && (
          <>
            <ResizableHandle className="w-1 md:w-2 bg-gradient-to-b from-purple-500/20 via-black/20 to-pink-500/20 rounded-lg transition-all duration-300 hover:bg-gradient-to-b hover:from-purple-500/40 hover:to-pink-500/40 hover:w-3" />
            <ResizablePanel
              defaultSize={30}
              minSize={25}
              maxSize={35}
              className="animate-slideInFromRight h-full relative"
            >
              {/* Close Button */}
              <Button
                onClick={() => setIsActivityBarVisible(false)}
                className="absolute top-2 right-2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity"
                size="sm"
                variant="ghost"
              >
                <X className="w-3 h-3" />
              </Button>
              <ActivityBar />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      {/* Mobile Activity Dialog */}
      {isMobile && <MobileActivityDialog />}

      {/* Controls */}
      <div className="animate-slideInFromTop">
        <PlaybackControls />
        <BottomNavigation />
      </div>

      {/* Debug Panel */}
      <DebugPanel />
    </div>
  );
};
export default MainLayout;
