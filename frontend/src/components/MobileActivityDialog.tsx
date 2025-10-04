import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import { Users } from "lucide-react";
import ActivityBar from "./ActivityBar";

const MobileActivityDialog = () => {
  const { isInRoom, joinedUsers } = useEnhancedRoomStore();

  if (!isInRoom) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="md:hidden fixed top-4 right-4 z-50 bg-black/20 backdrop-blur-sm border border-white/10 text-white hover:bg-red-500/15"
        >
          <Users className="w-4 h-4 mr-2" />
          {joinedUsers.length}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border border-white/10 rounded-2xl backdrop-blur-xl max-w-full h-[90vh] w-full p-0">
        <DialogHeader className="p-4 border-b border-white/10">
          <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-red-400" />
            Live Activity
          </DialogTitle>
        </DialogHeader>
        <div className="h-full overflow-hidden">
          <ActivityBar />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileActivityDialog;
