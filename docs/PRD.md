# Cubit — Product Requirements Document (PRD)

## 1. Document Information
- **Document Title**: Cubit V1 Product Requirements Document
- **Product Name**: Cubit
- **Target Release**: V1.0.0 Production Launch
- **Author**: Cubit Engineering Team
- **Document Version**: 1.0.0
- **Last Updated**: August 4, 2026
- **Status**: Authoritative Final Specification

---

## 2. Product Overview
Cubit is a modern, high-performance, open-source speedcubing web application engineered for speedcubers, puzzle enthusiasts, and software developers. The platform integrates a real-time WCA-compliant timing engine, interactive NxN 2D Rubik's cube state visualizer, session management, comprehensive statistical telemetry, interactive learning modules, ambient focus audio, real-time social feeds, friend networks, and an authoritative ledger-backed gamification rating system.

Cubit is split into two distinct open-source software artifacts:
1. **Cubit Application**: A full-stack web application licensed under **GNU General Public License v3.0 (GPL-3.0)**.
2. **Cubit.js (`@06parnil/cubit.js`)**: A standalone, zero-dependency 3D spatial matrix state engine and 2D net visualization package licensed under the **MIT License**.

---

## 3. Problem Statement
Existing speedcubing timers and platforms suffer from fragmented user experiences:
- **Legacy UI & Accessibility**: Most timing tools feature outdated visual interfaces, lack mobile responsiveness, or rely on desktop-only web architectures.
- **Disconnected Features**: Timers, statistics dashboards, learning resources, and community forums exist on separate websites, forcing cubers to manage multiple accounts and disconnected data streams.
- **Opaque / Arbitrary Progress Metrics**: Speedcubers lack a transparent, ledger-audited rating system that measures holistic practice consistency, session progression, and technique mastery alongside raw single-solve PBs.
- **Framework Coupling in Math Engines**: Scramble visualizers and cube-state calculation packages are frequently tightly coupled to specific UI frameworks (e.g., React, DOM elements), preventing lightweight embedding in mobile or node environments.

---

## 4. Product Goals
- **Unified Speedcubing Environment**: Combine WCA scramble generation, real-time millisecond timing, session history, statistical analytics, structured training, ambient audio, and social networking into a seamless single-page application.
- **Deterministic 3D Mathematical State Engine**: Implement a pure JavaScript cube engine capable of tracking NxN (2x2 through 5x5) sticker transformations and rendering 2D unfolded nets without DOM dependencies.
- **Transparent Ledger-Backed Gamification**: Provide an uncheatable, audit-trailed rating engine (`RatingLedger`) that awards points for single solves, session improvements, daily practice streaks, and training completion.
- **High-Performance Architecture**: Maintain instantaneous timer responsiveness (<16ms frame render times) with persistent state synchronization across client and server.

---

## 5. Target Users
- **Competitive Speedcubers**: Cubers practicing WCA events who require exact millisecond timing, Ao5/Ao12 tracking, scramble visualization, and session organization.
- **Beginner & Intermediate Solvers**: Cubers building speed and learning advanced method algorithms (e.g., CFOP, Roux, 2-Look OLL/PLL) through guided lessons.
- **Cubing Community Members**: Users sharing PBs, discussion posts, commenting, liking, following friends, and tracking global rating leaderboards.
- **Third-Party Developers**: Engineers seeking a lightweight, open-source JS package (`@06parnil/cubit.js`) to parse WCA scrambles and render 2D cube nets in their own projects.

---

## 6. Product Scope & Functional Classification

### Currently Implemented (V1 Production Ready)
- **User Authentication**: Email/password registration & login with bcrypt (10 rounds), Google OAuth 2.0 single sign-on (`google-auth-library`), JWT bearer token authentication (7-day session validity), and session auto-restoration (`GET /api/auth/me`).
- **WCA Scramble Service**: WCA-compliant scramble generation for 2x2, 3x3, 4x4, 5x5, One-Handed, Pyraminx, Megaminx, Skewb, Square-1, Clock, and Blindfolded using `cstimer_module` with smart local pseudo-random fallback algorithms.
- **Pure JavaScript Cube Engine & 2D Visualizer**: Spatial 3D matrix transformation engine supporting NxN layer turns, move parsing, color conservation validation, and SVG/CSS 2D unfolded cube net rendering (`CubeNetRenderer.jsx`).
- **Timer & Solve Management**: Spacebar/touch-triggered millisecond timer, scramble display, penalty mutation (`NONE`, `+2`, `DNF`), solve deletion, and instant session sync.
- **Session Inventory & Management**: Multilingual/multi-puzzle session creation, session switching, session renaming, archiving, and deletion with deterministic fallback handling.
- **Statistical Telemetry**: Best time (PB), Ao5, Ao12, global mean calculations, solve count distribution, time range histograms, trend line charts (`Recharts`), and detailed solve inspection modals.
- **Authoritative Gamification & Rating Engine**: Multi-category `RatingLedger` accounting (`SOLVE`, `IMPROVEMENT`, `TRAINER`, `DAILY_ACTIVITY`, `STREAK_BONUS`), anti-duplication constraints, streak tracking, and ledger reconciliation (`POST /api/rating/reconcile`).
- **Community & Social Platform**: Global and category-filtered post feeds (`DISCUSSION`, `TIP`, `QUESTION`, `PB_SHARE`, `SOLVE_SHARE`), Cloudinary image attachments, likes/unlikes, nested comments, PB leaderboard, and Rating leaderboard.
- **Friendship & Notification Network**: User search, friend request dispatch (`PENDING`, `ACCEPTED`, `REJECTED`, `BLOCKED`), instant Socket.io real-time notifications (`notification:new`), and unread badge counters.
- **Interactive Trainer**: Structured lesson catalog, Markdown-rendered lesson guides, step-by-step completion tracking, and automatic trainer rating point awards.
- **Ambient Focus Audio System**: Multi-track ambient lofi player with native HTMLAudioElement event synchronization (`timeupdate`, `ended`, `error`), play/pause/seek controls, volume slider, looping toggle, and Cloudinary-hosted audio streaming.
- **Public & Legal Site**: Responsive landing page, interactive `/cubitjs` product page, public user profiles (`/profile/:username`), Contact Us modal, Privacy Policy (`/privacy`), and Terms of Use (`/terms`).

### Planned / Post-V1 Work (Explicitly Not in Core V1 Build)
- **Self-Service Account Deletion**: Self-service user account deletion UI and `DELETE /api/profile` backend endpoint.
- **Admin Moderation Portal**: User ban/flagging schema (`isBanned`) and admin role management middleware.
- **Direct Messaging (1v1 Chat)**: Socket-based private messaging between accepted friends.
- **Bluetooth Smart Cube Integration**: WebBluetooth API integration for hardware cubes (e.g., GAN i, Giiker).

---

## 7. Core User Journeys

### Journey 1: New User Onboarding & First Practice Session
1. User lands on `/`, clicks **Get Started**, and registers at `/signup` or uses **Google Sign-In**.
2. Upon registration, the system creates a default active 3x3 session (`Default Session`) and grants a JWT token.
3. User is redirected to `/app` (Timer Dashboard).
4. User holding down Spacebar initializes the timer pre-start state (visual yellow indicator). Releasing spacebar starts the timer.
5. Upon solve completion (Spacebar pressed), the elapsed time (ms) and active scramble are recorded to the backend (`POST /api/solves`).
6. The Gamification Engine calculates solve points, logs a `RatingLedger` row, updates total rating, checks daily streak progression, generates a new scramble, and updates the local UI seamlessly.

### Journey 2: Social Sharing & Leaderboard Progression
1. User completes a new 3x3 Personal Best solve on the timer.
2. User navigates to `/app/community` and clicks **Create Post**.
3. User selects `PB_SHARE` type, attaches the solve details and an optional image, and posts.
4. Friends receive a real-time Socket.io notification (`notification:new`).
5. User checks the global **Rating Leaderboard** tab to view their current rank relative to top platform solvers.

---

## 8. Non-Functional Requirements
- **Performance**: Timer precision measured using High-Resolution Timers (`performance.now()`); render cycles must not drop below 60 FPS during timing.
- **Security**: Passwords hashed with bcrypt (10 rounds); JWT signed with HS256 algorithm; CORS whitelist restricting origins to authorized domains and Vercel preview environments.
- **Reliability & Fallbacks**: Fallback pseudo-random scramble generator activates automatically if `cstimer_module` throws an error; focus audio falls back to a static catalog if remote tracks API is unreachable.
- **Data Integrity**: Financial-grade `RatingLedger` using PostgreSQL `Decimal(12,4)` types and Prisma transactions (`$transaction`) to guarantee zero race conditions or double-rewarding.

---

## 9. Key Environment Variables (Name & Purpose Only)
- `DATABASE_URL`: PostgreSQL connection string (Neon serverless or pg pool).
- `JWT_SECRET`: Secret key used for signing and verifying JWT tokens.
- `GOOGLE_CLIENT_ID`: OAuth 2.0 client ID for Google Sign-In verification.
- `CLOUDINARY_URL` / `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`: Media storage credentials.
- `CLIENT_ORIGIN` / `CLIENT_URL`: Authorized CORS origin URLs.
- `VITE_API_BASE_URL`: Frontend API base URL (e.g. `http://localhost:5000/api` or production URL).
