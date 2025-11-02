// frontend/src/lib/webrtcAudioStream.ts

interface PeerConnection {
  peerId: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

export class WebRTCAudioStreamManager {
  private peerConnections: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private socket: any;
  private roomId: string | null = null;
  private isHost: boolean = false;
  private onRemoteStream?: (stream: MediaStream, peerId: string) => void;
  private audioContext: AudioContext | null = null;
  private audioSource: MediaElementAudioSourceNode | null = null;
  private audioDestination: MediaStreamAudioDestinationNode | null = null;

  // STUN servers for NAT traversal (Google's free public STUN servers)
  private iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ];

  constructor(socket: any) {
    this.socket = socket;
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    // WebRTC Signaling events
    this.socket.on('webrtc_offer', this.handleOffer.bind(this));
    this.socket.on('webrtc_answer', this.handleAnswer.bind(this));
    this.socket.on('webrtc_ice_candidate', this.handleIceCandidate.bind(this));
    this.socket.on('peer_disconnected', this.handlePeerDisconnected.bind(this));
  }

  // Initialize as host - capture audio from audio element
  async initializeAsHost(roomId: string, audioElement: HTMLAudioElement) {
    this.roomId = roomId;
    this.isHost = true;

    try {
      // Create audio context to capture audio element output
      this.audioContext = new AudioContext();
      
      // Create a media element source from the audio element
      this.audioSource = this.audioContext.createMediaElementSource(audioElement);
      
      // Create destination for streaming
      this.audioDestination = this.audioContext.createMediaStreamDestination();
      
      // Connect audio element to both destination (for streaming) and speakers
      const splitter = this.audioContext.createChannelSplitter(2);
      if (this.audioSource) {
        this.audioSource.connect(splitter);
        splitter.connect(this.audioDestination);
        splitter.connect(this.audioContext.destination); // So host can hear too
      }
      
      this.localStream = this.audioDestination.stream;
      
      console.log('✅ Host audio stream initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize host audio stream:', error);
      return false;
    }
  }

  // Initialize as guest - prepare to receive audio
  async initializeAsGuest(roomId: string, onStreamCallback: (stream: MediaStream, peerId: string) => void) {
    this.roomId = roomId;
    this.isHost = false;
    this.onRemoteStream = onStreamCallback;

    console.log('✅ Guest initialized, waiting for host stream');
    
    // Request stream from host
    this.socket.emit('request_host_stream', { roomId });
    return true;
  }

  // Create peer connection for a specific user
  private createPeerConnection(peerId: string): RTCPeerConnection {
    const peerConnection = new RTCPeerConnection({
      iceServers: this.iceServers,
    });

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('webrtc_ice_candidate', {
          roomId: this.roomId,
          targetPeerId: peerId,
          candidate: event.candidate,
        });
      }
    };

    // Handle incoming stream (for guests)
    peerConnection.ontrack = (event) => {
      console.log('📥 Received remote audio track from:', peerId);
      if (this.onRemoteStream && event.streams[0]) {
        this.onRemoteStream(event.streams[0], peerId);
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log(`WebRTC connection state (${peerId}):`, peerConnection.connectionState);
      
      if (peerConnection.connectionState === 'failed') {
        console.error('Connection failed, attempting restart');
        peerConnection.restartIce();
      }
    };

    this.peerConnections.set(peerId, { peerId, connection: peerConnection });
    return peerConnection;
  }

  // Host: Create offer and send to guest
  async createOfferForPeer(peerId: string) {
    if (!this.isHost || !this.localStream) {
      console.error('Cannot create offer: not host or no local stream');
      return;
    }

    const peerConnection = this.createPeerConnection(peerId);

    // Add local stream tracks to peer connection
    this.localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, this.localStream!);
    });

    try {
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: false, // Host only sends, doesn't receive
        offerToReceiveVideo: false,
      });
      
      await peerConnection.setLocalDescription(offer);

      this.socket.emit('webrtc_offer', {
        roomId: this.roomId,
        targetPeerId: peerId,
        offer: offer,
      });

      console.log('📤 Sent WebRTC offer to:', peerId);
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  // Guest: Handle incoming offer from host
  private async handleOffer(data: { fromPeerId: string; offer: RTCSessionDescriptionInit }) {
    const { fromPeerId, offer } = data;
    console.log('📨 Received WebRTC offer from:', fromPeerId);

    const peerConnection = this.createPeerConnection(fromPeerId);

    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      this.socket.emit('webrtc_answer', {
        roomId: this.roomId,
        targetPeerId: fromPeerId,
        answer: answer,
      });

      console.log('📤 Sent WebRTC answer to:', fromPeerId);
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  // Host: Handle incoming answer from guest
  private async handleAnswer(data: { fromPeerId: string; answer: RTCSessionDescriptionInit }) {
    const { fromPeerId, answer } = data;
    console.log('📨 Received WebRTC answer from:', fromPeerId);

    const peer = this.peerConnections.get(fromPeerId);
    if (peer) {
      try {
        await peer.connection.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('✅ WebRTC connection established with:', fromPeerId);
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    }
  }

  // Handle ICE candidates
  private async handleIceCandidate(data: { fromPeerId: string; candidate: RTCIceCandidateInit }) {
    const { fromPeerId, candidate } = data;
    
    const peer = this.peerConnections.get(fromPeerId);
    if (peer) {
      try {
        await peer.connection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  }

  // Handle peer disconnection
  private handlePeerDisconnected(data: { peerId: string }) {
    const { peerId } = data;
    console.log('👋 Peer disconnected:', peerId);
    
    const peer = this.peerConnections.get(peerId);
    if (peer) {
      peer.connection.close();
      this.peerConnections.delete(peerId);
    }
  }

  // Get connection statistics
  async getStats(peerId: string): Promise<RTCStatsReport | null> {
    const peer = this.peerConnections.get(peerId);
    if (peer) {
      return await peer.connection.getStats();
    }
    return null;
  }

  // Monitor audio levels (useful for debugging)
  monitorAudioLevel(stream: MediaStream, callback: (level: number) => void) {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    
    source.connect(analyser);
    analyser.fftSize = 256;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const checkLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      callback(average);
      requestAnimationFrame(checkLevel);
    };
    
    checkLevel();
  }

  // Cleanup
  cleanup() {
    // Close all peer connections
    this.peerConnections.forEach(peer => {
      peer.connection.close();
    });
    this.peerConnections.clear();

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    console.log('🧹 WebRTC cleanup complete');
  }

  // Get connection quality metrics
  async getConnectionQuality(peerId: string): Promise<{
    bitrate: number;
    packetLoss: number;
    jitter: number;
    latency: number;
  } | null> {
    const stats = await this.getStats(peerId);
    if (!stats) return null;

    let bitrate = 0;
    let packetLoss = 0;
    let jitter = 0;
    let latency = 0;

    stats.forEach(report => {
      if (report.type === 'inbound-rtp' && report.mediaType === 'audio') {
        bitrate = report.bytesReceived * 8 / report.timestamp;
        packetLoss = report.packetsLost / (report.packetsReceived + report.packetsLost) * 100;
        jitter = report.jitter * 1000; // Convert to ms
      }
      
      if (report.type === 'candidate-pair' && report.state === 'succeeded') {
        latency = report.currentRoundTripTime * 1000; // Convert to ms
      }
    });

    return { bitrate, packetLoss, jitter, latency };
  }
}
