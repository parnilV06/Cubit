# Cubit V1 — Stage 3 Technical Documentation
## Production Integration of Scramble Generator + Cube Visualizer

---

## 1. Executive Summary

Stage 3 unifies Stage 1 (**WCA Scramble Service** via `cstimer_module`) and Stage 2 (**Custom NxN Cube Engine & 2D Net Renderer**) into Cubit's production Timer screen.

### Single Source of Truth Architecture

```
Active Session
      ↓
Session Puzzle Type (2x2, 3x3, 4x4, 5x5)
      ↓
createActiveScramble(puzzleType)
      ↓
ONE Active Scramble Object
      │
      ├──Displayed Scramble Text (Timer Top Box)
      │
      └──Cube State & Net Visualization (CubeNetRenderer)
```

---

## 2. Active Scramble Pipeline Contract

The active scramble pipeline is encapsulated in `client/src/services/scramble/pipeline.js`:

```js
import { createActiveScramble } from './services/scramble';

const activeScramble = createActiveScramble('THREE_BY_THREE');
```

### Returned Active Scramble Object Structure
```js
{
  id: "uuid-v4-string",
  puzzleType: "3x3",
  rawPuzzleType: "THREE_BY_THREE",
  scramble: "U L2 B U2 B2 U2 F L2 F' R2 D2 R U B2 D U B' L R' U'",
  timestamp: 1785664800000,
  cubeState: {
    dimension: 3,
    U: [...], D: [...], F: [...], B: [...], R: [...], L: [...]
  },
  visualization: {
    dimension: 3,
    netLayout: {
      U: [[{ colorKey, hexColor, face, row, col, id }], ...],
      D: [...], F: [...], B: [...], R: [...], L: [...]
    }
  }
}
```

---

## 3. Scramble Lifecycle Specifications

| Event / Trigger | Triggered Action | Scramble Behavior |
| :--- | :--- | :--- |
| **Initial Timer Load** | Active session loaded from backend | Auto-generates `activeScramble` matching `activeSession.puzzleType` |
| **New Scramble Button** | User clicks "New Scramble" button | Invokes `generateNewScramble()` atomic update |
| **Reset Button** | User clicks "Reset" button | Resets timer to `0.000` (`idle`); **Keeps current scramble & visualizer intact** |
| **Solve Completion (Success)** | Timer stops & solve POST API succeeds | Advances to next scramble **ONLY after successful persistence** |
| **Solve Completion (Failed API)** | Timer stops & solve POST API fails | Displays error message; **Keeps current scramble & visualizer intact** |
| **Session Switching** | User selects a different session | Generates fresh `activeScramble` for newly selected session's puzzle type |
| **Session Creation** | User creates a new session | Generates fresh `activeScramble` for new session's puzzle type |

---

## 4. Normalization & Display Mapping

Cubit normalizes puzzle representations across DB Prisma Enums, Scramble Service shortcodes, and UI display strings:

| DB Enum | Scramble Engine Code | UI Display Format |
| :--- | :--- | :--- |
| `TWO_BY_TWO` | `2x2` | `2 × 2 WCA` |
| `THREE_BY_THREE` | `3x3` | `3 × 3 WCA` |
| `FOUR_BY_FOUR` | `4x4` | `4 × 4 WCA` |
| `FIVE_BY_FIVE` | `5x5` | `5 × 5 WCA` |

---

## 5. UI Component Modifications

1. **`TimerDashboard.jsx`**:
   - Replaced mock local `generateScramble()` function with Zustand store `activeScramble` pipeline.
   - Replaced static PNG image (`cube-2d-net-scramble.png`) with dynamic `<CubeNetRenderer>` component inside the Visualizer secondary feature card.
   - Added `FIVE_BY_FIVE` (`5 × 5 WCA`) option to the Create Session modal.
2. **`StatsBar.jsx` & `layout.css`**:
   - Removed select dropdown arrow affordance for puzzle type in the top bar.
   - Rendered non-editable `<div className="puzzle-capsule">` capsule displaying `3 × 3 WCA`, `2 × 2 WCA`, etc.
