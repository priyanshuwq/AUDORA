# 🎵 Live Jam Session - Visual Architecture Guide

## System Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Host      │         │   Backend   │         │  Members    │
│  (Device 1) │◄───────►│  Socket.io  │◄───────►│ (Device 2+) │
└─────────────┘         │   Server    │         └─────────────┘
                        └─────────────┘
                              │
                              │
                        ┌─────▼─────┐
                        │  MongoDB  │
                        └───────────┘
```

## Data Flow Diagram

### 1. Creating Jam Session

```
┌──────────┐                           ┌────────────────┐
│   Host   │                           │  Socket Server │
└────┬─────┘                           └────────┬───────┘
     │                                          │
     │ 1. create_room                           │
     │  { name, userId, isJamSession: true }   │
     ├─────────────────────────────────────────>│
     │                                          │
     │                                     ┌────▼────┐
     │                                     │Generate │
     │                                     │Room ID  │
     │                                     │& Code   │
     │                                     └────┬────┘
     │                                          │
     │ 2. room_created                          │
     │  { room, code: "4729" }                  │
     │<─────────────────────────────────────────┤
     │                                          │
     │ 3. Join Socket.io room                   │
     ├─────────────────────────────────────────>│
     │                                          │
```

### 2. Member Joining

```
┌──────────┐         ┌────────────────┐         ┌──────────┐
│  Member  │         │  Socket Server │         │   Host   │
└────┬─────┘         └────────┬───────┘         └────┬─────┘
     │                        │                      │
     │ 1. join_room           │                      │
     │  { code: "4729" }      │                      │
     ├───────────────────────>│                      │
     │                        │                      │
     │                   ┌────▼────┐                 │
     │                   │ Validate│                 │
     │                   │  Code   │                 │
     │                   └────┬────┘                 │
     │                        │                      │
     │ 2. room_joined         │                      │
     │  { room, isHost: false }                      │
     │<───────────────────────┤                      │
     │                        │                      │
     │                        │ 3. user_joined_room  │
     │                        │  { user: member }    │
     │                        ├─────────────────────>│
     │                        │                      │
```

### 3. Host Plays Song

```
┌──────────┐         ┌────────────────┐         ┌──────────┐
│   Host   │         │  Socket Server │         │  Member  │
└────┬─────┘         └────────┬───────┘         └────┬─────┘
     │                        │                      │
     │ 1. playAlbum([song])   │                      │
     │                        │                      │
     ├──┐ 2. Start playing    │                      │
     │  │    locally           │                      │
     │<─┘                     │                      │
     │                        │                      │
     │ 3. sync_playback       │                      │
     │  { song, position: 0,  │                      │
     │    isPlaying: true }   │                      │
     ├───────────────────────>│                      │
     │                        │                      │
     │                   ┌────▼────┐                 │
     │                   │Validate │                 │
     │                   │  Host   │                 │
     │                   └────┬────┘                 │
     │                        │                      │
     │                        │ 4. shared_playback_sync
     │                        │  { song, position,   │
     │                        │    isPlaying, time } │
     │                        ├─────────────────────>│
     │                        │                      │
     │                        │              ┌───────▼────┐
     │                        │              │ Calculate  │
     │                        │              │ Latency    │
     │                        │              └───────┬────┘
     │                        │                      │
     │                        │              ┌───────▼────┐
     │                        │              │ Adjust     │
     │                        │              │ Position   │
     │                        │              └───────┬────┘
     │                        │                      │
     │                        │              ┌───────▼────┐
     │                        │              │ Play Song  │
     │                        │              │ @ Position │
     │                        │              └────────────┘
     │                        │                      │
```

### 4. Periodic Sync (Every 2-5 seconds)

```
┌──────────┐         ┌────────────────┐         ┌──────────┐
│   Host   │         │  Socket Server │         │  Member  │
└────┬─────┘         └────────┬───────┘         └────┬─────┘
     │                        │                      │
     │ ┌──────────────────────▼──────┐               │
     │ │ setInterval(() => {         │               │
     │ │   if (isJamSession) {       │               │
     │ │     emit periodic_sync      │               │
     │ │   }                          │               │
     │ │ }, 2000);                   │               │
     │ └──────────────────┬──────────┘               │
     │                    │                          │
     │                    │ periodic_sync            │
     │                    │  { position: 15.2,       │
     │                    │    isPlaying: true }     │
     │                    ├─────────────────────────>│
     │                    │                          │
     │                    │                  ┌───────▼────┐
     │                    │                  │ Check Sync │
     │                    │                  │ Threshold  │
     │                    │                  └───────┬────┘
     │                    │                          │
     │                    │                  ┌───────▼────┐
     │                    │                  │ If > 2s    │
     │                    │                  │ out of sync│
     │                    │                  │ → Adjust   │
     │                    │                  └────────────┘
     │                    │                          │
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       React Application                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              LiveJamControls Component                  │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ • Displays jam session UI                              │ │
│  │ • Shows network quality indicator                      │ │
│  │ • Handles user interactions                            │ │
│  │ • Listens to sync events                               │ │
│  └──────────┬──────────────────────────┬──────────────────┘ │
│             │                          │                     │
│  ┌──────────▼───────────┐   ┌──────────▼────────────┐      │
│  │ useEnhancedRoomStore │   │   usePlayerStore      │      │
│  ├──────────────────────┤   ├───────────────────────┤      │
│  │ • Socket.io client   │   │ • Audio playback     │      │
│  │ • Room state         │   │ • Queue management    │      │
│  │ • Sync methods       │   │ • Play/Pause/Skip     │      │
│  └──────────┬───────────┘   └──────────┬────────────┘      │
│             │                          │                     │
│             └──────────┬───────────────┘                     │
│                        │                                     │
│         ┌──────────────▼─────────────────┐                  │
│         │      AudioSyncManager          │                  │
│         ├────────────────────────────────┤                  │
│         │ • Latency compensation         │                  │
│         │ • Adaptive sync thresholds     │                  │
│         │ • Network quality detection    │                  │
│         │ • Smooth seeking               │                  │
│         └──────────────┬─────────────────┘                  │
│                        │                                     │
│         ┌──────────────▼─────────────────┐                  │
│         │      <audio> HTML Element      │                  │
│         ├────────────────────────────────┤                  │
│         │ • Actual audio playback        │                  │
│         │ • currentTime manipulation     │                  │
│         │ • play() / pause() calls       │                  │
│         └────────────────────────────────┘                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## State Flow Diagram

```
┌────────────────────────────────────────────────┐
│           Room Store State                     │
├────────────────────────────────────────────────┤
│                                                │
│  isJamSession: boolean                         │
│       │                                        │
│       ├─ false ──> "Create Jam Session" UI    │
│       │                                        │
│       └─ true ──> Shows jam controls           │
│                      │                         │
│  isJamHost: boolean  │                         │
│       │              │                         │
│       ├─ true ──┐    │                         │
│       │         │    │                         │
│       │    ┌────▼────▼───┐                     │
│       │    │  HOST UI    │                     │
│       │    ├─────────────┤                     │
│       │    │ • [👑 HOST] │                     │
│       │    │ • Play/Pause│                     │
│       │    │ • Seek bar  │                     │
│       │    │ • Skip btns │                     │
│       │    │ • Stop Jam  │                     │
│       │    └─────────────┘                     │
│       │                                        │
│       └─ false ──┐                             │
│                  │                             │
│             ┌────▼─────────┐                   │
│             │  MEMBER UI   │                   │
│             ├──────────────┤                   │
│             │ • [📶 150ms] │                   │
│             │ • Read-only  │                   │
│             │ • Sync info  │                   │
│             │ • Queue view │                   │
│             └──────────────┘                   │
│                                                │
│  currentSharedSong: Song | null                │
│  sharedPosition: number                        │
│  sharedIsPlaying: boolean                      │
│  sharedQueue: Song[]                           │
│                                                │
└────────────────────────────────────────────────┘
```

## Sync Timing Diagram

```
Time (ms) │  Host Device          Server              Member Device
──────────┼──────────────────────────────────────────────────────────
     0    │  User clicks Play                     
          │  ▼                                     
    10    │  Audio starts                          
          │  ▼                                     
    100   │  sync_playback ───────►               
          │                         ▼              
    150   │                    Validate            
          │                         ▼              
    200   │                    Broadcast ─────────►
          │                                        ▼
    250   │                                   Receive event
          │                                        ▼
    260   │                                   Calculate latency (60ms)
          │                                        ▼
    270   │                                   Adjust position (0 + 0.06s)
          │                                        ▼
    280   │                                   Start playback @ 0.06s
          │                                        ▼
          │  ────────── SYNCED ───────────────────
          │                                        
   2000   │                    periodic_sync      
          │                         │              
          │                         └─────────────►
          │                                        ▼
          │                                   Check if out of sync
          │                                        ▼
          │                                   Adjust if needed
          │                                        
   4000   │                    periodic_sync      
          │                         │              
          │                         └─────────────►
          │                                        
    ...   │                    (continues)         
```

## Network Quality Visualization

```
Excellent (< 50ms)
┌──────────────────────────────────┐
│ [📶] < 1ms                       │
│ ━━━━━━━━━━ 100% sync            │
└──────────────────────────────────┘
Threshold: 1 second
Frequency: Every 2 seconds


Good (< 150ms)
┌──────────────────────────────────┐
│ [📶] 120ms                       │
│ ━━━━━━━━━░ 95% sync             │
└──────────────────────────────────┘
Threshold: 1 second
Frequency: Every 2 seconds


Fair (< 300ms)
┌──────────────────────────────────┐
│ [⚠️] 250ms                       │
│ ━━━━━━━░░░ 85% sync             │
└──────────────────────────────────┘
Threshold: 2 seconds
Frequency: Every 3 seconds


Poor (> 300ms)
┌──────────────────────────────────┐
│ [⚠️] 450ms                       │
│ ━━━━━░░░░░ 70% sync             │
└──────────────────────────────────┘
Threshold: 3 seconds
Frequency: Every 5 seconds
```

## Error Handling Flow

```
┌────────────────┐
│  Sync Event    │
│   Received     │
└───────┬────────┘
        │
        ▼
┌────────────────┐      NO      ┌─────────────────┐
│  Is Host?      ├─────────────►│ Apply Sync      │
└───────┬────────┘               └────────┬────────┘
        │ YES                             │
        ▼                                 ▼
┌────────────────┐               ┌─────────────────┐      NO
│  Ignore Sync   │               │ Audio Element   ├────────►┌──────────┐
└────────────────┘               │   Exists?       │         │  Wait &  │
                                 └────────┬────────┘         │  Retry   │
                                          │ YES              └──────────┘
                                          ▼
                                 ┌─────────────────┐
                                 │ Calculate       │
                                 │ Adjusted Pos    │
                                 └────────┬────────┘
                                          │
                                          ▼
                                 ┌─────────────────┐      YES
                                 │ Out of Sync?    ├────────►┌──────────┐
                                 │ (> threshold)   │         │  Seek    │
                                 └────────┬────────┘         └──────────┘
                                          │ NO
                                          ▼
                                 ┌─────────────────┐
                                 │  Continue       │
                                 │  Playing        │
                                 └─────────────────┘
```

## File Structure

```
AUDORA/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── LiveJamControls.tsx       ← UI Component
│   │   ├── stores/
│   │   │   ├── useEnhancedRoomStore.ts   ← Room State
│   │   │   └── usePlayerStore.ts         ← Player State
│   │   └── lib/
│   │       └── jamSyncUtils.ts           ← Sync Utilities ✨ NEW
│   └── public/
│       └── songs/                        ← Music Files
│
├── backend/
│   └── src/
│       └── lib/
│           └── socket.js                 ← Socket.io Server
│
└── docs/
    ├── LIVE_JAM_SYNC.md                  ← Technical Docs ✨ NEW
    ├── JAM_SESSION_QUICK_START.md        ← User Guide ✨ NEW
    ├── IMPLEMENTATION_SUMMARY.md         ← This Summary ✨ NEW
    ├── VISUAL_ARCHITECTURE.md            ← This File ✨ NEW
    └── README.md                         ← Project Overview ✨ UPDATED
```

## Legend

```
Symbol Guide:
─────►  Data flow / Event emission
◄─────  Response / Callback
┌─────┐ Component / System
│     │ Container
└─────┘
  ▼    Sequential step
  │    Connection
  ├──  Branch / Decision
✨     New/Enhanced feature
```

---

This visual guide helps understand the complete architecture and data flow of the Live Jam Session feature!
