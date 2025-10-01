import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import AudoraLogo from "./AudoraLogo";

const Topbar = () => {
  const { isAdmin } = useAuthStore();

  return (
    <div className="flex items-center justify-between p-6 sticky top-0 bg-black/40 backdrop-blur-xl border-b border-white/10 z-10">
      <AudoraLogo size="md" />
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link
            to={"/admin"}
            className={cn(
              buttonVariants({
                variant: "outline",
                className:
                  "border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200 transition-all duration-200 rounded-xl",
              })
            )}
          >
            <LayoutDashboardIcon className="size-4 mr-2" />
            Admin Dashboard
          </Link>
        )}

        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>

        <UserButton />
      </div>
    </div>
  );
};
export default Topbar;
