import { cn } from "@/lib/utils";
import { Home, Search, Library, Radio } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { usePlayerStore } from "@/stores/usePlayerStore";

const BottomNavigation = () => {
  const location = useLocation();
  const { isFullscreenPlayer } = usePlayerStore();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Browse", path: "/browse" },
    { icon: Radio, label: "Rooms", path: "/rooms" },
    { icon: Library, label: "Library", path: "/library" },
  ];

  if (isFullscreenPlayer) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      {/* Black gradient shadow overlay - Try these different options: */}
      
      {/* Option 1: Current - Strong shadow */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" /> */}
      
      {/* Option 2: Medium shadow - Uncomment to test */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />
      
      {/* Option 3: Light shadow - Uncomment to test */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" /> */}
      
      {/* Option 4: Very light shadow - Uncomment to test */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" /> */}
      
      {/* Option 5: Extra strong shadow (more Spotify-like) - Uncomment to test */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none" /> */}
      
      {/* Option 6: Shorter shadow - Uncomment to test */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" /> */}
      
      {/* Navigation bar - Fully transparent with white icons */}
      <div className="relative bg-transparent px-2 py-2 pb-safe">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 transition-all duration-200 min-w-[70px]"
                )}
              >
                <Icon className={cn(
                  "size-6 transition-colors",
                  isActive ? "text-white" : "text-zinc-400"
                )} />
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-white" : "text-zinc-400"
                )}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
