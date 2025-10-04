import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon, Search } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import VinylLogo from "./VinylLogo";
import GlobalSearch from "./GlobalSearch";

const Topbar = () => {
  const { isAdmin } = useAuthStore();

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 sticky top-0 bg-black/40 backdrop-blur-xl border-b border-white/10 z-10">
      {/* Responsive Logo: smaller on mobile */}
      <div className="flex items-center">
        <div className="sm:hidden">
          <VinylLogo size="sm" syncWithPlayer={true} />
        </div>
        <div className="hidden sm:block">
          <VinylLogo size="md" syncWithPlayer={true} />
        </div>
      </div>

      {/* Center search bar - hidden on small screens */}
      <div className="hidden md:flex flex-1 justify-center max-w-lg mx-8">
        <GlobalSearch variant="full" className="w-full" />
      </div>

      <div className="flex items-center gap-4">
        {/* Mobile Search Button */}
        <Link
          to="/browse"
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-white/20 text-zinc-300 hover:bg-white/5 hover:text-white hover:border-red-500/50 transition-all duration-200"
          aria-label="Search Music"
          title="Search Music"
        >
          <Search className="size-4" />
        </Link>

        {isAdmin && (
          <>
            {/* Compact icon-only on small screens */}
            <Link
              to={"/admin"}
              className={cn(
                "md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-red-500/50 text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200 shadow-[0_0_10px_rgba(255,0,51,0.25)] hover:shadow-[0_0_14px_rgba(255,0,51,0.45)]"
              )}
              aria-label="Admin Dashboard"
              title="Admin Dashboard"
            >
              <LayoutDashboardIcon className="size-4" />
            </Link>
            {/* Full button on md+ */}
            <Link
              to={"/admin"}
              className={cn(
                "hidden md:inline-flex",
                buttonVariants({
                  variant: "outline",
                  className:
                    "border-red-500/50 text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200 rounded-md shadow-[0_0_10px_rgba(255,0,51,0.25)] hover:shadow-[0_0_14px_rgba(255,0,51,0.45)]",
                })
              )}
            >
              <LayoutDashboardIcon className="size-4 mr-2" />
              Admin Dashboard
            </Link>
          </>
        )}

        <SignedOut>
          {/* Hide large auth buttons on very small screens to avoid crowding */}
          <div className="hidden sm:block">
            <SignInOAuthButtons />
          </div>
        </SignedOut>

        <UserButton />
      </div>
    </div>
  );
};
export default Topbar;
