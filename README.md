# Cubit

A modern speedcubing platform that blends timing, training, coaching, and community into one seamless experience.

Cubit is designed for everyone from beginners learning their first solve to experienced cubers tracking progress, improving performance, and competing with the community.

---

## Status

🚧 **Pre-Launch — V1 Final QA**

The core development of Cubit V1 is complete.

### Current Progress

- [x] Product Planning
- [x] Brand Identity
- [x] UI / UX Design
- [x] Frontend Development
- [x] Backend Development
- [x] Database
- [x] Frontend / Backend Integration
- [x] Community & Friendship System
- [x] Gamification & Rating System
- [x] Cubit Trainer V1
- [x] Landing Page
- [x] Legal & Open-Source Documentation
- [ ] Full-Product QA
- [ ] Production Launch

Cubit is currently undergoing its final testing and quality-assurance phase before the V1 public release.

---

## Overview

Cubit is an open-source web platform built specifically for cubers.

The goal is to bring the core parts of the speedcubing experience into one focused platform:

- Solve
- Train
- Learn
- Track progress
- Improve
- Compete
- Connect with other cubers

Cubit combines a precision timer, session tracking, statistics, training content, gamification, ratings, leaderboards, community features, and educational resources into a single experience.

The product is intentionally focused rather than feature-heavy.

---

## Features

### Solve

- Precision speedcubing timer
- Hold-to-start timing
- Solve logging
- WCA-style scramble generation
- 2×2 to 5×5 support
- +2 and DNF penalties
- Solve history
- Personal Best tracking
- Session-based solving
- Ao5 / Ao12 and other statistics
- Performance trends

### Cube Engine

Cubit includes its own cube-state and visualization infrastructure.

- Custom cube-state engine
- Cube visualization
- Interactive scramble visualization
- Algorithm playback
- Cube notation handling
- 2×2–5×5 support
- Interactive algorithm demonstrations

### Trainer

Cubit Trainer is the educational side of the platform, containing a structured **8-module learning system with 51 canonical lessons and resource articles**.

#### 01 — Getting Started

- Meet the Rubik's Cube
- Cube Types
- A Brief History of the Cube
- What is Speedcubing?
- Fun Cube Patterns

#### 02 — Cube Notation

- Basic Face Notation
- Prime & Double Turns
- Whole Cube Rotations
- Wide Moves
- 4×4 & 5×5 Notation

#### 03 — Solve Your First Cube

- Beginner solving method
- White Cross
- First-Layer Corners
- Middle Layer
- Yellow Cross
- Yellow Edges
- Yellow Corner Positioning
- Yellow Corner Orientation
- Bringing It All Together

#### 04 — Speedcubing Fundamentals

- From Solving to Speedsolving
- Inspection
- Cross Efficiency
- Turning & Finger Tricks
- Lookahead
- Reducing Pauses
- Understanding TPS

#### 05 — CFOP

- CFOP fundamentals
- Cross
- F2L
- F2L Cases
- F2L Efficiency
- 2-Look OLL
- Full OLL
- 2-Look PLL
- Full PLL
- Putting CFOP Together

#### 06 — Solving Other Cubes

- Solving the 2×2
- Solving the 4×4
- Solving the 5×5

#### 07 — Algorithms & Patterns

- Sexy Move
- Sledgehammer
- Checkerboard
- Snake
- Cube in a Cube
- More Fun Algorithms

#### 08 — Cubing Guides & Resources

- What Cube Should You Buy?
- Taking Care of Your Cube
- Lubrication & Maintenance
- Maintaining & Adjusting Magnetic Cubes
- WCA & Official Cubing
- Cubing Competitions & Events

Trainer content is written in MDX and integrated with Cubit's interactive cube and algorithm systems.

---

## Gamification & Rating

Cubit includes a dedicated rating and gamification system designed around actual cubing activity.

### Rating

Rating can be earned through:

- Solve performance
- Improvement
- Trainer completion
- Daily activity
- Streak milestones

The rating system uses an append-only ledger for auditable rating transactions and supports reconciliation of historical activity.

### Streaks

- Daily activity tracking
- Current streak
- Longest streak
- Streak milestone rewards

### Leaderboards

- Global Cubit Rating leaderboard
- Friends leaderboard
- Rank indicators
- Streak indicators

User profiles also expose a rating breakdown showing how their rating has been earned across different categories.

---

## Community

Cubit includes a community layer designed around cubers and their progress.

- Community feed
- Personal Best sharing
- Global leaderboard
- Friends leaderboard
- Friendship requests
- Friend management
- Notifications
- User profiles
- Rating and streak visibility
- Community interactions

---

## Focus Mode

Cubit includes a dedicated Focus Mode designed for uninterrupted solving sessions.

It provides an ambient environment while solving, with original Focus Mode audio created for Cubit.

---

## Profile & Progress

Each Cubit profile provides a snapshot of the user's cubing activity.

- Personal Bests
- Solve statistics
- Session history
- Progress trends
- Cubit Rating
- Rating breakdown
- Current streak
- Longest streak
- Community information

---

## Cubit.js

Cubit also includes **Cubit.js**, an open-source JavaScript package containing reusable cubing functionality developed as part of the Cubit ecosystem.

Repository:

https://github.com/parnilV06/Cubit.JS

Cubit.js is developed independently as a reusable package and is intended to make parts of Cubit's cubing functionality available outside the main application.

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Zustand
- Recharts

### Backend

- Node.js
- Express.js
- Prisma ORM

### Database

- PostgreSQL
- Neon
- Prisma

### Real-time

- Socket.IO

### Authentication

- JWT
- Google Sign-In

### Content

- MDX
- Custom Trainer content pipeline

### Deployment

- Vercel
- Railway

---

## Project Structure

```text
cubit/

├── client/
├── server/
├── docs/
├── content/
│
├── README.md
└── LICENSE
```

---

## Documentation

Project documentation lives in:

```text
docs/
```

Key documentation includes:

```text
docs/
├── PRD.md
├── HLD.md
├── LLD.md
├── APIBlueprint.md
├── BackendArchitecture.md
├── DatabaseDesign.md
├── ProjectArchitecture.md
├── EnvironmentSetup.md
├── CHANGES.md
├── CubitTrainerContent.md
├── CubitTrainerLessonSpecs.md
└── CubitTrainerContentGuidelines.md
```

The Trainer content itself is maintained separately through the project's MDX content structure.

---

## Completed Backend Modules

- Authentication
- Google Authentication
- Profile Management
- Sessions & Solves
- Statistics & Trends
- Community Feed
- Friendship System
- Notifications
- Gamification & Rating
- Leaderboards
- Trainer Module
- Rating Reconciliation / Backfill

---

## Design Principles

- Minimal over clutter
- Cubing first
- Fast interactions
- Open source
- Dark-first UI
- Community driven
- Accuracy over feature count
- Learning through interaction
- Build useful things, not generic features

---

## Development Roadmap

### Phase 1 — Ideation + Design

**Completed**

Product concept, architecture, branding and initial UX direction established.

### Phase 2 — Frontend Development

**Completed**

Core application interface and user experience implemented.

### Phase 3 — Backend + Database

**Completed**

Backend services, PostgreSQL schema, Prisma integration and core APIs implemented.

### Phase 4 — Integration + V1 Development

**Completed**

Frontend/backend integration, community features, gamification, rating, Trainer, landing page, legal foundation and remaining V1 functionality implemented.

### Phase 5 — Full-Product QA

**In Progress**

Final validation across:

- Authentication
- Timer
- Sessions
- Solves
- Statistics
- Trainer
- Community
- Friends
- Notifications
- Gamification
- Rating
- Leaderboards
- Profiles
- Landing page
- Responsive UI
- Deployment
- Production configuration

### Phase 6 — Cubit V1

**Next**

Production launch and the first public V1 release of Cubit.

---

## Contributing

Cubit is currently in its pre-launch phase.

Contributions will open after the initial public release.

---

## License

Cubit is open source under the **GNU General Public License v3.0**.

See [LICENSE](LICENSE) for the complete license text.

---

## Disclaimer

Cubit is an independent speedcubing platform.

Cubit is **not affiliated with, endorsed by, sponsored by, or certified by the World Cube Association (WCA)**.

Cubit results, ratings, leaderboards and solve records are not official WCA results.

For official competition rules and regulations, refer to the World Cube Association.

---

Built with ❤️ and a lot of solves.