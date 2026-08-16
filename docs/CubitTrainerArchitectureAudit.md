# Cubit Trainer V1 — Technical Architecture Audit

> **Document Type:** Technical Architecture Audit & Gap Analysis  
> **Status:** Approved Baseline  
> **Target Version:** Cubit Trainer V1.0  
> **Audited Date:** August 2026  
> **Auditors:** Antigravity AI Engineering Team  
> **Source of Truth Reference Documents:**  
> - `docs/CubitTrainerContent.md` (Curriculum & Content Specification)  
> - `docs/CubitTrainerLessonSpecs.md` (Lesson Specifications & Contract)  
> - `docs/CubitTrainerContentGuidlines.md` (Content Design & Presentation Guidelines)  

---

## 1. Executive Summary & Audit Scope

### 1.1 Context & Objective
Cubit Trainer is the platform's core educational module designed to guide users from complete beginners to confident speedcubers. While foundational building blocks for lesson delivery, progress tracking, and gamification currently exist in the codebase, the system must scale to support the complete **V1 Curriculum Baseline**: **8 Modules, 45 Structured Lessons, 6 Informational Guides (51 total content pieces)**, interactive 2D/3D visualizers, practice exercises, and dynamic graph-based navigation.

This audit provides a comprehensive, non-destructive technical evaluation of the existing Cubit Trainer implementation. It maps the current state of the backend services, database models, frontend presentation layer, cube state engine, and gamification ledger to establish the definitive blueprint for Trainer V1 implementation.

### 1.2 Audit Ground Rules & Constraints
In accordance with engineering guidelines:
- **No functional code, migrations, or schema definitions were modified** during this audit.
- Evaluation strictly followed the architectural hierarchy: **REUSE > EXTEND > ADD > REWRITE**.
- All findings are validated against active code in the repository.

---

## 2. Current System Architecture (As-Is State)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   FRONTEND (Vite + React 19)                            │
│                                                                                         │
│  /app/trainer                  /app/trainer/lesson/:id         cubeEngine (Deterministic)│
│  ┌───────────────────────────┐ ┌─────────────────────────────┐ ┌───────────────────────┐│
│  │ <Trainer />               │ │ <Lesson />                  │ │ engine.js (NxN State) ││
│  │ - Groups by category      │ │ - Naive string splitting    │ │ parser.js (WCA moves) ││
│  │ - Fetches /progress       │ │ - stripFrontmatter() regex  │ │ CubeNetRenderer.jsx   ││
│  │ - Renders card grid       │ │ - Complete lesson button    │ │ (2D Unfolded Net)     ││
│  └─────────────┬─────────────┘ └──────────────┬──────────────┘ └───────────────────────┘│
└────────────────┼──────────────────────────────┼─────────────────────────────────────────┘
                 │ HTTP (Axios + JWT)           │ HTTP (Axios + JWT)
┌────────────────┼──────────────────────────────┼─────────────────────────────────────────┐
│                ▼                              ▼                                         │
│  /api/trainer/lessons          /api/trainer/lessons/:slug/complete                      │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                       BACKEND (Express 5.2.1 + Node.js)                           │  │
│  │                                                                                   │  │
│  │  trainer.routes.js ──► trainer.controller.js ──► trainer.service.js               │  │
│  │                                                          │                        │  │
│  │                                     ┌────────────────────┴─────────────────────┐  │  │
│  │                                     ▼                                          ▼  │  │
│  │                          Prisma Client (Neon DB)                    content/trainer/*.mdx│
│  │                          - Lesson                                   (Local File System)  │
│  │                          - LessonProgress                                                │
│  │                          - RatingLedger                                                  │
│  │                          - GamificationEngine                                            │
│  └───────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Backend & API Service Layer
- **Routes (`server/routes/trainer.routes.js`):**
  - Protected behind `authMiddleware` (all trainer routes currently require authentication).
  - Surface endpoints:
    - `GET /api/trainer/lessons` — Returns all published lessons with user completion status.
    - `GET /api/trainer/lessons/:slug` — Returns metadata combined with raw MDX content read from disk.
    - `POST /api/trainer/lessons/:slug/complete` — Transactionally marks progress as complete and triggers rating reward.
    - `GET /api/trainer/progress` — Calculates per-category and total completion percentages.
- **Controller (`server/controllers/trainer.controller.js`):**
  - Clean async handlers with standardized error responses (`400`, `404`, `500`).
- **Service (`server/services/trainer.service.js`):**
  - File system resolution: Loads Markdown content via `fs.readFile(path.join(CONTENT_DIR, `${slug}.mdx`), 'utf8')`.
  - Database resolution: Queries `prisma.lesson` and `prisma.lessonProgress`.
  - Transactional completion: Manages idempotent updates in a Prisma `$transaction` and invokes `GamificationEngine.awardTrainerCompletion`.

### 2.2 Database Schema & Models (`server/prisma/schema.prisma`)
- **`Lesson` Model:**
  ```prisma
  model Lesson {
    id               String           @id @default(cuid())
    slug             String           @unique
    title            String
    description      String
    difficulty       String           // "BEGINNER", "INTERMEDIATE", "ADVANCED"
    category         String           @default("General")
    estimatedMinutes Int
    order            Int
    thumbnail        String?
    published        Boolean          @default(false)
    createdAt        DateTime         @default(now())
    updatedAt        DateTime         @updatedAt
    progress         LessonProgress[]
    ratingLedger     RatingLedger[]
  }
  ```
- **`LessonProgress` Model:**
  ```prisma
  model LessonProgress {
    id          String    @id @default(cuid())
    userId      String
    lessonId    String?
    completed   Boolean   @default(false)
    completedAt DateTime?
    createdAt   DateTime  @default(now())
    updatedAt   DateTime  @updatedAt
    user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
    lesson      Lesson?   @relation(fields: [lessonId], references: [id], onDelete: SetNull)

    @@unique([userId, lessonId])
    @@index([userId])
    @@index([lessonId])
  }
  ```
- **`RatingLedger` Model Integration:**
  - Contains `category: TRAINER` with foreign key `lessonId`.
  - Enforces `@@unique([userId, lessonId])`, guaranteeing that rating points are awarded exactly once per lesson per user.

### 2.3 Frontend Presentation Layer
- **Trainer Dashboard (`client/src/components/pages/trainer.jsx`):**
  - Fetches lessons via `trainerAPI.getLessons()` and progress via `trainerAPI.getProgress()`.
  - Dynamically groups lessons by `lesson.category`.
  - Renders category progress bars and lesson cards with difficulty badges and completion indicators.
- **Lesson Page (`client/src/components/pages/lesson.jsx`):**
  - Route: `/app/trainer/lesson/:id` (where `` represents the lesson slug).
  - Fetches lesson metadata and raw MDX content from `trainerAPI.getLesson(id)`.
  - **Current Content Rendering Strategy:**
    - Uses a custom `stripFrontmatter(mdText)` regex helper.
    - Uses a custom `renderMarkdown(text)` function that splits text by `\n\n+` and performs naive string matching (`#`, `##`, `###`, ```` ``` ````, `- `).
    - **Critical Finding:** There is currently **no MDX AST compiler, JSX runtime, or React component injection pipeline**. Raw HTML/JSX tags inside MDX are treated as plain text strings.
  - Completion Workflow: Button triggers `trainerAPI.completeLesson(id)`, shows a celebratory notification, and displays awarded rating points.

### 2.4 Cube Engine Integration (`client/src/services/cubeEngine/`)
- **Mathematical State Engine (`engine.js`, `matrix.js`):**
  - Fully deterministic 3D coordinate space transformation for $N \times N$ cubes ($2 \times 2$ to $5 \times 5$).
  - Functions: `createSolvedCube`, `turnLayer`, `applyMove`, `applyScramble`, `validateCubeState`, `getCenterStickers`.
  - Pure JavaScript with zero UI/DOM dependencies.
- **Move & Scramble Parser (`parser.js`):**
  - Tokenizes WCA moves (`R`, `U2`, `F'`, `Rw`, `3Fw2`).
  - **Limitation:** Does not currently support whole-cube rotations (`x`, `y`, `z`) or slice turns (`M`, `E`, `S`).
- **2D Visualizer (`visualizer/CubeNetRenderer.jsx`, `mapper.js`):**
  - Renders canonical unfolded 2D net layout (U on top, L-F-R-B in middle row, D on bottom).
  - Fully responsive with pure inline styles.
- **3D Interactive Assets:**
  - `client/src/components/ui/InteractiveCube.jsx` and `Model.jsx` render a static `/cube.glb` model with canvas mouse-flick spin. It is decoupled from `cubeEngine` state.

### 2.5 Gamification & Rating Subsystem
- **Engine (`server/services/gamification/trainerRating.js`):**
  - Fully operational and tested.
  - Award formula based on `TRAINER_REWARDS` constants:
    - Beginner: `+1.00` rating
    - Intermediate: `+2.00` rating
    - Advanced: `+3.00` rating
  - Updates `RatingLedger` and increments `User.totalRating` in a transactional manner.

### 2.6 Existing Content State
- `content/trainer/` contains only **1 single placeholder file**: `cube-notation.mdx` (15 lines).
- Database contains 0 seeded lesson records in `server/prisma/seed.js`.

---

## 3. Comprehensive Gap Analysis (Current State vs. V1 Specification)

| Domain | Current Implementation | V1 Curriculum Requirement | Gap / Architectural Requirement |
|---|---|---|---|
| **Content Volume** | 1 placeholder (`cube-notation.mdx`) | 51 items (45 structured lessons + 6 informational guides) | 50 lessons/guides need to be authored and structured. |
| **Curriculum Structure** | Flat string `category` field | 8 structured modules with distinct roles and progression | Need formal module definitions, module indices, and guide separation. |
| **MDX / Rendering Pipeline** | Naive string-splitting `renderMarkdown()` in `lesson.jsx` | Rich MDX with custom React components, callouts, tables, diagrams | Need a robust client-side Markdown/MDX component renderer supporting custom tags (`<CubeViewer />`, `<AlgorithmPlayer />`, callouts, quiz checks). |
| **Cube Engine Capabilities** | Face turns (`U, D, L, R, F, B`) & Wide moves (`Rw, 3Fw`) | Face turns, wide moves, slice moves (`M, E, S`), and whole-cube rotations (`x, y, z`) | Extend `parser.js` and `engine.js` to support `x, y, z` rotations and `M, E, S` slices. |
| **Interactive Lesson Widgets** | Static 2D net harness (`CubeStage2VisualizerHarness.jsx`) | Embedded interactive cube players with step-by-step playback, move buttons, resets, and visual cues | Build modular React components (`<CubeViewer />`, `<AlgorithmPlayer />`, `<NotationTrainer />`) powered by `cubeEngine`. |
| **Navigation & Learning Graph** | Simple "Back to Trainer" link | Structured "What's Next?" section (Next Lesson, Related, Explore) | Create a metadata-driven navigation component adhering to Section 6 of `CubitTrainerLessonSpecs.md`. |
| **Practice & Knowledge Checks** | None (only manual "Mark as Complete" button) | Identification, multiple choice, move prediction, interactive execution | Build lightweight interactive quiz and practice components. |
| **Guides & Resources (Module 08)** | None | 6 evergreen guide articles (non-gamified / no rating reward) | Support informational content type that bypasses rating ledger or marks progress separately. |
| **Database Seeding** | No lessons in `seed.js` | All 51 lessons seeded with slugs, titles, descriptions, categories, and orders | Create comprehensive Prisma seed script for all 51 content items. |

---

## 4. Architectural Evaluation & Reuse Hierarchy

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                                ARCHITECTURAL DECISION MATRIX                          │
├─────────────────┬─────────────────────────────────────────────────────────────────────┤
│ REUSE (Keep)    │ • Backend API routes & controllers (/lessons, /complete, /progress) │
│                 │ • Gamification rating service & constants (trainerRating.js)        │
│                 │ • Core NxN 3D spatial state engine (engine.js, matrix.js)           │
│                 │ • 2D Net visualizer renderer (CubeNetRenderer.jsx)                  │
│                 │ • Prisma schema models (Lesson, LessonProgress, RatingLedger)       │
├─────────────────┼─────────────────────────────────────────────────────────────────────┤
│ EXTEND          │ • Scramble parser (add whole-cube x/y/z & slice M/E/S moves)        │
│                 │ • trainer.service.js (support frontmatter parsing & rich metadata)  │
│                 │ • Trainer dashboard (module-based grouping & guide cards)           │
│                 │ • Database seed script (seed all 51 V1 curriculum items)            │
├─────────────────┼─────────────────────────────────────────────────────────────────────┤
│ ADD (New)       │ • Interactive Lesson Widgets (<CubePlayer />, <AlgorithmTrainer />) │
│                 │ • Component-aware Markdown rendering pipeline                       │
│                 │ • "What's Next?" learning graph navigation component                │
│                 │ • Interactive practice/quiz widgets                                 │
│                 │ • 51 production-grade MDX lesson & guide documents                  │
├─────────────────┼─────────────────────────────────────────────────────────────────────┤
│ DO NOT REWRITE  │ • Do NOT replace Neon DB / Prisma with pure static file routing     │
│                 │ • Do NOT rewrite the CubeEngine mathematics from scratch            │
│                 │ • Do NOT modify the GamificationEngine rating formulas              │
└─────────────────┴─────────────────────────────────────────────────────────────────────┘
```

### 4.1 Database Schema Evaluation: To Migrate or Not To Migrate?
**Recommendation: DO NOT ALTER THE PRISMA SCHEMA.**
The current `Lesson` model contains:
- `id`, `slug` (unique identifier)
- `title`, `description`
- `difficulty` (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`)
- `category` (stores Module name or ID, e.g. `01. Getting Started`, `02. Cube Notation`)
- `estimatedMinutes`, `order`, `thumbnail`, `published`

This model is **100% sufficient** for V1 indexing, list filtering, and progress tracking. Rich lesson-specific metadata (such as `prerequisites`, `objectives`, `nextLesson`, `relatedLessons`, `exploreLessons`, and `type`) is best stored directly within the MDX YAML frontmatter. This achieves the ideal hybrid architecture:
1. **Database:** High-speed queries, progress tracking, category aggregation, and gamification ledger.
2. **MDX Frontmatter & Body:** Deep educational structure, interactive component configuration, and learning graph relationships.

---

## 5. Technical Feasibility & Subsystem Deep Dives

### 5.1 MDX Rendering Strategy in Vite + React 19
The existing `lesson.jsx` relies on a custom string-splitting function that fails when custom React components or nested Markdown structures are encountered.

**Evaluated Approaches:**
1. **Option A: Full Client-Side MDX Bundler (`@mdx-js/mdx` / `next-mdx-remote`)**
   - *Pros:* Complete JSX arbitrary syntax.
   - *Cons:* Extremely heavy bundle size; complex Vite compilation in browser runtime; compatibility friction with React 19.
2. **Option B: Lightweight Component-Aware Markdown Pipeline (`react-markdown` + `remark-gfm` + Custom Component Scope)**
   - *Pros:* Highly performant, zero eval/bundler overhead, flawless React 19 support, supports custom component overrides (e.g. `<CubeViewer />`, `<AlgorithmBox />`, `<Quiz />`, `<Callout />`).
   - *Cons:* Requires defining allowed custom tags in component map (which is actually a benefit for security and design consistency).
3. **Option C: Custom Block Tokenizer**
   - *Pros:* Zero external dependencies.
   - *Cons:* Maintenance burden, fragile edge-case parsing.

**Architectural Recommendation:** Adopt **Option B** (`react-markdown` + component mapping). This allows authors to embed interactive cube widgets and callouts directly in standard Markdown/MDX files with zero friction.

### 5.2 Cube Engine Extensions for V1
The current `cubeEngine` is mathematically sound for NxN layer turns. To satisfy the notation curriculum in Module 02 and CFOP in Module 05, the following non-breaking extensions must be made:
1. **Whole Cube Rotations (`x`, `y`, `z`):**
   - `x`: Rotate entire cube around X axis (equivalent to `[R L' M']` or rotating all X layers clockwise).
   - `y`: Rotate entire cube around Y axis (equivalent to `[U D' E']`).
   - `z`: Rotate entire cube around Z axis (equivalent to `[F B' S]`).
2. **Slice Moves (`M`, `E`, `S`):**
   - `M` (Middle layer between L and R, follows L direction: $k=1$ turn for 3x3).
   - `E` (Equatorial layer between U and D, follows D direction).
   - `S` (Standing layer between F and B, follows F direction).
3. **Interactive Widget Components:**
   - `<CubeViewer state="..." moves="..." />`: Displays 2D Net or 3D view of an exact cube state.
   - `<AlgorithmPlayer algorithm="R U R' U'" />`: Interactive player with Play, Pause, Step Forward, Step Backward, and Reset buttons.
   - `<NotationTrainer moves={['U', 'D', 'L', 'R', 'F', 'B']} />`: Interactive button pad that animates individual moves on the cube.

### 5.3 Learning Graph & "What's Next?" Navigation Engine
To meet Section 6 of `CubitTrainerLessonSpecs.md`, the client will parse frontmatter navigation fields:
```yaml
nextLesson: notation-prime-double-turns
relatedLessons:
  - notation-whole-cube-rotations
  - notation-wide-moves
exploreLessons:
  - getting-started-fun-patterns
```
The `<WhatsNext />` component will query the lesson cache/metadata to render rich cards with titles, descriptions, and direct route links, ensuring no learner reaches a dead end.

---

## 6. The "Golden Lesson" Pilot Strategy

Before authoring all 51 content documents, a **Golden Lesson** must be implemented and validated as the architectural benchmark.

### Recommended Pilot: `notation-basic-face-notation` (Module 02, Lesson 01)
**Why this lesson?**
1. **Combines Concept & Interaction:** Requires clear conceptual prose, visual face-labelled diagrams, and interactive move controls (`U, D, L, R, F, B`).
2. **Exercises the Cube Engine:** Directly triggers face turns and state resets on the interactive cube.
3. **Tests Frontmatter & Navigation:** Links to preceding module (`getting-started-fun-patterns`) and next lesson (`notation-prime-double-turns`).
4. **Validates Gamification:** Tests completion rating award (`+1.00` beginner reward) in end-to-end flow.

---

## 7. Risk Assessment & Mitigation Matrix

| Risk | Severity | Impact | Mitigation Strategy |
|---|---|---|---|
| **React 19 Compatibility** | Medium | Third-party MDX packages failing on React 19 peer dependencies | Use standard `react-markdown` with React 19 compatibility or pure React component dispatch. |
| **Metadata Drift (DB vs MDX)** | Medium | Inconsistency between database `title`/`difficulty` and MDX frontmatter | Establish a single CLI sync/seed script (`server/scripts/sync-trainer-content.js`) that extracts frontmatter and seeds Postgres. |
| **Large Curriculum Authoring Scale** | Medium | Authoring 51 comprehensive documents without quality loss | Follow strict blueprints in `CubitTrainerLessonSpecs.md` and `CubitTrainerContentGuidlines.md` module by module. |
| **Informational Guides vs Gamification** | Low | Users expecting rating rewards on non-lesson guide articles | Mark Module 08 guides with `type: "Guide"` in frontmatter; configure backend to exclude Module 08 from rating rewards. |

---

## 8. Implementation Roadmap & Phased Execution Plan

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 IMPLEMENTATION PHASES                                  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: Core Engine Extensions & Interactive Widgets                                  │
│ • Extend parser.js and engine.js for x, y, z rotations & M, E, S slices                │
│ • Build <AlgorithmPlayer />, <CubeViewer />, and <NotationTrainer /> components        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: Markdown/MDX Component Pipeline & Golden Lesson Pilot                         │
│ • Implement robust component-aware Markdown renderer in client                         │
│ • Build <WhatsNext />, <Callout />, and <Quiz /> UI components                         │
│ • Author & validate Golden Lesson: notation-basic-face-notation                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: Database Seeding & Service Layer Synchronization                              │
│ • Build content-sync script to read all frontmatter and populate prisma.lesson         │
│ • Seed all 51 curriculum lessons and guides across 8 modules                           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: Full Curriculum Content Authoring (Modules 01 - 08)                           │
│ • Batch 1: Module 01 (Getting Started - 5 lessons) & Module 02 (Notation - 5 lessons)  │
│ • Batch 2: Module 03 (Solve First Cube - 9 lessons) & Module 04 (Fundamentals - 7)     │
│ • Batch 3: Module 05 (CFOP - 10 lessons) & Module 06 (Other Cubes - 3 lessons)         │
│ • Batch 4: Module 07 (Algorithms - 6 lessons) & Module 08 (Guides - 6 articles)        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 5: Dashboard Overhaul & End-to-End Verification                                  │
│ • Upgrade Trainer dashboard to display 8 module accordions, guide cards & progress     │
│ • Verify end-to-end completion workflow, rating ledger entries, and profile streaks    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Conclusion & Readiness Sign-off

The Cubit codebase possesses a solid, well-designed architectural foundation:
- The **Prisma database models** and **Gamification Engine** are production-ready and require zero destructive schema migrations.
- The **Cube Engine** is mathematically sound and only requires non-breaking move-set additions (`x, y, z`, `M, E, S`).
- The primary architectural upgrades required are the **component-aware Markdown rendering pipeline**, **interactive lesson widgets**, and **systematic authoring of the 51 curriculum documents**.

This audit report serves as the definitive engineering baseline for the Trainer V1 implementation.