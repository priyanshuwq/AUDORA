import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRoomStore } from "@/stores/useRoomStore";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { Plus, DoorOpen, Loader2 } from "lucide-react";
import { useState } from "react";

const RoomControls = () => {
  const { user, isSignedIn } = useUser();
  const { createRoom, joinRoom, isLoading, initSocket, isConnected } =
    useRoomStore();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = async () => {
    if (!user || !roomName.trim()) return;

    if (!isConnected) {
      initSocket();
      // Wait a bit for connection
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const code = await createRoom(
      roomName.trim(),
      user.id,
      user.fullName || "Unknown"
    );
    if (code) {
      setCreateDialogOpen(false);
      setRoomName("");
    }
  };

  const handleJoinRoom = async () => {
    if (!user || !roomCode.trim()) return;

    if (!isConnected) {
      initSocket();
      // Wait a bit for connection
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const success = await joinRoom(
      roomCode.trim(),
      user.id,
      user.fullName || "Unknown"
    );
    if (success) {
      setJoinDialogOpen(false);
      setRoomCode("");
    }
  };

  if (!isSignedIn) {
    return (
      <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center shadow-xl">
        <div className="space-y-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto">
            <DoorOpen className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Join Jam Rooms</h3>
            <p className="text-zinc-400 text-xs mt-1">
              Login to create or join rooms and jam with others
            </p>
          </div>
          <SignInButton mode="modal">
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-medium rounded-xl shadow-lg"
            >
              Login to Join Rooms
            </Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Create Room Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-200 rounded-xl"
            onClick={() => !isConnected && initSocket()}
          >
            <Plus className="mr-3 size-4 text-purple-400" />
            <span className="hidden md:inline font-medium">Create Room</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gradient-to-br from-[#1C1B29] to-[#0D0C1D] border border-white/20 rounded-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold">
              Create Jam Room
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Room Name
              </label>
              <Input
                placeholder="Enter room name..."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="bg-black/30 border-white/20 text-white placeholder:text-zinc-500 rounded-xl focus:border-purple-500/50"
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="flex-1 border-white/20 hover:bg-white/10 rounded-xl"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateRoom}
                disabled={!roomName.trim() || isLoading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Room"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Join Room Dialog */}
      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-200 rounded-xl"
            onClick={() => !isConnected && initSocket()}
          >
            <DoorOpen className="mr-3 size-4 text-purple-400" />
            <span className="hidden md:inline font-medium">Join Room</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gradient-to-br from-[#1C1B29] to-[#0D0C1D] border border-white/20 rounded-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold">
              Join Jam Room
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Room Code
              </label>
              <Input
                placeholder="Enter 4-digit code..."
                value={roomCode}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 4);
                  setRoomCode(value);
                }}
                className="bg-black/30 border-white/20 text-white text-center text-lg tracking-wider placeholder:text-zinc-500 rounded-xl focus:border-purple-500/50"
                disabled={isLoading}
                maxLength={4}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setJoinDialogOpen(false)}
                className="flex-1 border-white/20 hover:bg-white/10 rounded-xl"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleJoinRoom}
                disabled={roomCode.length !== 4 || isLoading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 rounded-xl shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Room"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomControls;
