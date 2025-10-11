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
            {/* Replace small admin icon with mobile account button (UserButton) */}
            <div className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md">
              <UserButton />
            </div>

            {/* Sleeker Admin button on md+ */}
            <Link
              to={"/admin"}
              role="button"
              aria-label="Open admin dashboard"
              className={cn(
                "hidden md:inline-flex items-center gap-2",
                // Sleek pill: subtle glassy background, red accent on hover, scale and shadow for affordance
                "rounded-full px-3 py-1.5 bg-black/30 backdrop-blur-sm text-red-200 hover:text-red-50 transition-transform duration-200 ease-out transform hover:scale-105",
                "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                "shadow-sm hover:shadow-[0_8px_24px_rgba(239,68,68,0.12)]"
              )}
            >
              <div className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-red-600/15 to-transparent">
                <LayoutDashboardIcon className="h-4 w-4" />
              </div>
              <span className="truncate text-sm font-medium">Admin</span>
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

        {/* Desktop account button (hidden on mobile to avoid duplicate) */}
        <div className="hidden md:inline-flex">
          <UserButton />
        </div>
      </div>
    </div>
  );
};
export default Topbar;
