import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { Song, User } from "@/types";
import toast from "react-hot-toast";

interface RoomUser {
  user: User;
  currentSong: Song | null;
  isPlaying: boolean;
  timestamp: number;
  position: number;
  lastUpdateTime: number;
}

interface Room {
  id: string;
  code: string;
  name: string;
  users: RoomUser[];
  createdAt: string;
  isJamSession: boolean;
  jamHost: string | null;
  sharedQueue: Song[];
  currentSharedSong: Song | null;
  sharedPosition: number;
  sharedIsPlaying: boolean;
}

interface RoomStore {
  socket: Socket | null;
  isConnected: boolean;
  currentRoom: Room | null;
  joinedUsers: RoomUser[];
  isInRoom: boolean;
  isLoading: boolean;
  error: string | null;

  isJamSession: boolean;
  isJamHost: boolean;
  sharedQueue: Song[];
  currentSharedSong: Song | null;
  sharedPosition: number;
  sharedIsPlaying: boolean;
  syncEnabled: boolean;

  initSocket: () => void;
  disconnectSocket: () => void;
  createRoom: (
    roomName: string,
    userId: string,
    userName: string,
    isJamSession?: boolean
  ) => Promise<string | null>;
  joinRoom: (
    code: string,
    userId: string,
    userName: string
  ) => Promise<boolean>;
  leaveRoom: () => void;
  updateCurrentSong: (
    song: Song | null,
    isPlaying: boolean,
    position?: number
  ) => void;

  startJamSession: () => void;
  stopJamSession: () => void;
  syncPlayback: (song: Song, position: number, isPlaying: boolean) => void;
  addToSharedQueue: (song: Song) => void;
  removeFromSharedQueue: (songId: string) => void;
  playSharedSong: (song: Song) => void;
  toggleSharedPlayback: () => void;
  seekSharedSong: (position: number) => void;

  clearError: () => void;
}

export const useEnhancedRoomStore = create<RoomStore>((set, get) => ({
  socket: null,
  isConnected: false,
  currentRoom: null,
  joinedUsers: [],
  isInRoom: false,
  isLoading: false,
  error: null,

  isJamSession: false,
  isJamHost: false,
  sharedQueue: [],
  currentSharedSong: null,
  sharedPosition: 0,
  sharedIsPlaying: false,
  syncEnabled: true,

  initSocket: () => {
    if (get().socket) return;
    const socket = io("http://localhost:8000", {
      autoConnect: true,
      withCredentials: true,
    });

    socket.on("connect", () => {
      set({ isConnected: true });
      try {
        (window as any).__USE_ENHANCED_ROOM_STORE__ = get();
      } catch (e) {}
    });

    socket.on("disconnect", () => {
      set({
        isConnected: false,
        isInRoom: false,
        currentRoom: null,
        joinedUsers: [],
        isJamSession: false,
        isJamHost: false,
        sharedQueue: [],
        currentSharedSong: null,
      });
    });

    socket.on("room_created", (data: { room: Room; code: string }) => {
      set({
        currentRoom: data.room,
        isInRoom: true,
        isLoading: false,
        isJamSession: data.room.isJamSession || false,
        isJamHost: true,
        sharedQueue: data.room.sharedQueue || [],
        currentSharedSong: data.room.currentSharedSong || null,
      });
      toast.success(`Room created! Code: ${data.code}`);
      try {
        (window as any).__USE_ENHANCED_ROOM_STORE__ = get();
      } catch (e) {}
    });

    socket.on("room_joined", (data: { room: Room; isHost?: boolean }) => {
      set({
        currentRoom: data.room,
        joinedUsers: data.room.users,
        isInRoom: true,
        isLoading: false,
        isJamSession: data.room.isJamSession || false,
        isJamHost: data.isHost || false,
        sharedQueue: data.room.sharedQueue || [],
        currentSharedSong: data.room.currentSharedSong || null,
        sharedPosition: data.room.sharedPosition || 0,
        sharedIsPlaying: data.room.sharedIsPlaying || false,
      });
      try {
        (window as any).__USE_ENHANCED_ROOM_STORE__ = get();
      } catch (e) {}
      toast.success("Joined room successfully!");
    });

    socket.on("user_joined_room", (data: { user: RoomUser }) => {
      set((state) => ({ joinedUsers: [...state.joinedUsers, data.user] }));
      try {
        (window as any).__USE_ENHANCED_ROOM_STORE__ = get();
      } catch (e) {}
      toast.success(`${data.user.user.fullName} joined the room`);
    });

    socket.on(
      "user_left_room",
      (data: { userId: string; userName: string }) => {
        set((state) => ({
          joinedUsers: state.joinedUsers.filter(
            (u) => u.user._id !== data.userId
          ),
        }));
        try {
          (window as any).__USE_ENHANCED_ROOM_STORE__ = get();
        } catch (e) {}
        toast(`${data.userName} left the room`);
      }
    );

    socket.on(
      "user_song_update",
      (data: {
        userId: string;
        song: Song | null;
        isPlaying: boolean;
        timestamp: number;
        position?: number;
        lastUpdateTime?: number;
      }) => {
        set((state) => ({
          joinedUsers: state.joinedUsers.map((user) =>
            user.user._id === data.userId
              ? {
                  ...user,
                  currentSong: data.song,
                  isPlaying: data.isPlaying,
                  timestamp: data.timestamp,
                  position: data.position || 0,
                  lastUpdateTime: data.lastUpdateTime || Date.now(),
                }
              : user
          ),
        }));
        try {
          (window as any).__USE_ENHANCED_ROOM_STORE__ = get();
        } catch (e) {}
      }
    );

    socket.on("jam_session_started", () => {
      set({ isJamSession: true });
      toast.success("Jam session started! 🎵");
    });
    socket.on("jam_session_stopped", () => {
      set({
        isJamSession: false,
        currentSharedSong: null,
        sharedIsPlaying: false,
        sharedPosition: 0,
      });
      toast("Jam session ended");
    });

    socket.on(
      "shared_playback_sync",
      (data: {
        song: Song;
        position: number;
        isPlaying: boolean;
        timestamp: number;
        serverTime?: number;
      }) => {
        const currentState = get();
        if (!currentState.isJamHost) {
          set({
            currentSharedSong: data.song,
            sharedPosition: data.position,
            sharedIsPlaying: data.isPlaying,
          });
          import("./usePlayerStore").then(({ usePlayerStore }) => {
            const playerStore = usePlayerStore.getState();
            if (playerStore.currentSong?._id !== data.song._id)
              playerStore.playAlbum([data.song], 0);
            usePlayerStore.setState({
              isPlaying: data.isPlaying,
              currentSong: data.song,
            });
            const audio = document.querySelector("audio");
            if (audio && Math.abs(audio.currentTime - data.position) > 1)
              audio.currentTime = data.position;
          });
          window.dispatchEvent(
            new CustomEvent("jamSync", {
              detail: {
                song: data.song,
                position: data.position,
                isPlaying: data.isPlaying,
                timestamp: data.timestamp,
              },
            })
          );
          console.log(
            "🎵 Sync received:",
            data.song.title,
            "playing:",
            data.isPlaying,
            "at position:",
            data.position
          );
        }
      }
    );

    socket.on(
      "periodic_sync",
      (data: {
        song: Song;
        position: number;
        isPlaying: boolean;
        serverTime: number;
      }) => {
        const currentState = get();
        if (!currentState.isJamHost && currentState.isJamSession) {
          set({
            sharedPosition: data.position,
            sharedIsPlaying: data.isPlaying,
          });
          window.dispatchEvent(
            new CustomEvent("periodicSync", { detail: data })
          );
        }
      }
    );

    socket.on("shared_queue_updated", (data: { queue: Song[] }) => {
      set({ sharedQueue: data.queue });
    });
    socket.on("room_error", (data: { message: string }) => {
      set({ error: data.message, isLoading: false });
      toast.error(data.message);
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({
        socket: null,
        isConnected: false,
        isInRoom: false,
        currentRoom: null,
        joinedUsers: [],
        isJamSession: false,
        isJamHost: false,
        sharedQueue: [],
        currentSharedSong: null,
      });
    }
  },

  createRoom: async (
    roomName: string,
    userId: string,
    userName: string,
    isJamSession = false
  ) => {
    const { socket } = get();
    if (!socket) return null;
    set({ isLoading: true, error: null });
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        set({ isLoading: false });
        resolve(null);
      }, 8000);
      socket.once("room_created", (data: { room: Room; code: string }) => {
        clearTimeout(timeout);
        resolve(data.code);
      });
      socket.once("room_error", () => {
        clearTimeout(timeout);
        resolve(null);
      });
      socket.emit("create_room", { roomName, userId, userName, isJamSession });
    });
  },

  joinRoom: async (code: string, userId: string, userName: string) => {
    const { socket } = get();
    if (!socket) return false;
    set({ isLoading: true, error: null });
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        set({ isLoading: false });
        resolve(false);
      }, 5000);
      socket.once("room_joined", () => {
        clearTimeout(timeout);
        resolve(true);
      });
      socket.once("room_error", () => {
        clearTimeout(timeout);
        resolve(false);
      });
      socket.emit("join_room", { code, userId, userName });
    });
  },

  leaveRoom: () => {
    const { socket, currentRoom } = get();
    if (!socket || !currentRoom) return;
    socket.emit("leave_room", { roomId: currentRoom.id });
    set({
      isInRoom: false,
      currentRoom: null,
      joinedUsers: [],
      isJamSession: false,
      isJamHost: false,
      sharedQueue: [],
      currentSharedSong: null,
    });
    toast("Left the room");
  },

  // Enhanced update current song with position
  updateCurrentSong: (song: Song | null, isPlaying: boolean, position = 0) => {
    const { socket, currentRoom } = get();
    if (!socket || !currentRoom) return;

    socket.emit("update_song", {
      roomId: currentRoom.id,
      song,
      isPlaying,
      timestamp: Date.now(),
      position,
      lastUpdateTime: Date.now(),
    });
  },

  // Start jam session
  startJamSession: () => {
    const { socket, currentRoom } = get();
    if (!socket || !currentRoom) return;

    socket.emit("start_jam_session", { roomId: currentRoom.id });
  },

  // Stop jam session
  stopJamSession: () => {
    const { socket, currentRoom } = get();
    if (!socket || !currentRoom) return;

    socket.emit("stop_jam_session", { roomId: currentRoom.id });
  },

  // Sync playback across all users
  syncPlayback: (song: Song, position: number, isPlaying: boolean) => {
    const { socket, currentRoom, isJamHost } = get();
    if (!socket || !currentRoom || !isJamHost) return;

    socket.emit("sync_playback", {
      roomId: currentRoom.id,
      song,
      position,
      isPlaying,
      timestamp: Date.now(),
    });

    set({
      currentSharedSong: song,
      sharedPosition: position,
      sharedIsPlaying: isPlaying,
    });
  },

  // Add song to shared queue
  addToSharedQueue: (song: Song) => {
    const { socket, currentRoom } = get();
    if (!socket || !currentRoom) return;

    socket.emit("add_to_shared_queue", {
      roomId: currentRoom.id,
      song,
    });
  },

  // Remove song from shared queue
  removeFromSharedQueue: (songId: string) => {
    const { socket, currentRoom } = get();
    if (!socket || !currentRoom) return;

    socket.emit("remove_from_shared_queue", {
      roomId: currentRoom.id,
      songId,
    });
  },

  // Play shared song
  playSharedSong: (song: Song) => {
    const { syncPlayback } = get();
    syncPlayback(song, 0, true);
  },

  // Toggle shared playback
  toggleSharedPlayback: () => {
    const {
      socket,
      currentRoom,
      currentSharedSong,
      sharedPosition,
      sharedIsPlaying,
      isJamHost,
    } = get();
    if (!socket || !currentRoom || !isJamHost) {
      console.log("Cannot toggle: not host or not connected");
      return;
    }

    if (!currentSharedSong) {
      console.log("No shared song to sync");
      return;
    }

    const newIsPlaying = !sharedIsPlaying;

    console.log(
      "Syncing playback:",
      currentSharedSong.title,
      "playing:",
      newIsPlaying
    );

    socket.emit("sync_playback", {
      roomId: currentRoom.id,
      song: currentSharedSong,
      position: sharedPosition,
      isPlaying: newIsPlaying,
      timestamp: Date.now(),
    });

    set({
      sharedIsPlaying: newIsPlaying,
    });
  },

  // Seek shared song
  seekSharedSong: (position: number) => {
    const { socket, currentRoom, currentSharedSong, sharedIsPlaying } = get();
    if (!socket || !currentRoom || !currentSharedSong) return;

    socket.emit("sync_playback", {
      roomId: currentRoom.id,
      song: currentSharedSong,
      position,
      isPlaying: sharedIsPlaying,
      timestamp: Date.now(),
    });

    set({ sharedPosition: position });
  },

  // Clear error state
  clearError: () => {
    set({ error: null });
  },
}));
