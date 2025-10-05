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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 z-40">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200",
                isActive
                  ? "text-red-400 bg-red-500/15"
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("size-5", isActive && "text-red-400")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
