import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { Song, User } from "@/types";
import toast from "react-hot-toast";
import { WebRTCAudioStreamManager } from "@/lib/webrtcAudioStream";

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
  isLocalPlaybackMode: boolean; // Guest can play independently without affecting others

  // WebRTC additions
  webrtcManager: WebRTCAudioStreamManager | null;
  isStreamingAudio: boolean;
  remoteAudioStream: MediaStream | null;
  isLocalMuted: boolean; // Guest can mute host's stream locally
  localVolume: number; // Guest's local volume control (0-1)
  audioQuality: {
    bitrate: number;
    packetLoss: number;
    jitter: number;
    latency: number;
  } | null;

  initSocket: () => void;
  connectUser: (userId: string) => void;
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
  toggleLocalPlaybackMode: () => void;

  // WebRTC methods
  initWebRTC: () => void;
  startAudioStream: (audioElement: HTMLAudioElement) => Promise<boolean>;
  stopAudioStream: () => void;
  connectToHostStream: () => Promise<boolean>;
  monitorAudioQuality: () => void;
  toggleLocalMute: () => void;
  setLocalVolume: (volume: number) => void;

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
  isLocalPlaybackMode: false,

  // WebRTC state
  webrtcManager: null,
  isStreamingAudio: false,
  remoteAudioStream: null,
  isLocalMuted: false,
  localVolume: 1.0,
  audioQuality: null,

  initSocket: () => {
    if (get().socket) return;
    const socket = io(getSocketUrl(), {
      autoConnect: true,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toast.error("Connection to server failed. Please try again later.");
    });

    socket.on("connect", () => {
      set({ isConnected: true });
      console.log("✅ Socket connected!");
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
      (data: { userId: string; userName: string; wasHost?: boolean }) => {
        const currentState = get();
        
        set((state) => ({
          joinedUsers: state.joinedUsers.filter(
            (u) => u.user._id !== data.userId
          ),
        }));
        
        // If host left and jam session was active, switch to local playback
        if (data.wasHost && currentState.isJamSession && !currentState.isJamHost) {
          set({ isLocalPlaybackMode: true });
          toast.success(`${data.userName} (host) left - switched to independent playback`);
        } else {
          toast(`${data.userName} left the room`);
        }
        
        try {
          (window as any).__USE_ENHANCED_ROOM_STORE__ = get();
        } catch (e) {}
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
          // Update shared state (for display purposes)
          set({
            currentSharedSong: data.song,
            sharedPosition: data.position,
            sharedIsPlaying: data.isPlaying,
          });
          
          // Only sync local playback if not in independent mode
          if (!currentState.isLocalPlaybackMode) {
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
          }
          
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
            "localMode:",
            currentState.isLocalPlaybackMode,
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

    // WebRTC-specific event handlers
    socket.on('create_offer_for_guest', async ({ guestPeerId }) => {
      const { webrtcManager } = get();
      if (webrtcManager) {
        await webrtcManager.createOfferForPeer(guestPeerId);
      }
    });

    set({ socket });
    
    // Initialize WebRTC manager after socket is set
    get().initWebRTC();
  },

  connectUser: (userId: string) => {
    const { socket, isConnected } = get();
    if (socket && isConnected && userId) {
      console.log(`🔌 Emitting user_connected for userId: ${userId}`);
      socket.emit("user_connected", userId);
    } else {
      console.warn(`⚠️ Cannot emit user_connected. socket: ${!!socket}, isConnected: ${isConnected}, userId: ${userId}`);
    }
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
      socket.once("room_joined", (data: { room: Room; isHost?: boolean }) => {
        clearTimeout(timeout);
        
        // Auto-connect to host's WebRTC stream if joining an active jam session as guest
        if (data.room.isJamSession && !data.isHost) {
          setTimeout(async () => {
            await get().connectToHostStream();
          }, 1000); // Give socket time to fully establish
        }
        
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
    
    // Cleanup WebRTC connections
    get().stopAudioStream();
    
    // Remove remote audio element if exists
    const remoteAudio = document.getElementById('webrtc-remote-audio');
    if (remoteAudio) {
      remoteAudio.remove();
    }
    
    socket.emit("leave_room", { roomId: currentRoom.id });
    set({
      isInRoom: false,
      currentRoom: null,
      joinedUsers: [],
      isJamSession: false,
      isJamHost: false,
      sharedQueue: [],
      currentSharedSong: null,
      remoteAudioStream: null,
      audioQuality: null,
      isStreamingAudio: false,
      isLocalPlaybackMode: false,
    });
    
    // Don't stop local playback - user should keep listening
    toast("Left the room - your music continues playing");
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

  // Start jam session (Enhanced with WebRTC)
  startJamSession: async () => {
    const { socket, currentRoom } = get();
    if (!socket || !currentRoom) return;

    socket.emit("start_jam_session", { roomId: currentRoom.id });
    
    // Note: WebRTC streaming will auto-start when host plays music
    // See AudioPlayer component for auto-start logic
  },

  // Stop jam session (Enhanced with WebRTC)
  stopJamSession: () => {
    const { socket, currentRoom } = get();
    if (!socket || !currentRoom) return;

    socket.emit("stop_jam_session", { roomId: currentRoom.id });
    
    // Stop WebRTC streaming
    get().stopAudioStream();
  },

  // Sync playback - Host controls globally, Guests control locally
  syncPlayback: (song: Song, position: number, isPlaying: boolean) => {
    const { socket, currentRoom, isJamSession, isJamHost } = get();
    if (!socket || !currentRoom || !isJamSession) return;

    // Host: Sync to everyone (global control)
    if (isJamHost) {
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
    } else {
      // Guest: Only update local state, don't broadcast
      // They listen to host's stream via WebRTC
      console.log("🎧 Guest local control - not broadcasting");
      
      // Update local player without syncing to room
      import("./usePlayerStore").then(({ usePlayerStore }) => {
        usePlayerStore.setState({
          currentSong: song,
          isPlaying: isPlaying,
        });
      });
    }
  },

  // Play a song (Host = global, Guest = local)
  playSharedSong: (song: Song) => {
    const { isJamHost } = get();
    
    if (isJamHost) {
      // Host plays globally
      get().syncPlayback(song, 0, true);
    } else {
      // Guest plays locally
      import("./usePlayerStore").then(({ usePlayerStore }) => {
        const playerStore = usePlayerStore.getState();
        playerStore.playAlbum([song], 0);
      });
    }
  },

  // Toggle playback (Host = global, Guest = local)
  toggleSharedPlayback: () => {
    const {
      socket,
      currentRoom,
      currentSharedSong,
      sharedPosition,
      sharedIsPlaying,
      isJamSession,
      isJamHost,
    } = get();
    
    if (!socket || !currentRoom || !isJamSession) {
      console.log("Cannot toggle: not in jam session or not connected");
      return;
    }

    if (!currentSharedSong) {
      console.log("No shared song to sync");
      return;
    }

    const newIsPlaying = !sharedIsPlaying;

    if (isJamHost) {
      // Host: Toggle globally
      console.log("🎵 Host toggling playback globally:", newIsPlaying);
      
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
    } else {
      // Guest: Toggle locally only
      console.log("🎧 Guest toggling playback locally:", newIsPlaying);
      
      import("./usePlayerStore").then(({ usePlayerStore }) => {
        usePlayerStore.setState({
          isPlaying: newIsPlaying,
        });
      });
    }
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

  // ============ WebRTC Methods ============

  // Initialize WebRTC manager
  initWebRTC: () => {
    const { socket } = get();
    if (!socket) return;

    const webrtcManager = new WebRTCAudioStreamManager(socket);
    set({ webrtcManager });
    console.log('✅ WebRTC manager initialized');
  },

  // Start streaming audio as host
  startAudioStream: async (audioElement: HTMLAudioElement) => {
    const { webrtcManager, currentRoom, isJamHost } = get();
    
    if (!webrtcManager || !currentRoom || !isJamHost) {
      console.error('Cannot start stream: missing requirements');
      toast.error('Failed to start audio stream');
      return false;
    }

    try {
      const success = await webrtcManager.initializeAsHost(
        currentRoom.id,
        audioElement
      );

      if (success) {
        set({ isStreamingAudio: true });
        toast.success('🎵 Audio streaming started!');
        
        // Monitor audio quality
        get().monitorAudioQuality();
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to start audio stream:', error);
      toast.error('Failed to start audio stream');
      return false;
    }
  },

  // Stop streaming audio
  stopAudioStream: () => {
    const { webrtcManager } = get();
    
    if (webrtcManager) {
      webrtcManager.cleanup();
      set({ 
        isStreamingAudio: false, 
        remoteAudioStream: null,
        audioQuality: null 
      });
      toast('Audio streaming stopped');
    }
  },

  // Connect to host's audio stream as guest
  connectToHostStream: async () => {
    const { webrtcManager, currentRoom, isJamHost } = get();
    
    if (!webrtcManager || !currentRoom || isJamHost) {
      return false;
    }

    try {
      const success = await webrtcManager.initializeAsGuest(
        currentRoom.id,
        (stream: MediaStream) => {
          console.log('✅ Received audio stream from host');
          
          // Create audio element to play the stream
          const audioElement = document.createElement('audio');
          audioElement.srcObject = stream;
          audioElement.autoplay = true;
          audioElement.id = 'webrtc-remote-audio';
          
          // Add to DOM (hidden)
          document.body.appendChild(audioElement);
          
          set({ remoteAudioStream: stream });
          toast.success('🎧 Connected to host audio stream!');
          
          // Monitor audio quality
          get().monitorAudioQuality();
        }
      );

      return success;
    } catch (error) {
      console.error('Failed to connect to host stream:', error);
      toast.error('Failed to connect to audio stream');
      return false;
    }
  },

  // Monitor audio quality periodically
  monitorAudioQuality: () => {
    const { webrtcManager, currentRoom } = get();
    if (!webrtcManager || !currentRoom) return;

    const interval = setInterval(async () => {
      const { webrtcManager: manager, isInRoom } = get();
      
      if (!manager || !isInRoom) {
        clearInterval(interval);
        return;
      }

      // Get first peer connection quality
      const peers = Array.from((manager as any).peerConnections.keys()) as string[];
      if (peers.length > 0) {
        const quality = await manager.getConnectionQuality(peers[0]);
        if (quality) {
          set({ audioQuality: quality });
        }
      }
    }, 5000); // Check every 5 seconds
  },

  // Toggle local mute (guest mutes host's stream locally)
  toggleLocalMute: () => {
    const { isLocalMuted, remoteAudioStream } = get();
    
    if (remoteAudioStream) {
      // Mute/unmute the remote audio element
      const remoteAudio = document.getElementById('webrtc-remote-audio') as HTMLAudioElement;
      if (remoteAudio) {
        remoteAudio.muted = !isLocalMuted;
        set({ isLocalMuted: !isLocalMuted });
        toast(isLocalMuted ? '🔊 Unmuted host stream' : '🔇 Muted host stream (local only)');
      }
    } else {
      // Fallback: mute local player
      const audio = document.querySelector('audio') as HTMLAudioElement;
      if (audio) {
        audio.muted = !isLocalMuted;
        set({ isLocalMuted: !isLocalMuted });
        toast(isLocalMuted ? '🔊 Unmuted' : '🔇 Muted (local only)');
      }
    }
  },

  // Set local volume (guest controls volume locally)
  setLocalVolume: (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    // Adjust remote audio stream volume
    const remoteAudio = document.getElementById('webrtc-remote-audio') as HTMLAudioElement;
    if (remoteAudio) {
      remoteAudio.volume = clampedVolume;
    }
    
    // Also adjust local audio element
    const audio = document.querySelector('audio') as HTMLAudioElement;
    if (audio) {
      audio.volume = clampedVolume;
    }
    
    set({ localVolume: clampedVolume });
  },

  // Toggle independent playback mode (guest can play their own music)
  toggleLocalPlaybackMode: () => {
    const { isLocalPlaybackMode, isJamHost } = get();
    
    // Only guests can toggle this, hosts always control globally
    if (isJamHost) {
      toast.error("Host always controls playback globally");
      return;
    }
    
    const newMode = !isLocalPlaybackMode;
    set({ isLocalPlaybackMode: newMode });
    
    if (newMode) {
      toast.success("🎧 Independent playback enabled - your music won't affect others");
    } else {
      toast.success("🔗 Synced to room playback");
    }
  },

  // Clear error state
  clearError: () => {
    set({ error: null });
  },
}));
