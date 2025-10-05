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
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, X } from "lucide-react";
import FullPlayer from "./components/FullPlayer";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    <>
      <div className="h-screen bg-zinc-950 text-white flex flex-col overflow-hidden animate-fadeInUp mobile-safe-area">
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 flex h-full overflow-hidden p-1 md:p-2 min-h-0"
        >
          <AudioPlayer />
          {/* left sidebar */}
          {!isMobile && (
            <ResizablePanel
              defaultSize={20}
              minSize={15}
              maxSize={30}
              className="animate-slideInFromLeft"
            >
              <LeftSidebar />
            </ResizablePanel>
          )}

          {!isMobile && (
            <ResizableHandle className="w-1 md:w-2 bg-red-500/10 rounded-lg transition-all duration-300 hover:bg-red-500/25 hover:w-3" />
          )}

          {/* Main content */}
          <ResizablePanel
            defaultSize={
              isMobile ? 100 : isInRoom && isActivityBarVisible ? 50 : 80
            }
            minSize={isMobile ? 100 : 40}
            className="animate-fadeInUp h-full relative"
          >
            <Outlet />

            {/* Activity Bar Toggle Button - Show when in room but activity bar is hidden */}
            {isInRoom && !isActivityBarVisible && !isMobile && (
              <Button
                onClick={() => setIsActivityBarVisible(true)}
                className="fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-500 text-white rounded-full p-3 shadow-[0_0_10px_rgba(255,0,51,0.35)] animate-fadeInUp"
                size="sm"
              >
                <Users className="w-4 h-4" />
              </Button>
            )}
          </ResizablePanel>

          {/* Activity Bar - Show only when in room and visible */}
          {isInRoom && isActivityBarVisible && !isMobile && (
            <>
              <ResizableHandle className="w-1 md:w-2 bg-red-500/10 rounded-lg transition-all duration-300 hover:bg-red-500/25 hover:w-3" />
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

        {/* Fullscreen Player overlay */}
        <FullPlayer />

        {/* Playback Controls - positioned above bottom nav on mobile */}
        <div className="animate-slideInFromTop">
          <PlaybackControls />
        </div>

        {/* Bottom Navigation - separate for proper stacking */}
        <BottomNavigation />
      </div>
      {/* Mobile Sidebar Drawer */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-xs bg-zinc-950 shadow-2xl animate-slideInFromLeft">
            <div className="absolute top-2 right-2 z-10">
              <Button
                onClick={() => setIsSidebarOpen(false)}
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="h-full overflow-y-auto p-3">
              <LeftSidebar />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default MainLayout;
