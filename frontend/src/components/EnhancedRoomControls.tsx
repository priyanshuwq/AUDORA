import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { Plus, DoorOpen, Loader2, Radio, Music, Crown } from "lucide-react";
import { useState } from "react";

const EnhancedRoomControls = () => {
  const { user, isSignedIn } = useUser();
  const {
    createRoom,
    joinRoom,
    isLoading,
    initSocket,
    isConnected,
    currentRoom,
    isJamSession,
  } = useEnhancedRoomStore();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isJamRoom, setIsJamRoom] = useState(false);

  const handleCreateRoom = async () => {
    if (!user || !roomName.trim()) return;

    if (!isConnected) {
      initSocket();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const code = await createRoom(
      roomName.trim(),
      user.id,
      user.fullName || "Unknown",
      isJamRoom
    );

    if (code) {
      setCreateDialogOpen(false);
      setRoomName("");
      setIsJamRoom(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!user || !roomCode.trim()) return;

    if (!isConnected) {
      initSocket();
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

  // Format room code input
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
    setRoomCode(value);
  };

  if (!isSignedIn) {
    return (
      <div className="bg-zinc-900/60 border border-red-500/30 rounded-2xl p-4 text-center backdrop-blur-sm shadow-[0_0_30px_rgba(255,0,51,0.08)]">
        <div className="space-y-3">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <Radio className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide">
              Live Jam Rooms
            </h3>
            <p className="text-zinc-400 text-xs mt-1">
              Join 4-digit rooms and jam live with friends
            </p>
          </div>
          <SignInButton mode="modal">
            <Button
              size="sm"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl shadow-[0_0_20px_rgba(255,0,51,0.2)]"
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
            className="w-full justify-start text-white hover:bg-red-500/15 hover:text-red-300 transition-all duration-200 rounded-xl group"
            onClick={() => !isConnected && initSocket()}
          >
            <Plus className="mr-3 size-4 text-red-400 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium tracking-wide">Create Jam Room</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-zinc-950 border border-white/10 rounded-2xl backdrop-blur-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold flex items-center gap-2 tracking-wide">
              <Radio className="w-6 h-6 text-red-400" />
              Create Jam Room
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Room Name
              </label>
              <Input
                placeholder="My Awesome Playlist..."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="bg-black/30 border-white/20 text-white placeholder:text-zinc-500 rounded-xl focus:border-red-500/50"
                disabled={isLoading}
              />
            </div>

            {/* Room Type Selection */}
            <div className="space-y-3">
              <label className="text-sm text-zinc-400 block">Room Type</label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsJamRoom(false)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    !isJamRoom
                      ? "border-red-500/50 bg-red-500/10"
                      : "border-white/10 bg-black/20 hover:border-red-500/30 hover:bg-red-500/5"
                  }`}
                >
                  <Music
                    className={`w-6 h-6 mx-auto mb-2 ${
                      !isJamRoom ? "text-red-400" : "text-zinc-400"
                    }`}
                  />
                  <p className="text-white text-sm font-medium">Music Room</p>
                  <p className="text-zinc-400 text-xs">
                    Share what you're playing
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setIsJamRoom(true)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    isJamRoom
                      ? "border-red-500/50 bg-red-500/10"
                      : "border-white/10 bg-black/20 hover:border-red-500/30 hover:bg-red-500/5"
                  }`}
                >
                  <Crown
                    className={`w-6 h-6 mx-auto mb-2 ${
                      isJamRoom ? "text-red-400" : "text-zinc-400"
                    }`}
                  />
                  <p className="text-white text-sm font-medium">Live Jam</p>
                  <p className="text-zinc-400 text-xs">
                    Sync playback together
                  </p>
                </button>
              </div>
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
                className="flex-1 bg-red-600 hover:bg-red-500 rounded-xl shadow-[0_0_20px_rgba(255,0,51,0.2)]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Radio className="w-4 h-4 mr-2" />
                    Create Room
                  </>
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
            className="w-full justify-start text-white hover:bg-red-500/15 hover:text-red-300 transition-all duration-200 rounded-xl group"
            onClick={() => !isConnected && initSocket()}
          >
            <DoorOpen className="mr-3 size-4 text-red-400 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-medium tracking-wide">Join Room</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-zinc-950 border border-white/10 rounded-2xl backdrop-blur-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold flex items-center gap-2 tracking-wide">
              <DoorOpen className="w-6 h-6 text-red-400" />
              Join Jam Room
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                4-Digit Room Code
              </label>
              <Input
                placeholder="1234"
                value={roomCode}
                onChange={handleCodeChange}
                className="bg-black/30 border-white/20 text-white text-center text-2xl tracking-[0.5em] font-bold placeholder:text-zinc-500 rounded-xl focus:border-red-500/50 h-16"
                disabled={isLoading}
                maxLength={4}
                pattern="[0-9]*"
                inputMode="numeric"
              />
              <p className="text-zinc-500 text-xs mt-2 text-center">
                Enter the 4-digit code shared by your friends
              </p>
            </div>

            {/* Visual Code Input */}
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 border-2 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                    roomCode[i]
                      ? "border-red-500/50 bg-red-500/10"
                      : "border-white/20 bg-black/20"
                  }`}
                >
                  {roomCode[i] || ""}
                </div>
              ))}
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
                className="flex-1 bg-red-600 hover:bg-red-500 rounded-xl shadow-[0_0_20px_rgba(255,0,51,0.2)]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <DoorOpen className="w-4 h-4 mr-2" />
                    Join Room
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Current Room Status */}
      {currentRoom && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span
              className={`${
                isJamSession ? "text-red-400" : "text-zinc-300"
              } font-medium text-sm`}
            >
              {isJamSession ? "LIVE JAM" : "IN ROOM"}
            </span>
          </div>
          <p className="text-white font-semibold text-sm">{currentRoom.name}</p>
          <p className="text-zinc-300 text-xs">Code: {currentRoom.code}</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedRoomControls;
