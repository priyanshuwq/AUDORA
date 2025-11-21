# AUDORA

Full-stack web app for synchronized music listening and live jam sessions.

Core features
- Real-time jam sessions (WebRTC audio + Socket.io signaling)
- Shared queue and host-controlled playback
- Import local MP3s into the library (backend import scripts)
- React + Vite frontend with Zustand stores and Tailwind UI

Quick start (dev)
Prereqs: Node 18+, npm, MongoDB.

Run backend and frontend in separate shells (fish examples):

```fish
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

Import local songs (optional):

```fish
# Put MP3s in frontend/public/songs
cd backend
npm run extract:metadata
npm run import:songs
```

Environment (important)
- backend/.env: MONGODB_URI, PORT (8000), FRONTEND_ORIGINS, ADMIN_EMAILS, CLERK keys
- frontend/.env: VITE_CLERK_PUBLISHABLE_KEY

Preview video (placeholder)
Add a short preview video at `frontend/public/preview.mp4` (or `preview.webm`). This README will show it when present.

<video src="/preview.mp4" controls style="max-width:720px">Preview not available</video>

Showcasing oneko.js
- Files: `frontend/public/oneko.js` and supporting assets in `frontend/public/oneko/`.
- To preview the effect, include the script in `frontend/index.html` (served from `/`):

```html
<!-- in frontend/index.html -->
<script src="/oneko.js"></script>
<!-- add a container if required by the script -->
<div id="oneko-root"></div>
```

Notes: the script is served statically from the frontend public folder. Drop your customized `oneko.js` into `frontend/public/` and assets into `frontend/public/oneko/`.

Where to look in the repo
- Backend boot & routes: `backend/src/index.js`, `backend/src/routes/`, `backend/src/controller/`
- Socket glue & WebRTC handlers: `backend/src/lib/socket.js`, `backend/src/socket/webrtcHandlers.ts`
- Frontend stores & sync: `frontend/src/stores/useEnhancedRoomStore.ts`, `frontend/src/stores/usePlayerStore.ts`
- Audio & sync helpers: `frontend/src/lib/webrtcAudioStream.ts`, `frontend/src/lib/jamSyncUtils.ts`

Contributing & license
- Fork, branch, test, PR. See `LICENSE` for terms.

If you found this useful, consider giving it a ⭐



