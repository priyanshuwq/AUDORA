import { Server } from "socket.io";
import { setupWebRTCHandlers } from "../socket/webrtcHandlers.js";
import { setupRoomHandlers } from "../socket/roomHandlers.js";
import { setupJamSessionHandlers, startPeriodicSync } from "../socket/jamSessionHandlers.js";
import { setupActivityHandlers, handleDisconnect } from "../socket/activityHandlers.js";

export const initializeSocket = (server) => {
  // Get allowed origins from environment or use defaults
  const allowedOrigins = (
    process.env.FRONTEND_ORIGINS ||
    "http://localhost:5173,http://localhost:5174,http://localhost:3000"
  )
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  // In production, also allow the deployment URL
  if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
    allowedOrigins.push(process.env.RENDER_EXTERNAL_URL);
  }

  console.log("Socket.io allowed origins:", allowedOrigins);

  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        
        // In production, allow same-origin and deployment requests
        if (process.env.NODE_ENV === 'production') {
          if (!origin.includes('localhost')) {
            return callback(null, true);
          }
        }
        
        // Check if the origin is in our allowed list
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        
        console.warn(`⚠ Socket.io CORS blocked origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'), false);
      },
      credentials: true,
      methods: ["GET", "POST"],
    },
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Shared state
  const userSockets = new Map();    // { userId: socketId }
  const userActivities = new Map(); // { userId: activity }
  const rooms = new Map();          // { roomId: roomData }
  const roomCodes = new Map();      // { code: roomId }
  const userRooms = new Map();      // { userId: roomId }

  // Shared state object for handlers
  const state = { rooms, roomCodes, userRooms, userSockets, userActivities };

  // Start periodic sync for jam sessions
  startPeriodicSync(io, rooms);

  io.on("connection", (socket) => {
    // Setup all handlers
    setupWebRTCHandlers(io, socket, rooms, userSockets);
    setupRoomHandlers(io, socket, state);
    setupJamSessionHandlers(io, socket, state);
    setupActivityHandlers(io, socket, state);

    // Handle disconnect
    socket.on("disconnect", () => {
      handleDisconnect(io, socket, state);
    });
  });
};
