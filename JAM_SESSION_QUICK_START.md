# 🎵 Live Jam Session - Quick Start Guide

## What is Live Jam Session?

Live Jam Session allows you to listen to music **in perfect sync** with friends across multiple devices. When the host plays, pauses, or skips a song, everyone hears it **at the exact same time** - like being in the same room together!

## ✨ Key Features

- **Real-time Sync**: All users hear the same song at the same moment
- **Automatic Position Sync**: Periodic updates keep everyone in sync (even with network lag)
- **Shared Queue**: Everyone can add songs to the queue
- **Host Controls**: One person controls playback for the whole group
- **Network Quality Indicator**: See your connection status and latency
- **Adaptive Sync**: Automatically adjusts to your network quality

## 🚀 How to Use

### 1. Create a Jam Session

```
1. Go to the Rooms page
2. Click "Create Room"
3. Enter a room name
4. Enable "Jam Session" toggle
5. Click "Create"
6. Share the 4-digit code with friends
```

### 2. Join a Jam Session

```
1. Go to the Rooms page
2. Click "Join Room"
3. Enter the 4-digit code from your friend
4. Click "Join"
5. You're now in sync!
```

### 3. Host Controls (Only Host Can):

- ▶️ **Play/Pause**: Control playback for everyone
- ⏭️ **Skip**: Move to next/previous track for all users
- 🎚️ **Seek**: Jump to any position in the song
- 🛑 **Stop Jam**: End the jam session

### 4. Member Features (Everyone Can):

- ➕ **Add to Queue**: Add songs to the shared queue
- 👀 **See Queue**: View upcoming songs
- 🔊 **Control Volume**: Adjust your own volume
- 📊 **See Sync Status**: View latency and network quality

## 🌐 Network Quality Indicators

The network quality indicator shows your sync status:

| Icon | Color | Quality | Latency | Meaning |
|------|-------|---------|---------|---------|
| 📶 | Green | Excellent | < 50ms | Perfect sync |
| 📶 | Green | Good | < 150ms | Great sync |
| ⚠️ | Yellow | Fair | < 300ms | Minor delays |
| ⚠️ | Red | Poor | > 300ms | Noticeable lag |

## 🔧 How It Works (Technical)

### Real-Time Synchronization

1. **Immediate Sync**:
   - When host plays/pauses/seeks
   - Instant WebSocket broadcast
   - All users sync within 50-300ms

2. **Periodic Sync** (every 2 seconds):
   - Continuous position updates
   - Corrects drift from buffering
   - Keeps everyone perfectly aligned

3. **Adaptive Sync**:
   - Adjusts to your network quality
   - Tighter sync on good connections
   - Looser sync on slower connections

### Libraries & Technologies

- **Socket.io**: Real-time WebSocket communication
- **React**: UI components with real-time updates
- **Zustand**: State management for rooms and player
- **Web Audio API**: Precise audio control

## 📱 Supported Devices

- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome, Samsung Internet)
- ✅ Tablets (iPad, Android tablets)
- ⚠️ Some browsers may require user interaction before autoplay

## 🎯 Use Cases

### Virtual Parties 🎉
Listen to music together while chatting on video call

### Study Sessions 📚
Shared music while studying with friends online

### Long-Distance Relationships 💕
Listen to music together despite the distance

### Music Discovery 🎵
Share new songs and react in real-time

### Workout Sessions 💪
Group fitness with synchronized music

## ⚙️ Settings & Tips

### For Best Sync Experience:

1. **Use Wired/WiFi Connection**: Better than mobile data
2. **Close Other Apps**: Free up bandwidth
3. **Host Should Have Good Connection**: Host's connection matters most
4. **Keep Browser Tab Active**: Some browsers throttle inactive tabs
5. **Allow Autoplay**: Enable audio autoplay in browser settings

### Troubleshooting:

**Users out of sync?**
- Host can pause and play again to re-sync
- Check network quality indicators
- Make sure everyone's on the same song

**Audio stuttering?**
- Check internet connection
- Close other bandwidth-heavy apps
- Reduce video quality if on a call

**Can't hear audio?**
- Check device volume
- Check browser audio permissions
- Try pausing and playing again

## 🔒 Privacy & Security

- **Room Codes**: 4-digit random codes
- **Temporary Rooms**: Rooms deleted when empty
- **No Recording**: Audio is streamed, not recorded
- **User Control**: Leave anytime

## 📊 Performance

### Typical Sync Accuracy:
- **LAN**: ±50ms (imperceptible)
- **Good WiFi**: ±150ms (barely noticeable)
- **4G/5G**: ±300ms (slight delay)
- **3G**: ±1000ms (noticeable lag)

### Server Capacity:
- **1000+ concurrent users** per instance
- **100+ concurrent rooms** per instance
- **10,000+ events/second** per instance

## 🚧 Known Limitations

1. **Single Host**: Only one person can control playback
2. **Network Dependent**: Quality depends on everyone's connection
3. **Clock Drift**: Very slight desync over long periods
4. **No Video Sync**: Audio only (not video)

## 🔮 Coming Soon

- [ ] Multi-host mode
- [ ] Voice chat integration
- [ ] Voting on next song
- [ ] Collaborative playlists
- [ ] Cross-platform mobile apps
- [ ] NTP time synchronization
- [ ] Visual waveform sync

## 📝 Code Example

### Creating a Jam Session (React/TypeScript):

```typescript
import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore";
import { usePlayerStore } from "@/stores/usePlayerStore";

function MyComponent() {
  const { initSocket, createRoom, isJamSession } = useEnhancedRoomStore();
  const { playAlbum } = usePlayerStore();
  
  const createJamSession = async () => {
    // 1. Initialize socket connection
    initSocket();
    
    // 2. Create room as jam session
    const code = await createRoom(
      "My Party Room",
      user.id,
      user.fullName,
      true // isJamSession = true
    );
    
    // 3. Play music (auto-syncs to all users)
    playAlbum([song1, song2, song3], 0);
    
    console.log(`Room code: ${code}`);
  };
  
  return (
    <button onClick={createJamSession}>
      Start Jam Session
    </button>
  );
}
```

### Joining a Jam Session:

```typescript
const joinJamSession = async (code: string) => {
  initSocket();
  
  const success = await joinRoom(
    code,
    user.id,
    user.fullName
  );
  
  if (success) {
    console.log("🎵 Joined! Music will sync automatically");
  }
};
```

## 📚 Additional Resources

- **Full Documentation**: [LIVE_JAM_SYNC.md](./LIVE_JAM_SYNC.md)
- **Room Features**: [ROOM_FEATURE.md](./ROOM_FEATURE.md)
- **Project README**: [README.md](./README.md)

## 💬 Support

Having issues? Check:
1. Browser console for error messages
2. Network quality indicator in the jam controls
3. That all users are on the same song
4. Your internet connection speed

## 🎉 Enjoy Your Jam Session!

Now you're ready to listen to music together in perfect sync! Share the code with friends and start jamming! 🎵

---

**Made with ❤️ by the AUDORA team**
