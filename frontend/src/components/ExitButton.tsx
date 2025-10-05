import { Button } from "@/components/ui/button";
import { DoorOpen } from "lucide-react";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";

const ExitButton = () => {
  const { isInRoom, leaveRoom } = useEnhancedRoomStore();

  if (!isInRoom || !leaveRoom) return null;

  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-white bg-red-600/5 hover:bg-red-600/15"
      onClick={() => leaveRoom && leaveRoom()}
      title="Leave room"
    >
      <DoorOpen className="w-4 h-4 text-red-400" />
      <span className="ml-2 hidden md:inline">Exit Room</span>
    </Button>
  );
};

export default ExitButton;
