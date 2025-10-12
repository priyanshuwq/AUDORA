import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { Song, User } from "@/types";
import toast from "react-hot-toast";

// Get the appropriate socket URL based on environment
const getSocketUrl = () => {
  // In production, use relative URL which will resolve to the same host
  if (import.meta.env.PROD) {
    return "/";
  }
  // In development, use localhost with port
  return "http://localhost:8000";
};

interface RoomUser {
  user: User;
  currentSong: Song | null;
  isPlaying: boolean;
  timestamp: number;
}

interface Room {
  id: string;
  code: string;
  name: string;
  users: RoomUser[];
  createdAt: string;
}

interface RoomStore {
  // State
  socket: Socket | null;
  isConnected: boolean;
  currentRoom: Room | null;
  joinedUsers: RoomUser[];
  isInRoom: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initSocket: () => void;
  disconnectSocket: () => void;
  createRoom: (
    roomName: string,
    userId: string,
    userName: string
  ) => Promise<string | null>;
  joinRoom: (
    code: string,
    userId: string,
    userName: string
  ) => Promise<boolean>;
  leaveRoom: () => void;
  updateCurrentSong: (song: Song | null, isPlaying: boolean) => void;
  clearError: () => void;
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  // Initial state
  socket: null,
  isConnected: false,
  currentRoom: null,
  joinedUsers: [],
  isInRoom: false,
  isLoading: false,
  error: null,

  // Initialize socket connection
  initSocket: () => {
    if (get().socket) return;

    const socket = io(getSocketUrl(), {
      autoConnect: true,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      set({ isConnected: true });
      console.log("Socket connected successfully");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toast.error("Connection to server failed. Please try again later.");
    });

    socket.on("disconnect", () => {
      set({
        isConnected: false,
        isInRoom: false,
        currentRoom: null,
        joinedUsers: [],
      });
    });

    socket.on("room_created", (data: { room: Room; code: string }) => {
      set({ currentRoom: data.room, isInRoom: true, isLoading: false });
      toast.success(`Room created! Code: ${data.code}`);
    });

    socket.on("room_joined", (data: { room: Room }) => {
      set({
        currentRoom: data.room,
        joinedUsers: data.room.users,
        isInRoom: true,
        isLoading: false,
      });
      toast.success("Joined room successfully!");
    });

    socket.on("user_joined_room", (data: { user: RoomUser }) => {
      set((state) => ({
        joinedUsers: [...state.joinedUsers, data.user],
      }));
      toast.success(`${data.user.user.fullName} joined the room`);
    });

    socket.on(
      "user_left_room",
      (data: { userId: string; userName: string }) => {
        set((state) => ({
          joinedUsers: state.joinedUsers.filter(
            (user) => user.user._id !== data.userId
          ),
        }));
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
      }) => {
        set((state) => ({
          joinedUsers: state.joinedUsers.map((user) =>
            user.user._id === data.userId
              ? {
                  ...user,
                  currentSong: data.song,
                  isPlaying: data.isPlaying,
                  timestamp: data.timestamp,
                }
              : user
          ),
        }));
      }
    );

    socket.on("room_error", (data: { message: string }) => {
      set({ error: data.message, isLoading: false });
      toast.error(data.message);
    });

    set({ socket });
  },

  // Disconnect socket
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
      });
    }
  },

  // Create a new room
  createRoom: async (roomName: string, userId: string, userName: string) => {
    const { socket } = get();
    if (!socket) return null;

    set({ isLoading: true, error: null });

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        set({ isLoading: false });
        resolve(null);
      }, 5000);

      socket.once("room_created", (data: { room: Room; code: string }) => {
        clearTimeout(timeout);
        resolve(data.code);
      });

      socket.once("room_error", () => {
        clearTimeout(timeout);
        resolve(null);
      });

      socket.emit("create_room", { roomName, userId, userName });
    });
  },

  // Join an existing room
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

  // Leave current room
  leaveRoom: () => {
    const { socket, currentRoom } = get();
    if (!socket || !currentRoom) return;

    socket.emit("leave_room", { roomId: currentRoom.id });
    set({ isInRoom: false, currentRoom: null, joinedUsers: [] });
    toast("Left the room");
  },

  // Update current song for other users to see
  updateCurrentSong: (song: Song | null, isPlaying: boolean) => {
    const { socket, currentRoom } = get();
    if (!socket || !currentRoom) return;

    socket.emit("update_song", {
      roomId: currentRoom.id,
      song,
      isPlaying,
      timestamp: Date.now(),
    });
  },

  // Clear error state
  clearError: () => {
    set({ error: null });
  },
}));
