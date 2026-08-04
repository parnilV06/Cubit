# Cubit — Low-Level Design (LLD)

## 1. Purpose
This Low-Level Design (LLD) document provides an exhaustive, code-level specification of the Cubit platform. It details class structures, function signatures, database schema fields, API contracts, mathematical transformation formulas, state lifecycle transitions, and exact code file paths.

---

## 2. Detailed Repository Structure & File Mapping

```
Cubit-SourceCode/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── appLayout.jsx           # 3-Column main app layout container
│   │   │   │   ├── landingFooter.jsx       # Landing page footer with social/legal links
│   │   │   │   ├── landingNav.jsx          # Public site navigation header
│   │   │   │   ├── layout.css              # Layout grid & sidebar styles
│   │   │   │   ├── nav.jsx                 # Right column navigation sidebar
│   │   │   │   ├── statsBar.jsx            # Left column statistics panel
│   │   │   │   ├── featureBar.jsx          # Top feature bar component
│   │   │   │   └── timer.jsx               # Timer component
│   │   │   ├── pages/
│   │   │   │   ├── appStyles.css           # Core dashboard & component styles
│   │   │   │   ├── auth.css                # Auth login/signup styles
│   │   │   │   ├── community.css           # Social feed & leaderboard styles
│   │   │   │   ├── community.jsx           # Community feed, posts, comments, leaderboards
│   │   │   │   ├── cubitjs.jsx             # Dedicated Cubit.js product showcase page
│   │   │   │   ├── dashboard.jsx           # Legacy dashboard redirect component
│   │   │   │   ├── landing.css             # Landing page CSS styles
│   │   │   │   ├── landing.jsx             # Public landing page with features & CTA
│   │   │   │   ├── lesson.jsx              # Single lesson markdown reader component
│   │   │   │   ├── login.jsx               # Login form page with Google OAuth button
│   │   │   │   ├── privacy.jsx             # Production Privacy Policy legal page
│   │   │   │   ├── profile.css             # User profile page styles
│   │   │   │   ├── profile.jsx             # Public user profile page with activity stats
│   │   │   │   ├── signup.jsx              # Registration form page
│   │   │   │   ├── statsDashboard.jsx      # Analytics dashboard page with charts
│   │   │   │   ├── terms.jsx               # Production Terms of Use legal page
│   │   │   │   ├── timerDashboard.jsx      # Core timer workspace & solve list page
│   │   │   │   └── trainer.jsx             # Trainer course catalog overview page
│   │   │   ├── scramble/
│   │   │   │   └── CubeStage2VisualizerHarness.jsx # Interactive 2D cube net test harness
│   │   │   ├── stats/
│   │   │   │   ├── DistributionChart.jsx   # Solve time distribution bar chart
│   │   │   │   ├── ProgressChart.jsx       # Best time progress line chart
│   │   │   │   ├── RecentSessions.jsx      # Paginated sessions inventory table
│   │   │   │   ├── SessionDetailsModal.jsx # Detailed session inspection modal
│   │   │   │   ├── SolveTrendChart.jsx     # Solve trend analytics chart
│   │   │   │   ├── StatsCards.jsx          # KPI summary stat cards
│   │   │   │   ├── StatsFilters.jsx        # Date range & puzzle filter controls
│   │   │   │   └── stats.css               # Stats dashboard styling
│   │   │   └── ui/
│   │   │       ├── ContactModal.jsx        # Public Contact Us modal
│   │   │       ├── InteractiveCube.jsx     # 3D interactive hero cube component
│   │   │       ├── Model.jsx               # Three.js 3D cube model asset component
│   │   │       └── SessionDeleteModal.jsx  # Session deletion confirmation dialog
│   │   ├── services/
│   │   │   ├── api.js                      # Axios instance & REST endpoint methods
│   │   │   ├── focusStore.js               # Ambient focus audio store & HTMLAudio instance
│   │   │   ├── socket.js                   # Client Socket.io connection manager
│   │   │   ├── store.js                    # Core Zustand store (Auth, Sessions, Solves, Notes)
│   │   │   ├── cubeEngine/                 # Pure JS 3D Cube State Engine
│   │   │   │   ├── constants.js            # Canonical face enums & sticker colors
│   │   │   │   ├── engine.js               # 3D spatial transformation math & layer turns
│   │   │   │   ├── index.js                # Cube engine public entry exports
│   │   │   │   ├── matrix.js               # Face matrix creation & rotation utilities
│   │   │   │   ├── parser.js               # Move token parser for WCA sequence notation
│   │   │   │   ├── cubeEngine.test.js      # Unit tests for spatial move math & validation
│   │   │   │   └── visualizer/
│   │   │   │       ├── CubeNetRenderer.jsx # 2D unfolded cube net React component
│   │   │   │       └── mapper.js           # Matrix to 2D net layout mapper
│   │   │   └── scramble/                   # Scramble Generation Service
│   │   │       ├── constants.js            # WCA mappings, fallback moves & lengths
│   │   │       ├── generator.js            # csTimer wrapper & local fallback generator
│   │   │       ├── index.js                # Scramble service public entry exports
│   │   │       ├── pipeline.js             # Pipeline builder for scramble processing
│   │   │       ├── scramble.test.js        # Unit tests for scramble generation
│   │   │       ├── stage3Integration.test.js # Integration tests for scramble + state engine
│   │   │       ├── types.js                # Type definitions & validator helpers
│   │   │       └── utils.js                # Scramble normalization & UUID generator
│   │   └── utils/
│   │       └── statsHelpers.js             # Client-side statistics calculation helpers
│   ├── App.jsx                             # Application router & top-level state listener
│   └── main.jsx                            # React root mount point
├── server/
│   ├── config/
│   │   ├── cloudinary.js                   # Cloudinary SDK configuration
│   │   ├── database.js                     # Prisma client & database connection pool
│   │   ├── focusTracks.js                  # Focus audio tracks catalog configuration
│   │   └── logger.js                       # Console logging utility
│   ├── controllers/                        # HTTP Endpoint Request Controllers
│   │   ├── auth.controller.js
│   │   ├── community.controller.js
│   │   ├── focus.controller.js
│   │   ├── friend.controller.js
│   │   ├── note.controller.js
│   │   ├── notification.controller.js
│   │   ├── profile.controller.js
│   │   ├── rating.controller.js
│   │   ├── session.controller.js
│   │   ├── solve.controller.js
│   │   ├── stats.controller.js
│   │   └── trainer.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js              # Bearer token JWT authentication guard
│   │   ├── error.middleware.js             # Global error handler & 404 handler
│   │   └── upload.middleware.js            # Multer file upload stream handler
│   ├── prisma/
│   │   ├── schema.prisma                   # PostgreSQL database schema & enums
│   │   └── seed.js                         # Database seed script for lessons & demo data
│   ├── routes/                             # Express Routers
│   │   ├── auth.routes.js
│   │   ├── community.routes.js
│   │   ├── cubit.routes.js                 # Master router mounting all sub-routes to /api
│   │   ├── focus.routes.js
│   │   ├── friend.routes.js
│   │   ├── note.routes.js
│   │   ├── notification.routes.js
│   │   ├── profile.routes.js
│   │   ├── rating.routes.js
│   │   ├── session.routes.js
│   │   ├── solve.routes.js
│   │   ├── stats.routes.js
│   │   └── trainer.routes.js
│   ├── scripts/
│   │   ├── apply-gamification-schema.js
│   │   └── backfill-rating.js              # Backfill script for historic rating calculations
│   ├── services/                           # Domain Service Layer
│   │   ├── auth.service.js                 # Auth register, login, Google verify, user fetch
│   │   ├── community.service.js            # Posts, comments, likes, leaderboards logic
│   │   ├── friend.service.js               # Friend requests, acceptance, search logic
│   │   ├── note.service.js                 # Session notes CRUD logic
│   │   ├── notification.service.js         # Notification persistence & Socket.io push
│   │   ├── profile.service.js              # User profiles, avatar upload, stats aggregation
│   │   ├── session.service.js              # Session CRUD, active session tracking
│   │   ├── solve.service.js                # Solve creation, penalty updates, solve deletion
│   │   ├── stats.service.js                # Dashboard statistics calculation aggregator
│   │   ├── trainer.service.js              # Lessons catalog, progress, completion handler
│   │   ├── gamification/                   # Authoritative Rating Engine
│   │   │   ├── activityAndStreaks.js       # Daily active date & streak calculator
│   │   │   ├── constants.js                # Rating weights, caps, milestone bonuses
│   │   │   ├── engine.js                   # Master Gamification Engine orchestrator
│   │   │   ├── improvementRating.js        # Session close improvement evaluator
│   │   │   ├── index.js                    # Gamification engine exports
│   │   │   ├── ratingLedger.js             # User rating summary & ledger queries
│   │   │   ├── solveRating.js              # Base solve points calculator
│   │   │   └── trainerRating.js            # Trainer lesson completion points awarder
│   │   └── stats/
│   │       └── calculations/               # Statistical calculation functions
│   │           ├── distribution.js
│   │           ├── index.js
│   │           ├── kpis.js
│   │           ├── progress.js
│   │           ├── recentSessions.js
│   │           └── trends.js
│   ├── tools/
│   │   └── socket-test.js                  # Socket.io connection test utility
│   ├── utils/
│   │   ├── cloudinary.js                   # Cloudinary buffer upload stream helper
│   │   ├── pagination.js                   # Pagination calculation helper
│   │   ├── response.js                     # Standard API JSON response helper
│   │   └── socket.js                       # Server Socket.io instance & user room emitter
│   ├── app.js                              # Express app creation & CORS middleware setup
│   └── server.js                           # Node HTTP server entry point & socket listener
```

---

## 3. Frontend Component & State Architecture

### Application Bootstrap (`client/src/main.jsx`)
Mounts the React root element to `#root` using React 19 `createRoot`.

### Application Router (`client/src/App.jsx`)
- Wraps the application in `BrowserRouter`.
- Evaluates authentication state from `useStore` (`isAuthenticated`).
- On initial mount, triggers `fetchMe()` to validate stored JWT token.
- Listens to `isAuthenticated` state changes to invoke `initiateSocketConnection(token)` or `disconnectSocket()`.

### Global State Management (`client/src/services/store.js`)
Built with Zustand (`create`). Core state fields and actions:

```javascript
// State Slices
{
  user: null,                   // Current authenticated user object
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  selectedSessionId: localStorage.getItem('selectedSessionId') || null,
  sessions: [],                 // Array of session objects
  activeSession: null,          // Currently selected active session
  activeScramble: null,         // Active ScrambleObject { id, puzzleType, scramble }
  solves: [],                   // Solves array for current selected session
  notes: [],                    // Notes array for current selected session
  loadingUser: false,
  loadingSolves: false,
  loadingNotes: false,
  authError: null
}
```

Key store actions:
- `login(email, password)`: Calls `authAPI.login`, persists token to `localStorage`, sets user state, and calls `fetchActiveSession()`.
- `loginWithGoogle(credential)`: Calls `authAPI.loginWithGoogle`, persists token, sets user state, and calls `fetchActiveSession()`.
- `register(displayName, username, email, password)`: Calls `authAPI.register`, then auto-logins.
- `logout()`: Clears `localStorage` keys (`token`, `selectedSessionId`), resets user state, and disconnects socket.
- `fetchActiveSession()`: Synchronizes active session from backend or falls back to first available session.
- `selectSession(sessionId)`: Changes selected session, persists choice to `localStorage`, fetches corresponding solves and notes, and generates a new active scramble.
- `addSolve(timeSeconds, scramble)`: Sends time in milliseconds (`Math.round(timeSeconds * 1000)`) to `solveAPI.addSolve`, prepends new solve to local state, generates a new scramble, and re-fetches session list to update solve counts.
- `updateSolve(id, penalty)`: Mutates penalty (`NONE`, `PLUS_TWO`, `DNF`), updates local state, and refreshes session metadata.
- `deleteSolve(id)`: Deletes solve via API, removes from local state array, and refreshes session metadata.

### Focus Store (`client/src/services/focusStore.js`)
Manages ambient audio playback using a singleton native `HTMLAudioElement` instance instantiated outside React lifecycle:
- Event listeners bound to `HTMLAudioElement`: `timeupdate`, `loadedmetadata`, `playing`, `pause`, `ended`, `error`.
- Actions: `fetchTracks()`, `selectTrack(trackId)`, `togglePlay()`, `play()`, `pause()`, `seek(timeSeconds)`, `setVolume(newVolume)`, `toggleMute()`, `toggleLoop()`.
- Includes static fallback track catalog (`FALLBACK_FOCUS_TRACKS`) pointing to Cloudinary-hosted MP3 assets.

---

## 4. Backend System & Routing Design

### Master Router (`server/routes/cubit.routes.js`)
All API sub-routers are mounted under `/api`:
- `/api/auth` -> `auth.routes.js`
- `/api/profile` -> `profile.routes.js`
- `/api/sessions` -> `session.routes.js`
- `/api/solves` -> `solve.routes.js`
- `/api/stats` -> `stats.routes.js`
- `/api/trainer` -> `trainer.routes.js`
- `/api/community` -> `community.routes.js`
- `/api/friends` -> `friend.routes.js`
- `/api/notifications` -> `notification.routes.js`
- `/api/focus-tracks` -> `focus.routes.js`
- `/api/notes` -> `note.routes.js`
- `/api/rating` -> `rating.routes.js`

### Middlewares
1. **`auth.middleware.js`**: Extracts Bearer token from `Authorization` header. Verifies JWT using `process.env.JWT_SECRET`. If valid, attaches payload `{ id, username }` to `req.user`. Returns `401 Unauthorized` if token is missing or invalid.
2. **`upload.middleware.js`**: Configures `multer` memory storage with 5MB file size limit (`limits: { fileSize: 5 * 1024 * 1024 }`) for handling image file streams.
3. **`error.middleware.js`**: Global Express error handler middleware. Intercepts exceptions thrown in services/controllers, logs error stack in non-production environments, and returns formatted JSON response with appropriate status code (defaults to `500 Internal Server Error`).

---

## 5. Complete API Reference

### Auth Endpoints (`server/routes/auth.routes.js`)
- `POST /api/auth/register`
  - **Auth**: None
  - **Input**: `{ displayName, username, email, password }`
  - **Validation**: All fields required; unique email & username checked via `prisma.user.findUnique`.
  - **Service**: `auth.service.js -> register()`
  - **DB Action**: Inserts new `User` record with bcrypt hashed password.
  - **Response**: `201 Created` `{ success: true, message: "User registered successfully", data: { user } }`

- `POST /api/auth/login`
  - **Auth**: None
  - **Input**: `{ email, password }`
  - **Service**: `auth.service.js -> login()`
  - **DB Action**: Queries user by email, verifies password via `bcrypt.compare`.
  - **Response**: `200 OK` `{ success: true, message: "Login successful", data: { token, user } }`

- `POST /api/auth/google`
  - **Auth**: None
  - **Input**: `{ credential }` (Google OAuth ID Token string)
  - **Service**: `auth.service.js -> loginWithGoogle()`
  - **DB Action**: Verifies token payload with Google OAuth API; finds or creates `User` record; issues 7-day JWT.
  - **Response**: `200 OK` `{ success: true, message: "Login successful", data: { token, user } }`

- `GET /api/auth/me`
  - **Auth**: Bearer JWT
  - **Service**: `auth.service.js -> getUserById(req.user.id)`
  - **Response**: `200 OK` `{ success: true, message: "User fetched successfully", data: { user } }`

### Session Endpoints (`server/routes/session.routes.js`)
- `GET /api/sessions` (Auth: Required) -> Returns user sessions list ordered by `createdAt desc`.
- `GET /api/sessions/current` (Auth: Required) -> Gets active session or auto-creates `Default Session`.
- `POST /api/sessions` (Auth: Required) -> Input: `{ name, puzzleType }`. Creates new session in a Prisma transaction, deactivates previous active sessions, and processes session close improvement rating.
- `PATCH /api/sessions/:id` (Auth: Required) -> Input: `{ name }`. Renames session.
- `PATCH /api/sessions/:id/archive` (Auth: Required) -> Archives session (`isArchived: true`), processes session close improvement rating, and creates default session if archived session was active.
- `DELETE /api/sessions/:id` (Auth: Required) -> Deletes session and cascade deletes solves and notes; switches active flag to remaining session.

### Solve Endpoints (`server/routes/solve.routes.js`)
- `GET /api/solves/session/:sessionId` (Auth: Required) -> Verifies session ownership and returns solves array ordered by `createdAt asc`.
- `POST /api/solves` (Auth: Required) -> Input: `{ sessionId, time, scramble, penalty }`. Creates solve record inside Prisma transaction and triggers `GamificationEngine.processSolveCreation()`.
- `PATCH /api/solves/:id` (Auth: Required) -> Input: `{ penalty }` (`NONE`, `PLUS_TWO`, `DNF`). Restricts updates strictly to penalty field and triggers `GamificationEngine.processSolveMutation()`.
- `DELETE /api/solves/:id` (Auth: Required) -> Deletes solve inside transaction and triggers `GamificationEngine.processSolveDeletion()`.

### Statistics Endpoint (`server/routes/stats.routes.js`)
- `GET /api/stats/dashboard` (Auth: Required) -> Aggregates all non-archived session solves and returns KPIs (PB, Ao5, Ao12, Mean, totalSolves, totalSessions), solve trend time-series, time distribution histogram buckets, progress curve, and recent sessions list.

### Community & Leaderboard Endpoints (`server/routes/community.routes.js`)
- `GET /api/community/posts` (Auth: Required) -> Query params: `feed` (`global` / `friends`), `type`. Returns paginated community posts with author profiles, solve details, comment counts, like counts, and `isLikedByMe` flag.
- `POST /api/community/posts` (Auth: Required) -> Input: Multipart form data (`type`, `content`, `title`, `solveId`, `image`). Uploads image buffer to Cloudinary folder `Cubit/posts` if provided and creates `Post` record.
- `POST /api/community/posts/:id/like` & `DELETE /api/community/posts/:id/like` (Auth: Required) -> Likes/unlikes post and sends real-time notification to post author.
- `POST /api/community/posts/:id/comments` (Auth: Required) -> Input: `{ content }`. Adds comment to post and notifies post author.
- `GET /api/community/leaderboard/pb` (Auth: Required) -> Query params: `puzzleType`, `scope` (`global` / `friends`), `limit`. Returns ranked Personal Best solves with user profiles.
- `GET /api/community/leaderboard/rating` (Auth: Required) -> Query params: `scope` (`global` / `friends`), `limit`. Returns ranked user profiles sorted by `totalRating desc`.

### Friendship & Search Endpoints (`server/routes/friend.routes.js`)
- `GET /api/friends` (Auth: Required) -> Returns accepted friends list with online status.
- `GET /api/friends/search` (Auth: Required) -> Query param: `q`. Searches users by username or display name substring.
- `POST /api/friends/request` (Auth: Required) -> Input: `{ username }`. Creates `Friendship` record with status `PENDING` and triggers Socket.io notification to receiver.
- `PATCH /api/friends/request/:id/accept` (Auth: Required) -> Sets friendship status to `ACCEPTED` and notifies sender.
- `DELETE /api/friends/:id` (Auth: Required) -> Deletes friendship record.

### Notifications & Focus Endpoints
- `GET /api/notifications` (Auth: Required) -> Fetches user notifications ordered by `createdAt desc`.
- `PATCH /api/notifications/:id/read` & `PATCH /api/notifications/read-all` (Auth: Required) -> Marks notifications as read.
- `GET /api/focus-tracks` (Auth: Public) -> Returns array of focus tracks from `server/config/focusTracks.js`.

---

## 6. Database Relational Schema

```prisma
enum PuzzleType {
  THREE_BY_THREE
  TWO_BY_TWO
  FOUR_BY_FOUR
  FIVE_BY_FIVE
  ONE_HANDED
  BLIND
  MEGAMINX
  PYRAMINX
  SKEWB
  SQUARE_ONE
  CLOCK
}

enum PenaltyType {
  NONE
  PLUS_TWO
  DNF
}

enum PostType {
  DISCUSSION
  TIP
  QUESTION
  PB_SHARE
  SOLVE_SHARE
}

enum FriendStatus {
  PENDING
  ACCEPTED
  REJECTED
  BLOCKED
}

enum NotificationType {
  FRIEND_REQUEST
  FRIEND_ACCEPTED
  POST_LIKE
  COMMENT
}

enum RatingCategory {
  SOLVE
  IMPROVEMENT
  TRAINER
  DAILY_ACTIVITY
  STREAK_BONUS
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  username      String   @unique
  password      String?
  googleId      String?  @unique
  displayName   String
  avatarUrl     String?
  bio           String?
  emailVerified Boolean  @default(false)
  totalRating   Decimal  @default(0) @db.Decimal(12, 4)
  currentStreak Int      @default(0)
  longestStreak Int      @default(0)
  lastActiveDate String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  sessions            Session[]
  posts               Post[]
  comments            Comment[]
  postLikes           PostLike[]
  lessonProgress      LessonProgress[]
  notifications       Notification[]
  ratingLedger        RatingLedger[]
  sentFriendships     Friendship[] @relation("SentFriendships")
  receivedFriendships Friendship[] @relation("ReceivedFriendships")
}

model Session {
  id                      String     @id @default(cuid())
  userId                  String
  name                    String?
  puzzleType              PuzzleType @default(THREE_BY_THREE)
  isArchived              Boolean    @default(false)
  isActive                Boolean    @default(false)
  evaluatedForImprovement Boolean    @default(false)
  evaluatedAt             DateTime?
  createdAt               DateTime   @default(now())
  updatedAt               DateTime   @updatedAt

  user         User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  solves       Solve[]
  notes        Note[]
  ratingLedger RatingLedger[]

  @@index([userId])
  @@index([createdAt])
}

model Solve {
  id        String      @id @default(cuid())
  sessionId String
  time      Int         // Solve time in milliseconds
  scramble  String
  penalty   PenaltyType @default(NONE)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  session      Session       @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  post         Post?
  ratingLedger RatingLedger?

  @@index([sessionId])
  @@index([createdAt])
}

model RatingLedger {
  id              String         @id @default(cuid())
  userId          String
  category        RatingCategory
  amount          Decimal        @db.Decimal(12, 4)
  description     String?
  solveId         String?        @unique
  sessionId       String?
  lessonId        String?
  activityDate    String?
  streakMilestone Int?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  solve   Solve?   @relation(fields: [solveId], references: [id], onDelete: SetNull)
  session Session? @relation(fields: [sessionId], references: [id], onDelete: SetNull)
  lesson  Lesson?  @relation(fields: [lessonId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([category])
  @@index([userId, category])
  @@unique([userId, lessonId])
  @@unique([userId, activityDate, category])
}
```

---

## 7. Custom Engine Specifications

### A. Scramble Generation Engine (`client/src/services/scramble/`)
- **Primary Generator (`generator.js`)**: Wraps `cstimer_module` (`cstimer.getScramble(code, length)`). Maps normalized puzzle strings ('2x2', '3x3', '4x4', '5x5') to csTimer puzzle codes (`'222so'`, `'333'`, `'444wca'`, `'555wca'`).
- **Local Fallback (`generateLocalFallback`)**: Activates automatically if csTimer module fails or an unsupported puzzle is requested. Selects random face moves from `FALLBACK_MOVES` table while excluding the face of the preceding move to prevent trivial cancellations (`R R'`).
- **Output Contract (`ScrambleObject`)**:
  ```javascript
  {
    id: "uuid-string",
    puzzleType: "3x3",
    scramble: "R U R' U' R' F R2 U' R' U' R U R' F'",
    timestamp: 1785824961571,
    cubeState: null,
    visualization: null,
    metadata: {
      generator: "cstimer_module",
      generatedAt: "2026-08-04T12:00:00.000Z"
    }
  }
  ```

### B. Pure 3D Spatial Cube State Engine (`client/src/services/cubeEngine/`)
- **Spatial 3D Coordinate Mapping**: Maps face cell `(face, r, c)` in dimension $N$ to 3D unit cube space $(x, y, z) \in [-1, 1]^3$:
  $$\begin{aligned}
  u &= -1 + \frac{2c + 1}{N} \\
  v &= 1 - \frac{2r + 1}{N}
  \end{aligned}$$
  - Face $U$: $(x, y, z) = (u, 1, -v)$
  - Face $D$: $(x, y, z) = (u, -1, v)$
  - Face $F$: $(x, y, z) = (u, v, 1)$
  - Face $B$: $(x, y, z) = (-u, v, -1)$
  - Face $R$: $(x, y, z) = (1, v, -u)$
  - Face $L$: $(x, y, z) = (-1, v, u)$
- **Rigid 3D Point Rotation (`rotate3DPoint`)**: Rotates 3D coordinates 90° clockwise around turn face axis (e.g. $U$ turn: $(x, y, z) \to (-z, y, x)$).
- **Layer Turn Operation (`turnLayer`)**: Identifies stickers residing in layer $k$ of turn face using `isInLayer()`, applies 3D point rotation `rotate3DPoint()`, and maps coordinates back to target facelet cells via `spatialToFace()`.
- **Validation (`validateCubeState`)**: Verifies that each of the 6 canonical sticker colors (`WHITE`, `YELLOW`, `GREEN`, `BLUE`, `RED`, `ORANGE`) appears exactly $N^2$ times in the state matrix.

### C. Authoritative Gamification Engine (`server/services/gamification/`)
- **Solve Rating (`solveRating.js`)**:
  - `DNF` penalty = `0.0000` points.
  - Base points formula per puzzle type:
    $$\text{Points} = \text{Clamp}\left(\text{BaseMultiplier} \times \left(\frac{\text{TargetTimeMs}}{\text{EffectiveTimeMs}}\right)^{1.25}, 0.5, \text{MaxCap}\right)$$
- **Session Improvement Rating (`improvementRating.js`)**: Evaluates session mean when a session is closed/switched. Compares session mean against user's historical best session mean. If improved, awards bonus points based on percentage improvement.
- **Daily Activity & Streak Progression (`activityAndStreaks.js`)**: Checks user's `lastActiveDate` (ISO `YYYY-MM-DD`). If last active was yesterday, increments `currentStreak`; if today, retains streak; if earlier, resets `currentStreak = 1`. Awards daily activity bonus points (default `5.0000` pts) and streak milestone bonus points (e.g., 7-day, 30-day milestones).
- **Rating Ledger Reconciliation (`reconcileUserRating`)**: Performs SQL sum aggregation (`_sum: { amount: true }`) over `RatingLedger` entries for the user and updates `User.totalRating` cache field to eliminate drift.

---

## 8. Unit & Integration Testing Audit
- **`client/src/services/cubeEngine/cubeEngine.test.js`**: Unit tests verifying solved cube creation, 3D coordinate transformations (`faceTo3D` $\leftrightarrow$ `spatialToFace`), quarter/half layer turns across 2x2–5x5, scramble sequence parsing, move sequence application, and sticker color conservation validation.
- **`client/src/services/scramble/scramble.test.js`**: Unit tests for csTimer scramble generation, mapping validation, and fallback generator move sequence rules (consecutive move face exclusion).
- **`client/src/services/scramble/stage3Integration.test.js`**: Integration tests confirming that generated scramble strings parse correctly and apply cleanly to the 3D cube engine without throwing errors.
- **`server/test-auth.js`**: Server integration script testing registration, password hashing, login token verification, and Google OAuth payload handling.
- **`server/tools/socket-test.js`**: WebSocket connection and event emission verification tool.

---

## 9. Deployment Configuration & Environment Variables

### Frontend Deployment (`client/vercel.json`)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Environment Variable Requirements (Names & Purpose)
- `DATABASE_URL`: PostgreSQL connection string for Prisma ORM.
- `JWT_SECRET`: Secret key used for signing and verifying user JWT tokens.
- `GOOGLE_CLIENT_ID`: OAuth 2.0 client ID for Google Sign-In verification.
- `CLOUDINARY_URL`: Complete Cloudinary connection URI.
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`: Media upload credentials.
- `CLIENT_ORIGIN` / `CLIENT_URL`: Authorized CORS origin URLs.
- `VITE_API_BASE_URL`: Frontend API base URL (e.g. `http://localhost:5000/api`).
