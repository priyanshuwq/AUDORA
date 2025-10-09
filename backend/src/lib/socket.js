import { Server } from "socket.io";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
      ],
      credentials: true,
    },
  });

  const userSockets = new Map(); // { userId: socketId}
  const userActivities = new Map(); // {userId: activity}

  // Enhanced Room management
  const rooms = new Map(); // { roomId: { id, code, name, users: [], createdAt, isJamSession, jamHost, sharedQueue, currentSharedSong, sharedPosition, sharedIsPlaying } }
  const roomCodes = new Map(); // { code: roomId }
  const userRooms = new Map(); // { userId: roomId }

  // Generate 4-digit room code
  const generateRoomCode = () => {
    let code;
    do {
      code = Math.floor(1000 + Math.random() * 9000).toString();
    } while (roomCodes.has(code));
    return code;
  };

  // Periodic sync for jam sessions - more frequent updates
  setInterval(() => {
    rooms.forEach((room) => {
      if (room.isJamSession && room.jamHost && room.currentSharedSong) {
        // Send periodic sync updates to ensure all clients stay in sync
        io.to(room.id).emit("periodic_sync", {
          song: room.currentSharedSong,
          position: room.sharedPosition,
          isPlaying: room.sharedIsPlaying,
          serverTime: Date.now(),
        });
      }
    });
  }, 2000); // Every 2 seconds for better sync

  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id);
      userActivities.set(userId, "Idle");

      // broadcast to all connected sockets that this user just logged in
      io.emit("user_connected", userId);

      socket.emit("users_online", Array.from(userSockets.keys()));

      io.emit("activities", Array.from(userActivities.entries()));
    });

    socket.on("update_activity", ({ userId, activity }) => {
      console.log("activity updated", userId, activity);
      userActivities.set(userId, activity);
      io.emit("activity_updated", { userId, activity });
    });

    // Enhanced Room functionality
    socket.on(
      "create_room",
      ({ roomName, userId, userName, isJamSession = false }) => {
        try {
          const roomId = `room_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          const code = generateRoomCode();

          const room = {
            id: roomId,
            code,
            name: roomName,
            users: [
              {
                user: { _id: userId, fullName: userName, imageUrl: "" },
                currentSong: null,
                isPlaying: false,
                timestamp: Date.now(),
                position: 0,
                lastUpdateTime: Date.now(),
              },
            ],
            createdAt: new Date().toISOString(),
            isJamSession: isJamSession,
            jamHost: isJamSession ? userId : null,
            sharedQueue: [],
            currentSharedSong: null,
            sharedPosition: 0,
            sharedIsPlaying: false,
          };

          rooms.set(roomId, room);
          roomCodes.set(code, roomId);
          userRooms.set(userId, roomId);

          socket.join(roomId);
          socket.emit("room_created", { room, code });

          console.log(
            `${
              isJamSession ? "Jam" : "Music"
            } room created: ${roomName} (${code}) by ${userName}`
          );
        } catch (error) {
          socket.emit("room_error", { message: "Failed to create room" });
        }
      }
    );

    socket.on("join_room", ({ code, userId, userName }) => {
      try {
        const roomId = roomCodes.get(code);

        if (!roomId || !rooms.has(roomId)) {
          socket.emit("room_error", { message: "Room not found" });
          return;
        }

        const room = rooms.get(roomId);

        // Check if user is already in room
        if (room.users.some((u) => u.user._id === userId)) {
          socket.emit("room_error", { message: "Already in this room" });
          return;
        }

        // Add user to room
        const newUser = {
          user: { _id: userId, fullName: userName, imageUrl: "" },
          currentSong: null,
          isPlaying: false,
          timestamp: Date.now(),
          position: 0,
          lastUpdateTime: Date.now(),
        };

        room.users.push(newUser);
        userRooms.set(userId, roomId);

        socket.join(roomId);
        const isHost = room.jamHost === userId;
        socket.emit("room_joined", { room, isHost });

        // Notify other users in room
        socket.to(roomId).emit("user_joined_room", { user: newUser });

        console.log(`${userName} joined room ${room.name} (${code})`);
      } catch (error) {
        socket.emit("room_error", { message: "Failed to join room" });
      }
    });

    socket.on("leave_room", ({ roomId }) => {
      try {
        const room = rooms.get(roomId);
        if (!room) return;

        // Find and remove user from room
        const userIndex = room.users.findIndex(
          (u) => userSockets.get(u.user._id) === socket.id
        );
        if (userIndex === -1) return;

        const leavingUser = room.users[userIndex];
        room.users.splice(userIndex, 1);

        // Remove user from tracking
        userRooms.delete(leavingUser.user._id);
        socket.leave(roomId);

        // If room is empty, delete it
        if (room.users.length === 0) {
          rooms.delete(roomId);
          roomCodes.delete(room.code);
          console.log(`Room ${room.name} deleted - no users left`);
        } else {
          // Notify remaining users
          socket.to(roomId).emit("user_left_room", {
            userId: leavingUser.user._id,
            userName: leavingUser.user.fullName,
          });
        }

        console.log(`${leavingUser.user.fullName} left room ${room.name}`);
      } catch (error) {
        console.error("Error leaving room:", error);
      }
    });

    socket.on(
      "update_song",
      ({
        roomId,
        song,
        isPlaying,
        timestamp,
        position = 0,
        lastUpdateTime,
      }) => {
        try {
          const room = rooms.get(roomId);
          if (!room) return;

          // Find user in room and update their song
          const userIndex = room.users.findIndex(
            (u) => userSockets.get(u.user._id) === socket.id
          );
          if (userIndex === -1) return;

          room.users[userIndex].currentSong = song;
          room.users[userIndex].isPlaying = isPlaying;
          room.users[userIndex].timestamp = timestamp;
          room.users[userIndex].position = position;
          room.users[userIndex].lastUpdateTime = lastUpdateTime || Date.now();

          // Broadcast to other users in room
          socket.to(roomId).emit("user_song_update", {
            userId: room.users[userIndex].user._id,
            song,
            isPlaying,
            timestamp,
            position,
            lastUpdateTime: room.users[userIndex].lastUpdateTime,
          });
        } catch (error) {
          console.error("Error updating song:", error);
        }
      }
    );

    // New Jam Session Events
    socket.on("start_jam_session", ({ roomId }) => {
      try {
        const room = rooms.get(roomId);
        if (!room) return;

        // Find user in room
        const user = room.users.find(
          (u) => userSockets.get(u.user._id) === socket.id
        );
        if (!user) return;

        room.isJamSession = true;
        room.jamHost = user.user._id;

        // Notify all users in room
        io.to(roomId).emit("jam_session_started");
        console.log(
          `Jam session started in room ${room.name} by ${user.user.fullName}`
        );
      } catch (error) {
        console.error("Error starting jam session:", error);
      }
    });

    socket.on("stop_jam_session", ({ roomId }) => {
      try {
        console.log("🛑 Stop jam session request received for room:", roomId);
        const room = rooms.get(roomId);
        if (!room) {
          console.log("❌ Room not found:", roomId);
          return;
        }

        // Check if user is the host
        const user = room.users.find(
          (u) => userSockets.get(u.user._id) === socket.id
        );
        if (!user) {
          console.log("❌ User not found in room");
          return;
        }
        if (room.jamHost !== user.user._id) {
          console.log(
            "❌ User is not the jam host. Host:",
            room.jamHost,
            "User:",
            user.user._id
          );
          return;
        }

        room.isJamSession = false;
        room.jamHost = null;
        room.currentSharedSong = null;
        room.sharedIsPlaying = false;
        room.sharedPosition = 0;

        // Notify all users in room
        io.to(roomId).emit("jam_session_stopped");
        console.log(`Jam session stopped in room ${room.name}`);
      } catch (error) {
        console.error("Error stopping jam session:", error);
      }
    });

    socket.on(
      "sync_playback",
      ({ roomId, song, position, isPlaying, timestamp }) => {
        try {
          const room = rooms.get(roomId);
          if (!room || !room.isJamSession) {
            return;
          }

          // Check if user is the host
          const user = room.users.find(
            (u) => userSockets.get(u.user._id) === socket.id
          );
          if (!user || room.jamHost !== user.user._id) {
            return;
          }

          // Update room state with precise timestamp for sync
          room.currentSharedSong = song;
          room.sharedPosition = position;
          room.sharedIsPlaying = isPlaying;
          const syncTimestamp = Date.now();

          // Immediate broadcast to all other users in room with accurate timing
          socket.to(roomId).emit("shared_playback_sync", {
            song,
            position,
            isPlaying,
            timestamp: syncTimestamp,
            serverTime: syncTimestamp, // Add server time for better sync
          });

          // Also update the user's own state in the room
          const userIndex = room.users.findIndex(
            (u) => u.user._id === user.user._id
          );
          if (userIndex !== -1) {
            room.users[userIndex].currentSong = song;
            room.users[userIndex].isPlaying = isPlaying;
            room.users[userIndex].position = position;
            room.users[userIndex].lastUpdateTime = syncTimestamp;
          }
        } catch (error) {
          console.error("Error syncing playback:", error);
        }
      }
    );

    socket.on("add_to_shared_queue", ({ roomId, song }) => {
      try {
        const room = rooms.get(roomId);
        if (!room || !room.isJamSession) return;

        room.sharedQueue.push(song);

        // Broadcast updated queue to all users in room
        io.to(roomId).emit("shared_queue_updated", { queue: room.sharedQueue });
        console.log(
          `Song added to shared queue in room ${room.name}: ${song.title}`
        );
      } catch (error) {
        console.error("Error adding to shared queue:", error);
      }
    });

    socket.on("remove_from_shared_queue", ({ roomId, songId }) => {
      try {
        const room = rooms.get(roomId);
        if (!room || !room.isJamSession) return;

        room.sharedQueue = room.sharedQueue.filter(
          (song) => song._id !== songId
        );

        // Broadcast updated queue to all users in room
        io.to(roomId).emit("shared_queue_updated", { queue: room.sharedQueue });
        console.log(`Song removed from shared queue in room ${room.name}`);
      } catch (error) {
        console.error("Error removing from shared queue:", error);
      }
    });

    socket.on("disconnect", () => {
      let disconnectedUserId;

      // Find disconnected user
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        // Handle room cleanup
        const roomId = userRooms.get(disconnectedUserId);
        if (roomId) {
          const room = rooms.get(roomId);
          if (room) {
            const userIndex = room.users.findIndex(
              (u) => u.user._id === disconnectedUserId
            );
            if (userIndex !== -1) {
              const leavingUser = room.users[userIndex];
              room.users.splice(userIndex, 1);

              if (room.users.length === 0) {
                rooms.delete(roomId);
                roomCodes.delete(room.code);
              } else {
                socket.to(roomId).emit("user_left_room", {
                  userId: disconnectedUserId,
                  userName: leavingUser.user.fullName,
                });
              }
            }
          }
          userRooms.delete(disconnectedUserId);
        }

        io.emit("user_disconnected", disconnectedUserId);
      }
    });
  });
};
