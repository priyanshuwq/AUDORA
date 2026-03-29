// Room Management Socket Handlers

/**
 * Generate a unique 4-digit room code
 */
export const generateRoomCode = (roomCodes) => {
  let code;
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString();
  } while (roomCodes.has(code));
  return code;
};

/**
 * Setup room management handlers for a socket connection
 */
export const setupRoomHandlers = (io, socket, { rooms, roomCodes, userRooms, userSockets }) => {
  
  socket.on("create_room", ({ roomName, userId, userName, isJamSession = false }) => {
    try {
      const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const code = generateRoomCode(roomCodes);

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
        `${isJamSession ? "Jam" : "Music"} room created: ${roomName} (${code}) by ${userName}`
      );
    } catch (error) {
      socket.emit("room_error", { message: "Failed to create room" });
    }
  });

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
      const wasHost = room.jamSession?.hostUserId === leavingUser.user._id;
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
          wasHost,
        });
      }

      console.log(`${leavingUser.user.fullName} left room ${room.name}`);
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  });

  socket.on("update_song", ({ roomId, song, isPlaying, timestamp, position = 0, lastUpdateTime }) => {
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
  });
};
