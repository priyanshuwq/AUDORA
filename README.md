# AUDORA

Audora is a music streaming platform designed for real-time collaborative listening. It leverages WebRTC for low-latency audio streaming and Socket.io for precise state synchronization, enabling users to host jam sessions where friends can join instantly via a simple 4-digit room code to share queues and enjoy synchronized playback.

## Showcase
<img width="1920" height="1072" alt="screenshot-2025-11-15_15-05-27" src="https://github.com/user-attachments/assets/15be4bec-a71e-4a9b-b6fd-28cbfa1ff16d" />


https://github.com/user-attachments/assets/2586a463-e945-49ed-8258-d18d9254bd89




Showcasing oneko.js


https://github.com/user-attachments/assets/27f7d26f-4e7c-4ba6-a8f1-e576edc04c4d



Core features
- Real-time jam sessions (WebRTC audio + Socket.io signaling)
- Shared queue and host-controlled playback
- Import local MP3s into the library (backend import scripts)
- React + Vite frontend with Zustand stores and Tailwind UI

Architecture
- Media files (songs, cover art) are hosted separately on GitHub Pages for reduced repository size
- Media URL resolution handled via `frontend/src/lib/mediaUrl.ts`
- Production media served from: `https://priyanshuwq.github.io/audora-media`

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
- frontend/.env: VITE_CLERK_PUBLISHABLE_KEY, VITE_MEDIA_BASE_URL

Media Configuration
- For local development: Leave VITE_MEDIA_BASE_URL empty (uses local files from public folder)
- For production: Set VITE_MEDIA_BASE_URL=https://priyanshuwq.github.io/audora-media
- Media files should be placed in frontend/public/songs/ and frontend/public/extracted-covers/ for local development
- These folders are gitignored to keep the main repository lightweight


Notes: the script is served statically from the frontend public folder. Drop your customized `oneko.js` into `frontend/public/` and assets into `frontend/public/oneko/`.

Where to look in the repo
- Backend boot & routes: `backend/src/index.js`, `backend/src/routes/`, `backend/src/controller/`
- Socket handlers: `backend/src/lib/socket.js`, `backend/src/socket/roomHandlers.js`, `backend/src/socket/jamSessionHandlers.js`
- Frontend stores & sync: `frontend/src/stores/useEnhancedRoomStore.ts`, `frontend/src/stores/usePlayerStore.ts`
- Audio & sync helpers: `frontend/src/lib/webrtcAudioStream.ts`, `frontend/src/lib/jamSyncUtils.ts`
- Media URL utility: `frontend/src/lib/mediaUrl.ts`
- Shared player hooks: `frontend/src/hooks/useDominantColor.ts`, `frontend/src/hooks/useAudioProgress.ts`, `frontend/src/hooks/useVolumeControl.ts`

Contributing & license
- Fork, branch, test, PR. See `LICENSE` for terms.

  ---

<div align="center">

**If you found this useful, consider giving it a ⭐**

Made with ❤️ Priyanshu

</div>



