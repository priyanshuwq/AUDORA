## AUDORA — Copilot / AI Contributor Instructions

AI agents working in AUDORA should understand the full-stack architecture, real-time sync patterns, and state management conventions. Keep responses short, act on changes, and prefer small, verifiable edits.

### Project Architecture

**Stack:** Full-stack music streaming app with React + Vite frontend (`frontend/`) and Express + Socket.io backend (`backend/`).

- **Backend:** Node.js/Express server at `backend/src/index.js` with Mongoose ODM, Socket.io for real-time, Clerk authentication, file uploads via `express-fileupload`.
- **Frontend:** React 18 + TypeScript + Vite with Zustand state management, Socket.io client, Clerk auth, Tailwind CSS + Radix UI components.
- **Database:** MongoDB with Mongoose models in `backend/src/models/` (User, Song, Album).
- **Real-time:** Socket.io handles jam session sync, room management, and user activity broadcasting.

### Dev Workflow & Commands

**Start services separately** (no monorepo orchestration):

```bash
# Backend (port 8000)
cd backend && npm install && npm run dev

# Frontend (port 5173)
cd frontend && npm install && npm run dev
```

**Music library import workflow:**

```bash
# 1. Place MP3s in frontend/public/songs or frontend/public/New songs
cd backend
npm run extract:metadata  # Extracts metadata to songs_metadata.json
npm run import:songs      # Imports to MongoDB
npm run seed:albums       # Auto-creates albums (3+ songs per artist)
```

**Production build:**

```bash
cd frontend && npm run build  # Builds to frontend/dist
# Backend serves frontend/dist when NODE_ENV=production
```

**Other useful scripts:**

- `npm run cleanup:songs` - Remove invalid DB entries
- `npm run remove:duplicates` - Deduplicate songs
- `npm run auto:match-albums` - Match songs to albums

### Critical Environment Variables

Backend (`.env` in `backend/`):

- `MONGODB_URI` (required in prod) - MongoDB connection string
- `PORT` (default: 8000) - Server port
- `FRONTEND_ORIGINS` (default: localhost:5173,5174,3000) - CORS allowed origins
- `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` - Clerk auth (warns if missing, not fatal in dev)
- `ADMIN_EMAILS` - Comma-separated admin emails for requireAdmin middleware

Frontend (`.env` in `frontend/`):

- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk auth public key

**Dev mode:** Loads from `backend/.env` via dotenv. **Production:** Set via deployment platform environment.

### State Management & Data Flow

**Frontend state:** Zustand stores in `frontend/src/stores/`:

- `usePlayerStore.ts` - Audio playback state (currentSong, isPlaying, queue, volume)
- `useEnhancedRoomStore.ts` - Room/jam session state, Socket.io connection, sync logic
- `useMusicStore.ts` - Song/album library data fetched from API
- `useAuthStore.ts` - Clerk user auth state

**Key pattern:** Stores initialize Socket.io connections and listen for events. Example from `useEnhancedRoomStore`:

```typescript
// Store initializes socket and registers event handlers
socket.on('shared_playback_sync', (data) => {
  // Update local state and trigger audio player sync
  set({ currentSharedSong: data.song, sharedPosition: data.position });
});
```

**API communication:** `frontend/src/lib/axios.ts` creates axios instance with base URL `/api` (proxies to backend in dev via Vite config).

### Real-Time Jam Session Architecture (Hybrid: WebRTC + Socket.io)

**Core concept:** Host streams real-time audio to guests via WebRTC (~50-200ms latency) while Socket.io handles room management, signaling, and playback controls.

**Key files:**

- `backend/src/lib/socket.js` - Server-side socket event handlers + WebRTC signaling
- `backend/src/socket/webrtcHandlers.ts` - WebRTC signaling handlers (offers/answers/ICE)
- `frontend/src/lib/webrtcAudioStream.ts` - WebRTCAudioStreamManager (peer connections, audio capture)
- `frontend/src/stores/useEnhancedRoomStore.ts` - Client socket + WebRTC integration
- `frontend/src/lib/jamSyncUtils.ts` - Sync utilities (AdaptiveSyncManager, AudioSyncManager)

**Hybrid workflow (WebRTC + Socket.io):**

1. **Room Management (Socket.io):** create_room, join_room, start_jam_session
2. **WebRTC Setup:** Guest emits `request_host_stream` → Server notifies host → SDP exchange
3. **Audio Streaming (WebRTC):** Host captures audio element output → streams to guests via WebRTC
4. **Playback Control (Socket.io):** Host emits `sync_playback` → all guests receive play/pause/seek commands
5. **Monitoring:** Audio quality metrics tracked (latency, packet loss, bitrate)

**Critical events** (maintain compatibility when changing):

**Socket.io (Room & Control):**
- `create_room`, `join_room`, `leave_room` - Room lifecycle
- `start_jam_session`, `stop_jam_session` - Toggle jam mode
- `sync_playback` - Host broadcasts playback state
- `shared_playback_sync`, `periodic_sync` - Server broadcasts to clients
- `add_to_shared_queue`, `remove_from_shared_queue` - Queue management

**WebRTC (Signaling):**
- `request_host_stream` - Guest requests audio stream from host
- `create_offer_for_guest` - Server tells host to create WebRTC offer
- `webrtc_offer`, `webrtc_answer` - SDP exchange
- `webrtc_ice_candidate` - ICE candidate exchange
- `peer_disconnected` - Cleanup on peer disconnect

**Adaptive sync:** `AdaptiveSyncManager` tracks latency history and adjusts:

- Sync threshold: 1s (good), 2s (medium), 3s (poor connection)
- Sync frequency: 2s (good), 3s (medium), 5s (poor connection)

### Routing & Authentication Patterns

**Backend routes** follow controller pattern:

- Routes defined in `backend/src/routes/*.route.js`
- Controllers in `backend/src/controller/*.controller.js`
- Mounted in `backend/src/index.js` under `/api/*`

**Example:**

```javascript
// backend/src/routes/song.route.js
router.get('/featured', getFeaturedSongs);

// backend/src/controller/song.controller.js
export const getFeaturedSongs = async (req, res, next) => { ... }
```

**Auth middleware** (`backend/src/middleware/auth.middleware.js`):

- `protectRoute` - Requires authenticated user via Clerk
- `requireAdmin` - Checks user email against ADMIN_EMAILS env var

**Frontend routing:** React Router in `frontend/src/App.tsx`. Main layout at `frontend/src/layout/MainLayout.tsx` wraps authenticated routes.

### Component Organization & Conventions

**Frontend structure:**

- `frontend/src/components/` - Shared/reusable components (PlayButton, RoomInterface, LiveJamControls)
- `frontend/src/pages/` - Route-level pages (HomePage, RoomsPage, AlbumPage)
- `frontend/src/layout/` - Layout components (MainLayout, LeftSidebar, AudioPlayer, PlaybackControls)

**Component naming:** PascalCase with descriptive names. File extension `.tsx` for React components.

**Styling:** Tailwind utility classes + Radix UI components. Custom components in `frontend/src/components/ui/` (shadcn pattern).

### Key Patterns & Conventions

**API Base Path:** All backend routes under `/api/*`. Frontend axios instance pre-configured with this base.

**Socket Event Naming:** Use snake_case (e.g., `shared_playback_sync`, `user_joined_room`). Keep event names stable across client/server.

**Static File Serving:**

- Music files: `frontend/public/songs/` or `frontend/public/New songs/`
- Album covers: `frontend/public/songs/covers/`, `frontend/public/extracted-covers/`
- Production: Backend serves `frontend/dist` when `NODE_ENV=production`

**File Uploads:** Server writes to `tmp/` directory. Cron job in `backend/src/index.js` cleans temp files hourly.

**Error Handling:**

- Backend: Global error handler in `backend/src/index.js`
- Frontend: Error boundaries in `frontend/src/components/ErrorBoundary.tsx`
- Toast notifications via `react-hot-toast`

### Debugging & Troubleshooting

**Backend startup issues:**

- Check `MONGODB_URI` and `CLERK_*` keys - server logs missing vars
- Health check: `GET /api/health` (checks DB, Clerk, frontend dist)
- CORS errors: Check `FRONTEND_ORIGINS` env var, server logs blocked origins

**Socket connection issues:**

- Dev: Ensure backend running on port 8000
- Production: Socket.io uses relative path `/socket.io`, served by same host
- Debug: Check browser console for socket connection errors

**Sync issues:**

- Check network quality indicator (calculated by `AdaptiveSyncManager`)
- Verify audio element exists and is not seeking (AudioSyncManager skips during seeks)
- Check server logs for `sync_playback` and `periodic_sync` emissions

### Safe Change Examples

**Add new API endpoint:**

1. Create `backend/src/routes/newfeature.route.js`
2. Create `backend/src/controller/newfeature.controller.js`
3. Wire route in `backend/src/index.js`: `app.use('/api/newfeature', newfeatureRoutes)`
4. Test with `GET /api/health` to verify server restart

**Add socket event:**

1. Define handler in `backend/src/lib/socket.js` (within `io.on('connection', ...)`block)
2. Add client listener in `frontend/src/stores/useEnhancedRoomStore.ts` (in `initSocket()`)
3. Emit from client using `socket.emit('event_name', data)`
4. Test in browser console: `window.__USE_ENHANCED_ROOM_STORE__.socket.emit(...)`

**Update Zustand store:**

1. Define action/state in store interface
2. Implement in store factory function (Zustand pattern)
3. Import and use in components: `const { action } = useStoreName()`

### What NOT to Assume

- **No top-level scripts:** Start backend/frontend separately (no npm workspace commands)
- **Environment setup:** Always check `.env` files exist before running scripts
- **Production secrets:** Don't commit secrets or assume cloud provider env vars are set
- **Module format:** Backend uses ES modules (`type: "module"` in package.json) - use `import/export`, not `require`
- **Frontend base URL:** Axios base URL changes between dev (localhost:8000) and prod (relative /api)

### Further Information

For deep dives, see:

- **Architecture:** README.md - feature overview, tech stack
- **Jam sessions:** LIVE_JAM_SYNC.md, JAM_SESSION_QUICK_START.md (if exist in repo root)
- **Deployment:** DEPLOYMENT.md (if exists)

Need examples for route scaffolding, socket event checklists, or env file templates? Ask and I'll provide specifics.
