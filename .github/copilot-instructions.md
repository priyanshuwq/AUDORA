## AUDORA — AI Coding Agent Guide

Full-stack music streaming platform with real-time collaborative jam sessions. Keep edits small, test locally, and touch one component at a time (route/controller OR store/component OR socket handler).

### Architecture Overview

**Stack:** React + TypeScript + Vite frontend (`frontend/`) with ES module Express backend (`backend/`), MongoDB, Socket.io for real-time sync, WebRTC for audio streaming.

**Key entry points:**
- Backend: `backend/src/index.js` (server boot, CORS, Clerk auth, rate limiting). Routes in `backend/src/routes/*.route.js`, controllers in `backend/src/controller/*.controller.js`
- Socket & WebRTC: `backend/src/lib/socket.js` (room management, periodic sync), `backend/src/socket/webrtcHandlers.ts` (WebRTC signaling)
- Models: `backend/src/models/` — Mongoose schemas (Song, Album, User)
- Frontend stores: `frontend/src/stores/useEnhancedRoomStore.ts` (socket + WebRTC + room state), `frontend/src/stores/usePlayerStore.ts` (playback state)
- WebRTC audio: `frontend/src/lib/webrtcAudioStream.ts`, sync helpers in `frontend/src/lib/jamSyncUtils.ts`

### Dev Workflow (Critical)

**Start services separately** (no monorepo):
```bash
# Backend (port 8000, loads backend/.env)
cd backend && npm install && npm run dev

# Frontend (port 5173, loads frontend/.env)
cd frontend && npm install && npm run dev
```

**Import local MP3s to MongoDB:**
```bash
# 1. Place MP3s in frontend/public/songs/ or frontend/public/New songs/
cd backend
npm run extract:metadata  # → songs_metadata.json
npm run import:songs      # → inserts to MongoDB
npm run seed:albums       # → auto-groups albums (3+ songs/artist)
```

**Health check:** `GET /api/health` (backend must respond)

### Conventions & Gotchas

**Module system:** Backend uses ES modules (`package.json` has `"type": "module"`). Always use `import/export`, never `require()`.

**Socket event naming:** Use `snake_case` (e.g., `shared_playback_sync`, `sync_playback`, `periodic_sync`). Keep names synchronized across client and server.

**Socket lifecycle pattern:**
1. Backend registers handlers in `backend/src/lib/socket.js` under `io.on('connection', socket => { ... })`
2. Frontend stores initialize socket in `initSocket()` (see `useEnhancedRoomStore.ts`) and register listeners
3. When adding new socket events: add handler in `socket.js` backend first, then add `socket.on('event_name', ...)` in relevant store

**API routing pattern:**
- Frontend axios calls use `/api/*` base path (configured in `frontend/src/lib/axios.ts`)
- In dev, Vite proxies to backend (no proxy config needed, handled via baseURL)
- Backend routes: `backend/src/index.js` wires routes like `app.use('/api/songs', songRoutes)`

**Real-time sync architecture:**
- Backend periodic sync: `setInterval()` in `socket.js` emits `periodic_sync` every 5s to jam session rooms
- Client sync: `useEnhancedRoomStore` listens for `shared_playback_sync` and `periodic_sync`, updates local player state
- Host controls: only jam host can emit `sync_playback` to backend, which broadcasts to all room members

**Zustand store patterns:**
- Stores hold socket instances and register handlers (`initSocket()` method)
- Use `getState()` to access store outside React: `useEnhancedRoomStore.getState().syncPlayback(...)`
- Player store calls room store methods to sync state when in jam session (see `updateRoomSong()` helper)

### Common Tasks (Recipes)

**Add new API endpoint:**
```javascript
// 1. backend/src/routes/feature.route.js
import { Router } from "express";
import { getFeature } from "../controller/feature.controller.js";
const router = Router();
router.get("/", getFeature);
export default router;

// 2. backend/src/controller/feature.controller.js
export const getFeature = async (req, res, next) => {
  try {
    // controller logic
    res.json(data);
  } catch (error) {
    next(error); // global error handler catches
  }
};

// 3. backend/src/index.js — wire route
import featureRoutes from "./routes/feature.route.js";
app.use('/api/feature', featureRoutes);
```

**Add socket event:**
```javascript
// Backend: backend/src/lib/socket.js
io.on("connection", (socket) => {
  socket.on("new_event_name", (data) => {
    // handle event, broadcast if needed
    io.to(roomId).emit("event_response", responseData);
  });
});

// Frontend: useEnhancedRoomStore.ts (in initSocket method)
socket.on("event_response", (data) => {
  set({ stateField: data.value });
});
```

**Debugging real-time sync issues:**
- Backend logs: `console.log` in `socket.js` handlers shows socket events
- Frontend: browser console shows socket connection status, incoming events
- Check `periodic_sync` emissions (every 5s) in network tab or console
- Verify room state: `rooms.get(roomId)` in backend, `currentRoom` in store frontend

### Environment Variables (Critical)

**Backend** (`backend/.env`):
- `MONGODB_URI` — required for DB connection
- `PORT` — default 8000
- `FRONTEND_ORIGINS` — comma-separated CORS origins (e.g., `http://localhost:5173,http://localhost:5174`)
- `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` — authentication
- `ADMIN_EMAILS` — comma-separated admin emails for privileged routes

**Frontend** (`frontend/.env`):
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk auth on client

### Important File Locations

- Media files: `frontend/public/songs/` (MP3s), `frontend/public/extracted-covers/` (album art)
- Song metadata: `frontend/public/songs_metadata.json` (extracted via `extract:metadata`)
- Scripts: `backend/src/scripts/` (metadata extraction, import, cleanup)
- Seeds: `backend/src/seeds/` (album generation, verification, manual imports)

### Error Handling Patterns

Backend controllers use `next(error)` to pass to global error handler (see `backend/src/index.js` for Clerk error handling). Frontend axios interceptor in `axios.ts` refreshes Clerk tokens automatically.

### Production Notes

- Backend sets `trust proxy: 1` for reverse proxies (Render, etc.)
- CORS in production allows same-origin + deployment URL (`RENDER_EXTERNAL_URL`)
- Socket.io uses `websocket` + `polling` transports, increased timeouts (60s ping) for slow connections
- Helmet CSP configured for Clerk domains (`*.clerk.accounts.dev`, `*.clerk.dev`)

### Testing Checklist

When adding features:
1. Backend routes: test with `curl` or Postman against `http://localhost:8000/api/...`
2. Socket events: use browser console + backend logs to verify emit/receive
3. Jam sessions: test with 2+ browser tabs (different users), verify host controls work
4. WebRTC audio: check `webrtcManager` initialization, peer connections in network tab
