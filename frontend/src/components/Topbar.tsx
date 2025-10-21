import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import VinylLogo from "./VinylLogo";
import ExitButton from "./ExitButton";
// GlobalSearch removed from Topbar per request

const Topbar = () => {
  const { isAdmin } = useAuthStore();

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 sticky top-0 bg-black/50/40 backdrop-blur-xl z-10">
      {/* Responsive Logo: smaller on mobile */}
      <div className="flex items-center">
        <div className="sm:hidden">
          <VinylLogo size="sm" syncWithPlayer={true} textColor="text-red-600" />
        </div>
        <div className="hidden sm:block">
          <VinylLogo size="md" syncWithPlayer={true} textColor="text-red-600" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:inline-flex">
          <ExitButton />
        </div>
        
        {isAdmin && (
          <>
            {/* Admin button with icon on mobile, full button on desktop */}
            <Link
              to={"/admin"}
              role="button"
              aria-label="Open admin dashboard"
              className={cn(
                "inline-flex items-center gap-2 rounded-full p-2 md:px-3 md:py-1.5",
                "bg-black/30 backdrop-blur-sm text-red-200 hover:text-red-50",
                "transition-transform duration-200 ease-out transform hover:scale-105",
                "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                "shadow-sm hover:shadow-[0_8px_24px_rgba(239,68,68,0.12)]"
              )}
            >
              <div className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-red-600/15 to-transparent">
                <LayoutDashboardIcon className="h-4 w-4" />
              </div>
              <span className="hidden md:block truncate text-sm font-medium">Admin</span>
            </Link>
          </>
        )}

        <SignedOut>
          {/* Mobile: compact OAuth icon button; Desktop: full OAuth button */}
          <div className="sm:hidden mr-2">
            <SignInOAuthButtons compact />
          </div>

          <div className="hidden sm:block">
            <SignInOAuthButtons />
          </div>
        </SignedOut>

        {/* User profile button - visible on all screen sizes when signed in */}
        <div className="inline-flex">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 md:w-10 md:h-10",
                userButtonPopoverCard: "bg-zinc-900 border-zinc-800",
                userButtonPopoverActionButton: "hover:bg-zinc-800",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Topbar;
