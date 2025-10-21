# Copilot Instructions for AUDORA

Purpose: Give AI coding agents the minimum, project-specific context to be productive in this repo.

## Architecture overview
- Monorepo with two apps:
  - Backend (Node/Express, MongoDB, Socket.io): `backend/src/index.js` wires API, auth, static assets, and websockets. Data models: `backend/src/models/*.model.js`. Real-time: `backend/src/lib/socket.js`. DB: `backend/src/lib/db.js`.
  - Frontend (React + TypeScript + Vite + Tailwind + Zustand + Clerk): entry at `frontend/src/main.tsx`, routes in `frontend/src/App.tsx`. State stores under `frontend/src/stores`. API client in `frontend/src/lib/axios.ts`.
- Auth: Clerk. Frontend wraps the app with `ClerkProvider`. Backend uses `@clerk/express` via `clerkMiddleware` on `/api/*`.
- Realtime rooms: Socket.io connects frontend stores (`useRoomStore.ts`, `useEnhancedRoomStore.ts`) to server (`backend/src/lib/socket.js`) using events like `create_room`, `join_room`, `update_song`, `shared_playback_sync`.
- Static assets: In prod, backend serves `frontend/dist` and `/api/*`. During dev, frontend runs on Vite and calls backend via `http://localhost:8000`.

## Run/develop
- Root scripts (see `package.json`):
  - Build frontend: `npm run build` (installs deps in both apps; builds frontend only).
  - Start backend: `npm start` (delegates to `backend`).
- Backend (see `backend/package.json`):
  - Dev server with auto-reload: `npm run dev` (Express + Socket.io on port 8000).
  - Start: `npm start`.
  - Data utilities: `seed:songs`, `seed:albums`, `extract:metadata`, `import:songs`, etc., all under `backend/src/seeds` and `backend/src/scripts`.
- Frontend (see `frontend/package.json`):
  - Dev server: `npm run dev` (Vite on 5173; alias `@` -> `src`).
  - Build: `npm run build`.
  - Preview: `npm run preview`.

Required env (dev):
- Backend `.env`: `PORT=8000`, `MONGODB_URI=...`, `FRONTEND_ORIGINS=http://localhost:5173`, Clerk admin emails via `ADMIN_EMAILS` (comma-separated). Optional Cloudinary: `CLOUDINARY_*`.
- Frontend `.env`: `VITE_CLERK_PUBLISHABLE_KEY=...`.

## Conventions and patterns
- API base URL is environment-aware: `frontend/src/lib/axios.ts` uses `/api` in prod and `http://localhost:8000/api` in dev. Prefer `axiosInstance` over raw axios, and set the auth header in `AuthProvider.tsx`.
- Vite alias: import from `@/...` maps to `frontend/src`. Example: `import { useEnhancedRoomStore } from "@/stores/useEnhancedRoomStore"`.
- State management with Zustand. Examples:
  - Player: `usePlayerStore.ts` updates room presence on play/pause (`updateRoomSong`) and, if jam host, emits `sync_playback`.
  - Rooms: `useEnhancedRoomStore.ts` handles socket lifecycle, room/jam state, and events (`room_created`, `room_joined`, `user_song_update`, `shared_queue_updated`, periodic `periodic_sync`). Prefer this over the legacy `useRoomStore.ts`.
- Socket URL resolution: frontend uses `window.location` ("/" in prod) and `http://localhost:8000` in dev; see `getSocketUrl()` in both room stores. Server sets CORS based on `FRONTEND_ORIGINS`.
- Backend mounts:
  - Health: `GET /api/health`.
  - Songs: `GET /api/songs`, `/featured`, `/made-for-you`, `/trending`, `/public`, `/search?query=...`.
  - Albums: `GET /api/albums`, `GET /api/albums/:albumId`, `POST /api/albums/:albumId/songs`.
  - Auth callback: `POST /api/auth/callback` stores Clerk users in DB.
- Models: `Song` and `Album` with minimal fields used by the UI. Room state is in-memory on the Socket.io server (not persisted).

## Song ingestion workflow
- Place MP3s in either `frontend/public/songs` or `frontend/public/New songs`.
  - Optional per-track covers in `frontend/public/New songs/covers` (png/jpg/webp). Filenames matching the MP3 base name win; otherwise artist/title substrings are used.
- Generate metadata and seed file from backend:
  - `cd backend && npm run extract:metadata` → creates `backend/src/seeds/generatedSongs.js` by scanning both locations.
  - Embedded cover art is extracted to `frontend/public/extracted-covers/` when present; otherwise a cover is chosen from `frontend/public/cover-images` or round-robin defaults.
- Import into MongoDB:
  - Ensure `backend/.env` has `MONGODB_URI=...` set.
  - `cd backend && npm run import:songs` → clears and re-inserts songs, then auto-creates albums per artist (>=3 songs) and updates `albumId`.

## Working on rooms and live sync
- Client-to-server events: `create_room`, `join_room`, `leave_room`, `update_song`, `start_jam_session`, `stop_jam_session`, `sync_playback`, `add_to_shared_queue`, `remove_from_shared_queue`.
- Server-to-client events: `room_created`, `room_joined`, `user_joined_room`, `user_left_room`, `user_song_update`, `jam_session_started`, `jam_session_stopped`, `shared_playback_sync`, `shared_queue_updated`, `periodic_sync`, `room_error`.
- Jam sessions: Only the host can emit `sync_playback`; others consume `shared_playback_sync` and `periodic_sync` to adjust local playback. See `frontend/src/stores/useEnhancedRoomStore.ts` and `frontend/src/stores/usePlayerStore.ts` for concrete usage.

## Integration notes
- Clerk: Frontend uses `useUser` and `AuthenticateWithRedirectCallback`. Backend guards admin endpoints via `requireAdmin` using `ADMIN_EMAILS`. Ensure `clerkMiddleware` is applied only to `/api/*` routes.
- Cloudinary: Configured in `backend/src/lib/cloudinary.js`; optional, controlled by env. Uploads use `express-fileupload` with tmp dir `./tmp` cleaned hourly via `node-cron`.
- Production: Backend serves `frontend/dist` and static `frontend/public`. Socket.io path `/socket.io` with transports `websocket,polling`.

## Common pitfalls
- Missing env keys: Frontend renders a helpful notice if `VITE_CLERK_PUBLISHABLE_KEY` is absent. Backend logs which envs are loaded at boot.
- CORS/origin mismatch: Set `FRONTEND_ORIGINS` to include your Vite dev URL(s); otherwise Socket.io or API requests fail.
- Using the wrong store: Prefer `useEnhancedRoomStore` for jam features; `useRoomStore` is legacy/basic.

## Examples
- Start dev (two terminals): run backend `npm run dev` in `backend/` and frontend `npm run dev` in `frontend/`. The frontend will call `http://localhost:8000/api` and connect Socket.io to `http://localhost:8000`.
- Update shared playback from host:
  - `usePlayerStore.playAlbum(songs, i)` triggers `sync_playback` after a short delay.
  - `useEnhancedRoomStore.toggleSharedPlayback()` flips play/pause and emits `sync_playback`.
