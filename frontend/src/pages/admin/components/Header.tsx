import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import AudoraLogo from "@/components/AudoraLogo";

const Header = () => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Link to="/" className="rounded-lg">
          <AudoraLogo size="lg" showText={false} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">AUDORA Manager</h1>
          <p className="text-zinc-400 mt-1">Manage your AUDORA music catalog</p>
        </div>
      </div>
      <div className="w-full sm:w-auto flex justify-end">
        <UserButton />
      </div>
    </div>
  );
};
export default Header;
