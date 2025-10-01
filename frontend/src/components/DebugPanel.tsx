import { useState } from "react";
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import { useUser } from "@clerk/clerk-react";

const DebugPanel = () => {
  const { user } = useUser();
  const {
    socket,
    isConnected,
    currentRoom,
    joinedUsers,
    isInRoom,
    isJamSession,
    isJamHost,
  } = useEnhancedRoomStore();

  const [isVisible, setIsVisible] = useState(false);

  // Only show in development or with debug param
  if (
    process.env.NODE_ENV !== "development" &&
    !window.location.search.includes("debug")
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-mono hover:bg-purple-700 transition-colors"
      >
        DEBUG {isVisible ? "▼" : "▲"}
      </button>

      {isVisible && (
        <div className="mt-2 bg-black/90 text-green-400 p-4 rounded-lg shadow-xl border border-purple-500/30 font-mono text-xs max-w-sm overflow-auto max-h-96">
          <div className="space-y-2">
            <div>
              <strong>User:</strong> {user?.firstName || "Not logged in"}
            </div>
            <div>
              <strong>Socket:</strong>{" "}
              {socket
                ? socket.connected
                  ? "🟢 Connected"
                  : "🔴 Disconnected"
                : "❌ No Socket"}
            </div>
            <div>
              <strong>Socket ID:</strong> {socket?.id || "N/A"}
            </div>
            <div>
              <strong>Is Connected:</strong> {isConnected ? "✅" : "❌"}
            </div>
            <div>
              <strong>Current Room:</strong> {currentRoom?.name || "None"}
            </div>
            <div>
              <strong>Room Code:</strong> {currentRoom?.code || "N/A"}
            </div>
            <div>
              <strong>Is In Room:</strong> {isInRoom ? "✅" : "❌"}
            </div>
            <div>
              <strong>Is Jam Session:</strong> {isJamSession ? "✅" : "❌"}
            </div>
            <div>
              <strong>Is Jam Host:</strong> {isJamHost ? "✅" : "❌"}
            </div>
            <div>
              <strong>Joined Users:</strong> {joinedUsers.length}
            </div>

            {joinedUsers.length > 0 && (
              <div>
                <strong>Users in Room:</strong>
                {joinedUsers.map((roomUser, i) => (
                  <div key={i} className="ml-2 text-xs">
                    • {roomUser.user.fullName} (
                    {roomUser.isPlaying ? "▶️" : "⏸️"})
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-purple-500/30">
              <strong>Backend Status:</strong>
              <div className="text-xs text-yellow-300">
                Server: localhost:8000
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
