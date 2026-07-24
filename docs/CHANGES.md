# API Routing Implementation Changes

**Date:** July 7, 2026

This document logs all the changes made to establish the API routing layer based on the `APIBlueprint.md`.

## 1. Controllers Created
Placeholder controller files were created in `server/controllers/` to match all modules defined in the API blueprint. Every endpoint currently returns a `501 Not Implemented` response.

- `auth.controller.js`: `register`, `login`, `logout`, `me`
- `profile.controller.js`: `getProfile`, `updateProfile`, `uploadAvatar`
- `session.controller.js`: `getSessions`, `createSession`, `renameSession`, `archiveSession`, `deleteSession`
- `solve.controller.js`: `getSolves`, `addSolve`, `updateSolve`, `deleteSolve`
- `stats.controller.js`: `getDashboard`, `getTrend`, `getDistribution`, `getProgress`, `getRecentSessions`
- `trainer.controller.js`: `getLessons`, `getLesson`, `completeLesson`, `getProgress`
- `community.controller.js`: `getPosts`, `createPost`, `getPost`, `deletePost`, `likePost`, `unlikePost`, `addComment`, `deleteComment`
- `friend.controller.js`: `getFriends`, `sendFriendRequest`, `acceptRequest`, `rejectRequest`, `removeFriend`
- `notification.controller.js`: `getNotifications`, `markAsRead`, `markAllAsRead`

## 2. Routes Created
Router files were created in `server/routes/` for each corresponding controller and method HTTP signatures were mapped accurately.

- `auth.routes.js` (Base: `/api/auth`)
- `profile.routes.js` (Base: `/api/profile`)
- `session.routes.js` (Base: `/api/sessions`)
- `solve.routes.js` (Base: `/api/solves`)
- `stats.routes.js` (Base: `/api/stats`)
- `trainer.routes.js` (Base: `/api/trainer`)
- `community.routes.js` (Base: `/api/community`)
- `friend.routes.js` (Base: `/api/friends`)
- `notification.routes.js` (Base: `/api/notifications`)

## 3. Router Wiring
- **`server/routes/cubit.routes.js`:** Modified to import all the separate router files mentioned above and mount them onto their correct API blueprint base routes.
- **`server/server.js`:** Modified to import `cubit.routes.js` and mount it to the master `/api` route via `app.use('/api', cubitRoutes);`.

## 4. Fixes Applied
- **`server/config/database.js`:** Added a dummy exported `connectDB` mock function to allow the server to successfully boot during validation (previously it threw a `TypeError: connectDB is not a function`).

## 5. Recent Solves UI & CORS Fixes (July 24, 2026)
- **statsBar.jsx & layout.css**: Fixed the rendering logic in the Recent Solves panel so that +2 and DNF edit buttons are hidden by default, displaying only on hover for normal solves. The +2 and DNF status badges remain persistently visible on solves that actually have active penalties.
- **Dropdown Overflows**: Restricted the session select (150px) and puzzle type select (110px) to fixed widths with `text-overflow: ellipsis` truncation, preventing layouts from overflowing when long session names are active.
- **CORS Patch Support**: Added `PATCH` to `Access-Control-Allow-Methods` in `server/app.js` to allow the client to update solve penalties without preflight blocks.
- **Environment config**: Updated frontend `client/.env` base URL to target `http://localhost:5000` to correctly point to the local backend during development.

## 6. Session Notes Feature V1 (July 24, 2026)
- **Database Schema**: Added the `Note` model linked to `Session` in `schema.prisma`. Pushed changes to PostgreSQL and regenerated the Prisma Client.
- **Backend API**:
  - `note.service.js`: Added query/mutation methods for notes (create, fetch per session in descending order, delete).
  - `note.controller.js`: Implemented controller methods.
  - `note.routes.js`: Protected with `authMiddleware` and routed `/session/:sessionId` (GET), `/` (POST), and `/:id` (DELETE).
  - Mounted notes route to master router `server/routes/cubit.routes.js`.
- **Frontend Integration**:
  - `client/src/services/api.js`: Added the `noteAPI` client methods.
  - `client/src/services/store.js`: Added notes state arrays and actions (`fetchNotes`, `addNote`, `deleteNoteAction`), triggered automatically when the active session changes.
  - `timerDashboard.jsx` & `appStyles.css`: Integrated states, Check/Trash icon controls, dynamic scrollable note listings, and sleek theme-compliant typography, spacing, and hover indicators.
