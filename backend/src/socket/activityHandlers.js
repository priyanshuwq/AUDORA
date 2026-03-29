// Activity & Connection Socket Handlers

/**
 * Setup activity and connection handlers for a socket connection
 */
export const setupActivityHandlers = (io, socket, { userSockets, userActivities }) => {
  
  socket.on("user_connected", (userId) => {
    userSockets.set(userId, socket.id);
    userActivities.set(userId, "Idle");

    // Broadcast to all connected sockets that this user just logged in
    io.emit("user_connected", userId);
    socket.emit("users_online", Array.from(userSockets.keys()));
    io.emit("activities", Array.from(userActivities.entries()));
  });

  socket.on("update_activity", ({ userId, activity }) => {
    console.log("activity updated", userId, activity);
    userActivities.set(userId, activity);
    io.emit("activity_updated", { userId, activity });
  });
};

/**
 * Handle socket disconnect and cleanup
 */
export const handleDisconnect = (io, socket, { rooms, roomCodes, userRooms, userSockets, userActivities }) => {
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
          const wasHost = room.jamSession?.hostUserId === disconnectedUserId;
          room.users.splice(userIndex, 1);

          if (room.users.length === 0) {
            rooms.delete(roomId);
            roomCodes.delete(room.code);
          } else {
            socket.to(roomId).emit("user_left_room", {
              userId: disconnectedUserId,
              userName: leavingUser.user.fullName,
              wasHost,
            });
            // Notify WebRTC peers that this peer disconnected
            socket.to(roomId).emit("peer_disconnected", {
              peerId: socket.id,
            });
          }
        }
      }
      userRooms.delete(disconnectedUserId);
    }

    io.emit("user_disconnected", disconnectedUserId);
  }
};
