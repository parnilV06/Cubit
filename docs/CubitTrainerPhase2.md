# Cubit Trainer V1 — Phase 2: MDX Lesson Pipeline & Interactive Golden Lesson
**Document Version:** 1.0.0  
**Status:** Complete & Validated  
**Module Scope:** `client/src/components/trainer/mdx/`, `client/src/components/trainer/navigation/`, `client/src/components/pages/lesson.jsx`, `content/trainer/`

---

## 1. Executive Summary

Phase 2 of Cubit Trainer V1 connects the interactive cube engine infrastructure built in Phase 1 to a secure, zero-dependency MDX lesson pipeline. It replaces the legacy static markdown parser with a deterministic AST-based MDX renderer and explicit React component registry.

The milestone delivers the **Golden Lesson** (`Basic Face Notation`) and supporting lesson fixtures (`Prime & Double Turns`), demonstrating end-to-end interactive cubing instruction with live 2D cube nets, move sandboxes, step-by-step algorithm playback, and automatic progress persistence.

---

## 2. Safe MDX Pipeline Architecture

```
                               ┌────────────────────────┐
                               │ Raw MDX Lesson Content │
                               │ (Markdown + JSX tags)  │
                               └───────────┬────────────┘
                                           │
                                           ▼
                               ┌────────────────────────┐
                               │   parseFrontmatter()   │
                               │  (YAML Metadata Ext.)  │
                               └───────────┬────────────┘
                                           │
                                           ▼
                               ┌────────────────────────┐
                               │       parseMDX()       │
                               │ (Deterministic AST)    │
                               └───────────┬────────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
             Standard Markdown Nodes                 JSX Component Nodes
        (Headings, Lists, Tables, Code)            (CubeViewer, Callout, etc.)
                        │                                     │
                        │                                     ▼
                        │                          ┌─────────────────────┐
                        │                          │ COMPONENT_REGISTRY  │
                        │                          │  (Explicit Sandbox) │
                        │                          └──────────┬──────────┘
                        │                                     │
                        └──────────────────┬──────────────────┘
                                           ▼
                               ┌────────────────────────┐
                               │     <MDXRenderer />    │
                               │ (Interactive React UI) │
                               └────────────────────────┘
```

### 2.1 Frontmatter Extraction (`parseFrontmatter`)
- Extracts YAML block bounded by `---`.
- Parses scalar fields (`title`, `description`, `category`, `difficulty`, `estimatedMinutes`, `order`) with strict type coercion for numbers and booleans.
- Preserves clean body content for block AST tokenization.

### 2.2 JSX Attribute Scanner (`parseJSXAttributes`)
- Pure tokenizer utilizing a balanced-brace character scanner without `eval()` or `Function()` constructors.
- Supports:
  - String literals: `title="Notation Practice"`
  - Numeric values: `speed={1.5}` or `dimension={3}`
  - Boolean expressions: `showReset={true}` / `showReset={false}`
  - Bare boolean flags: `showReset`
  - Array expressions: `moves={["R", "U", "F"]}`
  - Object expressions: `style={{ margin: '0 auto' }}`

### 2.3 AST Tokenization (`parseMDX`)
Tokenizes raw content into an array of typed AST nodes:
- **`heading`**: `#`, `##`, `###`, `####` with sanitized slug anchor IDs (e.g. `id="right-face-r"`).
- **`paragraph`**: Contiguous text with inline formatting (`**bold**`, `*italic*`, `` `code` ``, `[links](url)`, `<kbd>`).
- **`list`**: Unordered (`-`, `*`) and ordered (`1.`, `2.`) list blocks.
- **`code_block`**: Fenced code blocks with language syntax labels.
- **`callout`**: GitHub-style alert callouts (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, `> [!IMPORTANT]`, `> [!CAUTION]`).
- **`blockquote`**: Standard quote blocks.
- **`table`**: GFM pipe tables with headers, alignment, and row arrays.
- **`thematic_break`**: Horizontal rules (`---`).
- **`jsx_component`**: Embedded self-closing (`<Component ... />`) and paired (`<Component>...</Component>`) React tags.

---

## 3. Explicit Safe Component Registry

To maintain complete sandboxed execution and prevent arbitrary code execution, MDX components are mapped through a strict whitelist in `client/src/components/trainer/mdx/componentRegistry.js`:

| Registry Tag | Target React Component | Description |
| :--- | :--- | :--- |
| `<CubeViewer />` | `CubeViewer.jsx` | Deterministic 2D net viewer with state validation and reset. |
| `<AlgorithmPlayer />` | `AlgorithmPlayer.jsx` | Step-by-step interactive player with speed & step controls. |
| `<NotationTrainer />` | `NotationTrainer.jsx` | Interactive move execution sandbox with undo & history. |
| `<Callout />` | `Callout.jsx` | Styled alert callout cards with icons and color tokens. |
| `<WhatNext />` | `WhatNext.jsx` | Next lesson recommendation cards with dynamic routing. |
| `<LessonNavigation />` | `LessonNavigation.jsx` | Lesson progression, mark complete, and next buttons. |

*Security Guardrail:* Any unrecognized or malicious tag (e.g., `<script>`, `<iframe/>`, `<Unknown />`) is safely omitted or rendered as a benign fallback without executing untrusted code.

---

## 4. UI & Navigation Infrastructure

### 4.1 Callout Alerts (`Callout.jsx`)
Features tailored styling matching the dark glassmorphic Cubit design system for:
- `note`: Blue accent (`#3b82f6`) with `Info` icon.
- `tip`: Emerald accent (`#10b981`) with `Lightbulb` icon.
- `important`: Purple accent (`#a855f7`) with `AlertCircle` icon.
- `warning`: Amber accent (`#f59e0b`) with `AlertTriangle` icon.
- `caution`: Rose accent (`#f43f5e`) with `ShieldAlert` icon.

### 4.2 Next Lesson Cards (`WhatNext.jsx`)
- Displays target lesson title, description, category, and estimated duration.
- Shows current completion status badge (Completed vs. Up Next).
- Provides direct navigation via React Router `navigate()`.

### 4.3 Lesson Progression Bar (`LessonNavigation.jsx`)
- Positioned at the footer of every lesson.
- Handles **Previous Lesson**, **Mark as Complete**, and **Next Lesson** transitions.
- Dispatches optimistic completion mutations to `trainer.service.js` to update XP ratings and mark lessons complete in the database.

---

## 5. Golden Lesson Content: `basic-face-notation.mdx`

The Golden Lesson (`content/trainer/basic-face-notation.mdx`) has been authored to demonstrate every layer of the interactive system:

1. **Lesson Overview & Metadata:** 6-minute beginner module introducing the 6 standard faces ($R, L, U, D, F, B$).
2. **Interactive Solved Cube:** Embedded `<CubeViewer dimension="3x3" title="Standard Solved Cube" />` illustrating starting face colors.
3. **Notation Conventions & Mechanics:** In-depth explanation of clockwise turns viewed directly from each face, complete with GFM table summaries.
4. **Interactive Practice Workbench:** Embedded `<NotationTrainer moves="basic" title="Face Moves Practice Pad" />` allowing users to click moves and observe real-time color permutations with undo/reset.
5. **The First Algorithm:** Embedded `<AlgorithmPlayer algorithm="R U R' U'" title="The Right-Hand 'Sexy Move'" />` demonstrating the 4-move trigger with step navigation and playback controls.
6. **Next Steps Navigation:** Embedded `<WhatNext nextLessonSlug="prime-double-turns" />` linking to the next module.

---

## 6. End-to-End Lesson Flow (`lesson.jsx`)

The lesson route (`/app/trainer/lesson/:id`) has been refactored in `client/src/components/pages/lesson.jsx`:
1. Fetches lesson metadata and raw MDX content from `trainer.service.getLesson(slug)`.
2. Extracts frontmatter and compiles the MDX AST.
3. Renders the interactive lesson body via `<MDXRenderer />`.
4. Renders `<LessonNavigation />` connected to the user's progress tracking and gamification rewards.

---

## 7. Verification & Test Suite

### 7.1 Automated Pipeline Tests (`client/scripts/test-mdx-pipeline.js`)
All 33 unit and integration tests execute successfully in <15ms:
- ✅ Frontmatter parsing and scalar type coercion.
- ✅ Balanced-brace JSX attribute parsing for strings, numbers, booleans, arrays, and flags.
- ✅ Heading slug sanitization and ID generation.
- ✅ Unordered and ordered list tokenization.
- ✅ Alert callouts (`[!NOTE]`, `[!TIP]`, `[!WARNING]`).
- ✅ Fenced code blocks and GFM pipe tables.
- ✅ Multiline self-closing and paired JSX tag parsing.
- ✅ Component registry whitelist security checks.
- ✅ Golden lesson (`basic-face-notation.mdx`) structural and component integrity.

### 7.2 Production Build Verification
- Client bundle built cleanly with Vite: `✓ built in 866ms` (`npm run build`).
- Zero build-time syntax or missing module warnings.

### 7.3 Database Seeding
- Seeded via `server/scripts/seed-trainer-v1.js` with Neon PostgreSQL WebSocket adapter:
  - `basic-face-notation` (Order 1, Beginner, Cube Notation)
  - `prime-double-turns` (Order 2, Beginner, Cube Notation)
  - `cube-notation` (Legacy alias)

---

## 8. Summary of Phase 2 Artifacts

| File Path | Purpose |
| :--- | :--- |
| `client/src/components/trainer/mdx/mdxParser.js` | Pure deterministic AST parser for MDX/Markdown. |
| `client/src/components/trainer/mdx/componentRegistry.js` | Explicit whitelist mapping approved JSX tags to components. |
| `client/src/components/trainer/mdx/MDXRenderer.jsx` | React component rendering the compiled AST. |
| `client/src/components/trainer/mdx/Callout.jsx` | Dark glassmorphic alert callout component. |
| `client/src/components/trainer/navigation/WhatNext.jsx` | Next lesson recommendation card component. |
| `client/src/components/trainer/navigation/LessonNavigation.jsx` | Lesson bottom navigation and completion controls. |
| `client/src/components/pages/lesson.jsx` | Integrated lesson page with MDX rendering and progress tracking. |
| `content/trainer/basic-face-notation.mdx` | Authoritative Golden Lesson content. |
| `content/trainer/prime-double-turns.mdx` | Second lesson content fixture. |
| `server/scripts/seed-trainer-v1.js` | Database seed script for Trainer V1 lessons. |
| `client/scripts/test-mdx-pipeline.js` | Automated 33-test validation suite. |
