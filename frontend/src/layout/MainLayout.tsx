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
import MobileFullscreenPlayer from "@/layout/components/MobileFullscreenPlayer";
import AlbumBackdrop from "@/components/AlbumBackdrop";

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
      {/* Album Cover Backdrop - Blurred background */}
      <AlbumBackdrop />
      
      <div className="h-screen bg-black/50 text-white flex flex-col overflow-hidden animate-fadeInUp mobile-safe-area relative z-10">
        <div className="flex-1 flex h-full overflow-hidden p-2 min-h-0 gap-2">
          <AudioPlayer />
          {/* left sidebar - fixed width */}
          {!isMobile && (
            <div className="w-64 flex-shrink-0 animate-slideInFromLeft">
              <LeftSidebar />
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 animate-fadeInUp h-full relative min-w-0">
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
          </div>

          {/* Activity Bar - Show only when in room and visible - fixed width */}
          {isInRoom && isActivityBarVisible && !isMobile && (
            <div className="w-[400px] flex-shrink-0 animate-slideInFromRight h-full relative">
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
            </div>
          )}
        </div>

        {/* Mobile Activity Dialog */}
        {isMobile && <MobileActivityDialog />}

        {/* Fullscreen Player overlay - Desktop version */}
        {!isMobile && <FullPlayer />}

        {/* Mobile Fullscreen Player - Spotify-style */}
        {isMobile && <MobileFullscreenPlayer />}

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
