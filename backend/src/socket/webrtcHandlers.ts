// backend/src/socket/webrtcHandlers.ts

import { Server, Socket } from 'socket.io';

export const setupWebRTCHandlers = (io: Server, socket: Socket, rooms: Map<string, any>, userSockets: Map<string, string>) => {
  
  // Guest requests host to start streaming
  socket.on('request_host_stream', async ({ roomId }) => {
    try {
      console.log(`📡 Guest ${socket.id} requesting stream from room ${roomId}`);
      
      // Find the room
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('room_error', { message: 'Room not found' });
        return;
      }

      // Find the host socket ID
      const hostUserId = room.jamHost;
      const hostSocketId = hostUserId ? userSockets.get(hostUserId) : null;

      if (hostSocketId) {
        // Tell host to create offer for this guest
        io.to(hostSocketId).emit('create_offer_for_guest', {
          guestPeerId: socket.id,
          guestUserId: socket.data?.userId,
        });
        
        console.log(`✅ Notified host ${hostSocketId} to create offer for guest ${socket.id}`);
      } else {
        console.warn(`⚠ No host found for room ${roomId}`);
      }
    } catch (error) {
      console.error('Error handling stream request:', error);
    }
  });

  // Forward WebRTC offer from host to guest
  socket.on('webrtc_offer', ({ roomId, targetPeerId, offer }) => {
    console.log(`🔄 Forwarding WebRTC offer from ${socket.id} to ${targetPeerId}`);
    
    io.to(targetPeerId).emit('webrtc_offer', {
      fromPeerId: socket.id,
      offer: offer,
    });
  });

  // Forward WebRTC answer from guest to host
  socket.on('webrtc_answer', ({ roomId, targetPeerId, answer }) => {
    console.log(`🔄 Forwarding WebRTC answer from ${socket.id} to ${targetPeerId}`);
    
    io.to(targetPeerId).emit('webrtc_answer', {
      fromPeerId: socket.id,
      answer: answer,
    });
  });

  // Forward ICE candidates between peers
  socket.on('webrtc_ice_candidate', ({ roomId, targetPeerId, candidate }) => {
    io.to(targetPeerId).emit('webrtc_ice_candidate', {
      fromPeerId: socket.id,
      candidate: candidate,
    });
  });

  // Optional: Report connection quality metrics
  socket.on('webrtc_quality_report', ({ roomId, metrics }) => {
    console.log(`📊 Quality report from ${socket.id}:`, metrics);
    
    // Broadcast these metrics to others in the room (optional)
    socket.to(roomId).emit('peer_quality_update', {
      peerId: socket.id,
      metrics: metrics,
    });
  });
};
