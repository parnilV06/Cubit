# Cubit Integration Blueprint

**Project:** Cubit  
**Version:** 1.0  
**Phase:** Frontend–Backend Integration Map

This document establishes the exact routing, payload contracts, and client-server mapping required to connect the React frontend to the backend services.

---

## 1. Route and Component Mapping

This table connects each visual component or page with its corresponding API router file, controller methods, and service layer functions.

| Page / Component | Client Actions | REST Endpoint | Backend Route & Controller Method | Service Function |
| :--- | :--- | :--- | :--- | :--- |
| **Login (`login.jsx`)** | Submit Credentials | `POST /api/auth/login` | `auth.routes.js` -> `authController.login` | `auth.service.js` -> `login` |
| **Signup (`signup.jsx`)** | Submit Registration | `POST /api/auth/register` | `auth.routes.js` -> `authController.register` | `auth.service.js` -> `register` |
| **App Shell (`appLayout.jsx`)** | Fetch Authenticated User | `GET /api/auth/me` | `auth.routes.js` -> `authController.me` | `auth.service.js` -> `getUserById` |
| **Sidebar Nav (`nav.jsx`)** | Display avatar & name | `GET /api/auth/me` | `auth.routes.js` -> `authController.me` | `auth.service.js` -> `getUserById` |
| **Timer Dashboard (`timerDashboard.jsx`)** | Page Load | `GET /api/sessions/current` | `session.routes.js` -> `sessionController.getCurrentSession` | `session.service.js` -> `getCurrentSession` |
| **Timer Dashboard (`timerDashboard.jsx`)** | Swap Active Session | `POST /api/sessions` | `session.routes.js` -> `sessionController.createSession` | `session.service.js` -> `createSession` |
| **Stats Sidebar (`statsBar.jsx`)** | Fetch active solves | `GET /api/solves/session/:sessionId` | `solve.routes.js` -> `solveController.getSolves` | `solve.service.js` -> `getSolvesBySessionId` |
| **Stats Sidebar (`statsBar.jsx`)** | Record new solve | `POST /api/solves` | `solve.routes.js` -> `solveController.addSolve` | `solve.service.js` -> `addSolve` |
| **Stats Sidebar (`statsBar.jsx`)** | Toggle penalty / DNF | `PATCH /api/solves/:id` | `solve.routes.js` -> `solveController.updateSolve` | `solve.service.js` -> `updateSolve` |
| **Stats Dashboard (`statsDashboard.jsx`)** | Load graphs & KPIs | `GET /api/stats/dashboard` | `stats.routes.js` -> `statsController.getDashboard` | `stats.service.js` -> `getDashboardStats` |
| **Trainer Feed (`trainer.jsx`)** | Load published lessons | `GET /api/trainer/lessons` | `trainer.routes.js` -> `trainerController.getLessons` | `trainer.service.js` -> `getLessons` |
| **Lesson Frame (`lesson.jsx`)** | Render slug document | `GET /api/trainer/lessons/:slug` | `trainer.routes.js` -> `trainerController.getLesson` | `trainer.service.js` -> `getLesson` |
| **Lesson Frame (`lesson.jsx`)** | Click "Complete Lesson" | `POST /api/trainer/lessons/:slug/complete` | `trainer.routes.js` -> `trainerController.completeLesson` | `trainer.service.js` -> `completeLesson` |
| **Community Feed (`community.jsx`)** | Fetch post feed | `GET /api/community/posts` | `community.routes.js` -> `communityController.getPosts` | `community.service.js` -> `getPosts` |
| **Community Feed (`community.jsx`)** | Upload post with image | `POST /api/community/posts` | `community.routes.js` -> `communityController.createPost` | `community.service.js` -> `createPost` |
| **Community Feed (`community.jsx`)** | Toggle post like | `POST / DELETE /api/community/posts/:id/like` | `community.routes.js` -> `communityController.likePost / unlikePost` | `community.service.js` -> `likePost / unlikePost` |
| **Profile View (`profile.jsx`)** | Fetch public profile | `GET /api/profile/:username` | `profile.routes.js` -> `profileController.getProfileByUsername` | `profile.service.js` -> `getProfileByUsername` |
| **Profile Edit Modal** | Submit biography changes | `PATCH /api/profile` | `profile.routes.js` -> `profileController.updateProfile` | `profile.service.js` -> `updateProfile` |
| **Profile Edit Modal** | Upload Avatar file | `POST /api/profile/avatar` | `profile.routes.js` -> `profileController.uploadAvatar` | `profile.service.js` -> `uploadAvatar` |
| **Friends Popover** | Retrieve list | `GET /api/friends` | `friend.routes.js` -> `friendController.getFriends` | `friend.service.js` -> `getFriends` |
| **Friends Requests** | List incoming/outgoing | `GET /api/friends/requests` | `friend.routes.js` -> `friendController.getRequests` | `friend.service.js` -> `getRequests` |
| **Friends Action** | Send invitation | `POST /api/friends/request` | `friend.routes.js` -> `friendController.sendFriendRequest` | `friend.service.js` -> `sendFriendRequest` |
| **Friends Action** | Approve invitation | `PATCH /api/friends/request/:id/accept` | `friend.routes.js` -> `friendController.acceptRequest` | `friend.service.js` -> `acceptRequest` |
| **Notifications Dropdown** | Load list / Read actions | `GET /api/notifications` | `notification.routes.js` -> `notificationController.getNotifications` | `notification.service.js` -> `getNotifications` |

---

## 2. Key Payload Contracts

### Authentication: Register (`POST /api/auth/register`)
* **Request Header**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
      "displayName": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "password": "strongpassword123"
  }
  ```
* **Response Body (`201 Created`)**:
  ```json
  {
      "success": true,
      "message": "User registered successfully",
      "data": {
          "id": "cuid_here",
          "displayName": "John Doe",
          "username": "johndoe",
          "email": "john@example.com",
          "avatarUrl": null,
          "bio": null,
          "emailVerified": false,
          "createdAt": "2026-07-16T04:55:00.000Z",
          "updatedAt": "2026-07-16T04:55:00.000Z"
      }
  }
  ```

### Timer: Add Solve (`POST /api/solves`)
* **Request Header**: `Authorization: Bearer <token>`, `Content-Type: application/json`
* **Request Body**:
  ```json
  {
      "sessionId": "session_cuid",
      "time": 14230,
      "scramble": "U' R2 F D B2 R2 B' L D2 R2 B2 D2 F R2 F2 B R' F2",
      "penalty": "NONE"
  }
  ```
* **Response Body (`201 Created`)**:
  ```json
  {
      "success": true,
      "message": "Solve recorded successfully.",
      "data": {
          "id": "solve_cuid",
          "sessionId": "session_cuid",
          "time": 14230,
          "scramble": "U' R2 F D B2 R2 B' L D2 R2 B2 D2 F R2 F2 B R' F2",
          "penalty": "NONE",
          "createdAt": "2026-07-16T05:00:00.000Z",
          "updatedAt": "2026-07-16T05:00:00.000Z"
      }
  }
  ```

### Community: Create Post (`POST /api/community/posts`)
* **Request Header**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
* **Request Body**:
  * Form fields:
    * `type`: `"DISCUSSION"` (or `"TIP"`, `"QUESTION"`, `"PB_SHARE"`, `"SOLVE_SHARE"`)
    * `content`: `"Just got a new PB of 9.58s!"`
    * `solveId`: `"solve_cuid"` (optional)
  * File fields:
    * `image`: `[image_binary_data]` (optional)
* **Response Body (`201 Created`)**:
  ```json
  {
      "success": true,
      "message": "Post created successfully",
      "data": {
          "id": "post_cuid",
          "authorId": "user_cuid",
          "type": "DISCUSSION",
          "title": null,
          "content": "Just got a new PB of 9.58s!",
          "imageUrl": "https://res.cloudinary.com/...",
          "solveId": "solve_cuid",
          "createdAt": "2026-07-16T05:10:00.000Z"
      }
  }
  ```

---

## 3. Real-Time (Socket.IO) & Static Storage Policies

1. **Authentication Interceptor**:
   * Sockets connection payload must contain:
     ```javascript
     const socket = io("http://localhost:5000", {
       auth: {
         token: localStorage.getItem("token")
       }
     });
     ```
2. **Channel Subscription**:
   * On authorization success, the backend maps the socket instance to room `room:${userId}`.
   * Client registers listener:
     ```javascript
     socket.on("notification:new", (data) => {
       // Append notification item to list and play audio alert
     });
     ```
3. **Cloudinary Asset Storage Paths**:
   * **Avatars**: Target directory is `Cubit/avatars`. Upload uses buffer streams from profile controllers.
   * **Post Images**: Target directory is `Cubit/posts`. Upload streams from community controllers.
