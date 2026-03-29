// Jam Session Socket Handlers

/**
 * Setup jam session handlers for a socket connection
 */
export const setupJamSessionHandlers = (io, socket, { rooms, userSockets }) => {
  
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

  socket.on("sync_playback", ({ roomId, song, position, isPlaying, timestamp }) => {
    try {
      const room = rooms.get(roomId);
      if (!room || !room.isJamSession) {
        return;
      }

      // Allow any user in jam session to control playback
      const user = room.users.find(
        (u) => userSockets.get(u.user._id) === socket.id
      );
      if (!user) {
        return;
      }

      // Update room state with precise timestamp for sync
      room.currentSharedSong = song;
      room.sharedPosition = position;
      room.sharedIsPlaying = isPlaying;
      room.lastUpdateTime = Date.now();
      const syncTimestamp = room.lastUpdateTime;

      // Immediate broadcast to all users in room with accurate timing
      io.to(roomId).emit("shared_playback_sync", {
        song,
        position,
        isPlaying,
        timestamp: syncTimestamp,
        serverTime: syncTimestamp,
        controlledBy: user.user.fullName,
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

      console.log(
        `🎵 ${user.user.fullName} synced playback: ${song.title} at ${position.toFixed(1)}s`
      );
    } catch (error) {
      console.error("Error syncing playback:", error);
    }
  });

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
};

/**
 * Start periodic sync interval for jam sessions
 */
export const startPeriodicSync = (io, rooms) => {
  setInterval(() => {
    rooms.forEach((room) => {
      if (room.isJamSession && room.jamHost && room.currentSharedSong) {
        // Calculate expected position based on time elapsed
        const now = Date.now();
        const timeSinceUpdate = (now - (room.lastUpdateTime || now)) / 1000;
        const expectedPosition = room.sharedIsPlaying
          ? room.sharedPosition + timeSinceUpdate
          : room.sharedPosition;

        // Send periodic sync updates to ensure all clients stay in sync
        io.to(room.id).emit("periodic_sync", {
          song: room.currentSharedSong,
          position: expectedPosition,
          isPlaying: room.sharedIsPlaying,
          serverTime: now,
        });
      }
    });
  }, 5000); // Every 5 seconds
};
