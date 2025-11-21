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
## AUDORA — Copilot / AI contributor quick guide

This repo is a full-stack music/jam app: a Vite + React TypeScript frontend (`frontend/`) and an ES module Express backend (`backend/`) using MongoDB and Socket.io for real-time features.

Keep edits small and verifiable. Prefer touching one component at a time (route/controller OR store/component OR socket handler) and run the app locally to validate.

Key entry points & patterns
- Backend: `backend/src/index.js` (server boot + global error handler). Routes in `backend/src/routes/*.route.js`; controllers in `backend/src/controller/*.controller.js`.
- Socket & WebRTC: server socket glue in `backend/src/lib/socket.js` and signaling handlers in `backend/src/socket/webrtcHandlers.ts`.
- Models: `backend/src/models/` (Mongoose schemas for Song, Album, User).
- Frontend: React app under `frontend/src/`. Zustand stores live in `frontend/src/stores/` (notably `useEnhancedRoomStore.ts`, `usePlayerStore.ts`).
- WebRTC + audio: `frontend/src/lib/webrtcAudioStream.ts` and sync helpers in `frontend/src/lib/jamSyncUtils.ts`.

Developer workflow (short)
- Start backend: cd `backend` && npm install && npm run dev (default port 8000). Backend loads `backend/.env`.
- Start frontend: cd `frontend` && npm install && npm run dev (Vite, port 5173).
- Import songs: put MP3s in `frontend/public/songs/` then run backend scripts: `extract:metadata`, `import:songs`, `seed:albums` (see `backend/scripts/`).

Conventions & gotchas (specific)
- Module system: backend uses ES modules (package.json `type: "module"`) — use import/export.
- Socket events use snake_case (e.g., `shared_playback_sync`, `sync_playback`). Keep names stable across client/server.
- Zustand stores initialize sockets and register handlers (see `useEnhancedRoomStore.ts`). When adding socket listeners, also update server handlers in `backend/src/lib/socket.js`.
- API base path: frontend calls use `/api/*` (axios set in `frontend/src/lib/axios.ts`). In dev Vite proxies to backend.

Quick examples
- Add API route: create `backend/src/routes/your.route.js` + `backend/src/controller/your.controller.js`, then wire in `backend/src/index.js` with `app.use('/api/your', yourRoutes)`.
- Add socket event: add handler under `io.on('connection', ...)` in `backend/src/lib/socket.js`; then add `socket.on('event_name', ...)` in `useEnhancedRoomStore.ts` (or relevant store).

Environment (most important vars)
- Backend: `MONGODB_URI`, `PORT`, `FRONTEND_ORIGINS`, `CLERK_*` keys, `ADMIN_EMAILS`.
- Frontend: `VITE_CLERK_PUBLISHABLE_KEY`.

Where to look when things break
- Health: `GET /api/health` (backend). Check `backend` logs for DB/Clerk errors.
- Socket: browser console for socket connection problems; backend logs for `sync_playback`/`periodic_sync` emissions.
- Media files: `frontend/public/songs/` and `frontend/public/extracted-covers/`.

If you want more detailed checklists (route scaffolding, socket event lifecycle, or import scripts) tell me which area and I'll add a short recipe.
