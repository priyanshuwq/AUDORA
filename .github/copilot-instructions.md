# Copilot Instructions for AUDORA

## Architecture: Two-App Monorepo with Real-Time Music Sync

**Backend** (Node/Express/MongoDB/Socket.io):
- Entry: `backend/src/index.js` wires Express routes, Clerk auth middleware (only on `/api/*`), Socket.io server, and static serving.
- Models: `Song` and `Album` in `backend/src/models/*.model.js`. Room state is **in-memory** (not persisted).
- Real-time: `backend/src/lib/socket.js` manages rooms, users, and broadcasts events. Core data structures: `rooms` Map, `roomCodes` Map, `userRooms` Map.
- Periodic sync: `setInterval` every 2 seconds emits `periodic_sync` for jam sessions to keep clients aligned.

**Frontend** (React 18/TypeScript/Vite/Tailwind/Zustand/Clerk):
- Entry: `frontend/src/main.tsx` → routes in `App.tsx`.
- State: Zustand stores in `frontend/src/stores/`. **Always use `useEnhancedRoomStore`** for jam/room features (not the legacy `useRoomStore`).
- API client: `frontend/src/lib/axios.ts` exports `axiosInstance` with env-aware base URL (`/api` prod, `http://localhost:8000/api` dev).
- Vite alias: `@/` → `frontend/src/`. Example: `import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore"`.

**Key Sync Architecture**:
- Host emits `sync_playback` → server broadcasts `shared_playback_sync` → clients apply with latency compensation via `AudioSyncManager` in `frontend/src/lib/jamSyncUtils.ts`.
- Adaptive sync thresholds: Good connection (1s), fair (2s), poor (3s). Network quality shown in UI via WiFi icon + latency.

## Development Workflow

**Start Dev (two terminals)**:
```bash
# Terminal 1 - Backend on port 8000
cd backend && npm run dev

# Terminal 2 - Frontend on port 5173
cd frontend && npm run dev
```

**Environment Files**:
- `backend/.env`: `PORT=8000`, `MONGODB_URI=...`, `FRONTEND_ORIGINS=http://localhost:5173`, `ADMIN_EMAILS=...`, optional `CLOUDINARY_*`.
- `frontend/.env`: `VITE_CLERK_PUBLISHABLE_KEY=...`.

**Production Build** (from root):
```bash
npm run build   # Installs deps, builds frontend to dist
npm start       # Runs backend, serves frontend/dist + API
```

## Song Ingestion (Import Your Music)

1. **Place MP3 files** in `frontend/public/songs` or `frontend/public/New songs`.
   - Optional covers in `frontend/public/New songs/covers` (png/jpg/webp). Match by filename or artist/title.
2. **Extract metadata**: `cd backend && npm run extract:metadata`
   - Creates `backend/src/seeds/generatedSongs.js`.
   - Extracts embedded album art to `frontend/public/extracted-covers/`.
   - Fallback to `frontend/public/cover-images` or round-robin defaults.
3. **Import to MongoDB**: `npm run import:songs`
   - Clears existing songs, inserts new ones.
   - Auto-creates albums per artist (3+ songs) and sets `albumId` references.

**Other Data Scripts** (all in `backend/`):
- `npm run cleanup:songs` - Remove orphaned songs
- `npm run remove:duplicates` - Dedupe by title+artist
- `npm run auto:match-albums` - Re-link songs to albums

## Socket.io Events & Jam Sessions

**Client → Server**:
- `create_room` (roomName, userId, userName, isJamSession) → get 4-digit code
- `join_room` (code, userId, userName)
- `update_song` (roomId, song, isPlaying, position, timestamp) - for individual listening
- `sync_playback` (roomId, song, position, isPlaying) - **jam host only**, broadcasts to all

**Server → Client**:
- `room_created` (room, code)
- `room_joined` (room, isHost)
- `shared_playback_sync` (song, position, isPlaying, serverTime) - **immediate sync**
- `periodic_sync` (song, position, isPlaying, serverTime) - **every 2s background**

**Jam Session Flow**:
1. Host creates room with `isJamSession=true`.
2. Friends join via 4-digit code.
3. Host plays → `usePlayerStore.playAlbum()` → after 100ms delay, `roomStore.syncPlayback()`.
4. Server broadcasts `shared_playback_sync` with `serverTime: Date.now()`.
5. Clients calculate latency, adjust position via `AudioSyncManager.applySync()`.
6. Periodic sync keeps everyone aligned; adaptive thresholds handle poor connections.

## State Management Patterns (Zustand)

**usePlayerStore** (`frontend/src/stores/usePlayerStore.ts`):
- Manages `currentSong`, `isPlaying`, `queue`, `currentIndex`.
- On `playAlbum`/`togglePlay`/`playNext`: calls `updateRoomSong()` helper, then if jam host, emits `sync_playback` after 100ms delay.
- Always use `getCurrentAudioPosition()` helper to get accurate `audio.currentTime`.

**useEnhancedRoomStore** (`frontend/src/stores/useEnhancedRoomStore.ts`):
- Socket lifecycle: `initSocket()`, `disconnectSocket()`.
- Room actions: `createRoom()`, `joinRoom()`, `leaveRoom()`.
- Jam controls: `startJamSession()`, `stopJamSession()`, `syncPlayback()`, `toggleSharedPlayback()`, `addToSharedQueue()`.
- On `shared_playback_sync` event: updates state, imports `usePlayerStore` dynamically, syncs audio element.
- **Pattern**: Always check `isJamHost` before emitting host-only events.

## API Routes & Backend Conventions

**Health**: `GET /api/health` - Returns status, env, uptime, checks (mongodb, clerk, frontend).

**Songs**:
- `GET /api/songs` - All songs
- `GET /api/songs/featured`, `/made-for-you`, `/trending` - Curated lists
- `GET /api/songs/search?query=...` - Search by title/artist

**Albums**:
- `GET /api/albums` - All albums
- `GET /api/albums/:albumId` - Single album with populated songs

**Admin** (requires `ADMIN_EMAILS` env):
- `POST /api/admin/songs` - Create song
- `DELETE /api/admin/songs/:id` - Delete song
- `POST /api/admin/albums` - Create album
- `DELETE /api/admin/albums/:id` - Delete album

**Backend Middleware Stack** (`backend/src/index.js`):
1. `app.set('trust proxy', 1)` - Critical for Render/proxies, fixes rate-limit header errors.
2. CORS on `/api` - Checks `FRONTEND_ORIGINS` env or allows same-origin in prod.
3. `helmet()` - Security headers with CSP for Clerk/Cloudflare.
4. `rateLimit` - 200 requests per 15 min on `/api`.
5. `clerkMiddleware()` - Only on `/api` routes; error handler catches auth failures.
6. `express-fileupload` - Uploads to `tmp/`, cleaned hourly via `node-cron`.

## Clerk Authentication Integration

**Frontend**:
- Wrap app with `<ClerkProvider>` in `main.tsx`.
- Use `useUser()` hook for current user; check `user.id`, `user.fullName`, `user.imageUrl`.
- Auth callback: `POST /api/auth/callback` stores Clerk users in MongoDB.

**Backend**:
- `requireAuth` middleware in `backend/src/middleware/auth.middleware.js` checks `req.auth.userId`.
- `requireAdmin` checks if `userId` email (from Clerk) is in `ADMIN_EMAILS` env (comma-separated).
- **Critical**: Only apply `clerkMiddleware()` to `/api/*` routes, not static serving or Socket.io.

## Production Deployment (Render/Heroku/etc.)

**Key Fixes Applied**:
- `trust proxy` set to 1 (fixes rate-limit error).
- Socket.io CORS allows same-origin in prod: checks `origin` header, allows if not localhost.
- Frontend dist check: logs error if `frontend/dist` missing; provide helpful message to run `npm run build`.
- Env validation: exits with error if `MONGODB_URI` missing in production.

**Environment Variables** (set in dashboard):
- `NODE_ENV=production`
- `MONGODB_URI=...` (MongoDB Atlas connection string)
- `PORT=8000` (or let platform auto-assign)
- `FRONTEND_ORIGINS=https://your-app.onrender.com` (your deployment URL)
- `CLERK_PUBLISHABLE_KEY=pk_live_...`
- `CLERK_SECRET_KEY=sk_live_...`
- `ADMIN_EMAILS=admin@example.com` (comma-separated)

**Static Serving**: Backend serves `frontend/dist` for all non-API routes via `express.static` and catch-all `res.sendFile('index.html')`.

## Common Pitfalls

1. **CORS blocked**: Set `FRONTEND_ORIGINS` to include dev URL (`http://localhost:5173`). In prod, server auto-allows same-origin.
2. **Socket.io fails to connect**: Check browser console for CORS errors. Verify `getSocketUrl()` in stores returns correct URL.
3. **Using wrong store**: Always use `useEnhancedRoomStore`, not `useRoomStore` (legacy).
4. **Sync not working**: Check `isJamHost` in `useEnhancedRoomStore`. Only host can emit `sync_playback`.
5. **Missing env keys**: Frontend shows notice if `VITE_CLERK_PUBLISHABLE_KEY` absent. Backend logs which envs loaded at startup.
6. **Trust proxy not set**: Rate-limit will error with "X-Forwarded-For not trusted". Already fixed in `index.js`.

## Testing Jam Sessions

1. Create room with jam session enabled → get 4-digit code.
2. Join from another browser/device with code.
3. Host plays song → check all clients sync within 50-300ms.
4. Check network indicator (WiFi icon + latency) in UI.
5. Test poor connection: throttle network in DevTools, verify adaptive sync increases threshold to 3s.

## Debugging Tips

**Enable Socket.io debug logs**:
```javascript
// In browser console
localStorage.debug = 'socket.io-client:*';
```

**Access store state**:
```javascript
// Stores are exposed on window after connection
window.__USE_ENHANCED_ROOM_STORE__
```

**Check audio element**:
```javascript
const audio = document.querySelector('audio');
console.log('Ready state:', audio.readyState);
console.log('Current time:', audio.currentTime);
console.log('Paused:', audio.paused);
```

**Force re-sync** (if out of sync):
- Host pauses then plays again.
- Or manually: `useEnhancedRoomStore.getState().syncPlayback(song, position, isPlaying)`.

## Code Examples

**Create Jam Session**:
```typescript
const { initSocket, createRoom } = useEnhancedRoomStore();

initSocket();
const code = await createRoom("My Party", userId, userName, true); // isJamSession=true
console.log(`Room code: ${code}`); // e.g., "4729"
```

**Join & Listen**:
```typescript
const { initSocket, joinRoom } = useEnhancedRoomStore();

initSocket();
const success = await joinRoom("4729", userId, userName);
// Music auto-syncs via shared_playback_sync events
```

**Play as Host** (triggers sync):
```typescript
const { playAlbum } = usePlayerStore();
playAlbum([song1, song2], 0); // Starts playback, emits sync after 100ms
```

**Add to Shared Queue**:
```typescript
const { addToSharedQueue } = useEnhancedRoomStore();
addToSharedQueue(song); // Broadcasts to all users
```
