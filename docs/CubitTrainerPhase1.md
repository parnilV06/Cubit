# Cubit Trainer V1 — Phase 1: Cube Engine Extensions & Interactive UI Components
**Document Version:** 1.0.0  
**Status:** Complete & Validated  
**Module Scope:** `client/src/services/cubeEngine/` & `client/src/components/trainer/cube/`

---

## 1. Executive Summary

Phase 1 of Cubit Trainer V1 enhances the existing deterministic cube mathematics engine (`cubeEngine`) to support complete speedcubing notation required by beginner and intermediate tutorials (whole-cube rotations `x, y, z` and middle slice turns `M, E, S`) while introducing a suite of reusable, zero-dependency interactive React components (`<CubeViewer />`, `<AlgorithmPlayer />`, `<NotationTrainer />`).

All extensions were implemented adhering strictly to the **REUSE > EXTEND > ADD** architectural hierarchy, preserving 100% backward compatibility with all WCA puzzle dimensions (2x2, 3x3, 4x4, 5x5) and existing timer/scramble subsystems.

---

## 2. Cube Engine Mathematical Extensions

### 2.1 Notation & Parser Support (`parser.js`)
The parser recognizes three distinct, mutually disjoint move token categories:

| Category | Tokens / Regex | Output Structure | Notes |
| :--- | :--- | :--- | :--- |
| **Face & Wide Turns** | `[UDRLFBudrlfb]w?['2]?` | `{ raw, face, amount, depth, isWide }` | Supports standard WCA single/multi-layer turns across 2x2–5x5. |
| **Rotations** | `[xyzXYZ]['2]?` | `{ raw, type: 'rotation', axis, amount }` | Whole-cube spatial reorientation along $X$, $Y$, or $Z$ axes. |
| **Slice Turns** | `[MESmes]['2]?` | `{ raw, type: 'slice', slice, amount }` | Internal layer turns strictly validated for 3x3 puzzles. |

### 2.2 Mathematical Transformation Semantics (`engine.js`)

#### 1. Whole-Cube Rotations (`x, y, z`)
Whole-cube rotations are executed as simultaneous rigid-body spatial transformations across all $N$ layers ($k = 0 \dots N-1$):
- **`x` Rotation:** Rotates the entire cube around the $+X$ axis in the direction of the **`R` (Right)** face.
  $$\vec{p}(x, y, z) \mapsto (x, z, -y)$$
  - Front ($F$) moves to Up ($U$), Up ($U$) moves to Back ($B$), Back ($B$) moves to Down ($D$), Down ($D$) moves to Front ($F$).
  - $R$ face rotates $90^\circ$ clockwise; $L$ face rotates $90^\circ$ counter-clockwise.
- **`y` Rotation:** Rotates the entire cube around the $+Y$ axis in the direction of the **`U` (Up)** face.
  $$\vec{p}(x, y, z) \mapsto (-z, y, x)$$
  - Right ($R$) moves to Front ($F$), Front ($F$) moves to Left ($L$), Left ($L$) moves to Back ($B$), Back ($B$) moves to Right ($R$).
  - $U$ face rotates $90^\circ$ clockwise; $D$ face rotates $90^\circ$ counter-clockwise.
- **`z` Rotation:** Rotates the entire cube around the $+Z$ axis in the direction of the **`F` (Front)** face.
  $$\vec{p}(x, y, z) \mapsto (y, -x, z)$$
  - Up ($U$) moves to Right ($R$), Right ($R$) moves to Down ($D$), Down ($D$) moves to Left ($L$), Left ($L$) moves to Up ($U$).
  - $F$ face rotates $90^\circ$ clockwise; $B$ face rotates $90^\circ$ counter-clockwise.

#### 2. Slice Turns (`M, E, S`)
Slice turns apply to the middle layer ($k=1$) of 3x3 puzzles:
- **`M` (Middle Slice):** Layer between $L$ and $R$. Follows the **`L` (Left)** face turn direction ($+X$ axis):
  $$M \iff \text{turnLayer}(cubeState, 'L', 1)$$
  - Centers permute: $U \to F \to D \to B \to U$. Outer $R$ and $L$ faces and all 8 corners remain unchanged.
- **`E` (Equator Slice):** Layer between $U$ and $D$. Follows the **`D` (Down)** face turn direction ($-Y$ axis):
  $$E \iff \text{turnLayer}(cubeState, 'D', 1)$$
  - Centers permute: $F \to R \to B \to L \to F$. Outer $U$ and $D$ faces remain unchanged.
- **`S` (Standing Slice):** Layer between $F$ and $B$. Follows the **`F` (Front)** face turn direction ($+Z$ axis):
  $$S \iff \text{turnLayer}(cubeState, 'F', 1)$$
  - Centers permute: $U \to R \to D \to L \to U$. Outer $F$ and $B$ faces remain unchanged.

#### 3. Mathematical Equivalences Verified
Speedcubing slice-to-face identity equivalences validated by unit tests:
$$x \equiv R \cdot M' \cdot L'$$
$$y \equiv U \cdot E' \cdot D'$$
$$z \equiv F \cdot S \cdot B'$$

---

## 3. Reusable Interactive Cube Infrastructure

Three modular, decoupled React components have been authored in `client/src/components/trainer/cube/`:

### 3.1 `<CubeViewer />`
**File:** `client/src/components/trainer/cube/CubeViewer.jsx`  
**Purpose:** Reusable viewer displaying a deterministic 2D net cube state with status badge and optional reset.

#### Component Props:
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `dimension` | `string \| number` | `'3x3'` | Cube size (`'2x2'`, `'3x3'`, `'4x4'`, `'5x5'`). |
| `cubeState` | `Object` | `undefined` | Optional pre-computed cube state object. |
| `scramble` | `string` | `''` | Scramble sequence to apply to solved state. |
| `moves` | `string` | `''` | Move sequence to apply on top of `initialState`. |
| `initialState`| `Object` | `undefined` | Starting cube state. |
| `title` | `string` | `undefined` | Card header title. |
| `description`| `string` | `undefined` | Card subtitle or note. |
| `showNet` | `boolean` | `true` | Whether to render the 2D unfolded net. |
| `showReset` | `boolean` | `false` | Shows interactive reset button. |
| `showStatus`| `boolean` | `true` | Displays color conservation validation badge. |
| `maxContainerWidth` | `number` | `280` | Headroom width limit for sticker grid calculation. |
| `onStateChange` | `function` | `undefined` | Callback `(state) => void` when state updates. |

---

### 3.2 `<AlgorithmPlayer />`
**File:** `client/src/components/trainer/cube/AlgorithmPlayer.jsx`  
**Purpose:** Interactive algorithm visualizer featuring play/pause, step forward/backward, speed controls, jump-to-step tokens, and keyboard navigation.

#### Component Props:
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `algorithm` | `string` (required) | `''` | Space-separated algorithm (e.g. `"R U R' U' x M2"`). |
| `dimension` | `string \| number` | `'3x3'` | Cube size. |
| `initialState`| `Object` | `undefined` | Base cube state prior to step 0. |
| `initialScramble` | `string` | `''` | Optional scramble applied prior to step 0. |
| `autoPlay` | `boolean` | `false` | Automatically begin playing on mount. |
| `playbackSpeed` | `number` | `1.0` | Playback speed (`0.5x`, `1.0x`, `1.5x`, `2.0x`). |
| `title` | `string` | `undefined` | Card header title. |
| `description`| `string` | `undefined` | Subtitle description. |
| `showNotation`| `boolean` | `true` | Renders interactive step token pills strip. |
| `showSpeedControl` | `boolean` | `true` | Renders speed selector buttons. |
| `showStepButtons` | `boolean` | `true` | Renders step backward & forward buttons. |
| `onComplete` | `function` | `undefined` | Callback `() => void` triggered when reaching the final move. |
| `onStepChange` | `function` | `undefined` | Callback `(stepIndex, totalSteps, moveToken) => void`. |

#### State & Performance Model:
- **Instant Precomputation:** Precalculates all state snapshots $[S_0, S_1, \dots, S_K]$ on initialization ($<0.1\text{ms}$ execution time).
- **$O(1)$ Navigation:** Stepping forward, backward, or jumping to any arbitrary move token is instantaneous and mathematically pure without accumulated state drift.
- **Keyboard Controls:** `Space` (Play/Pause), `ArrowRight` (Step Next), `ArrowLeft` (Step Previous), `R` (Reset).

---

### 3.3 `<NotationTrainer />`
**File:** `client/src/components/trainer/cube/NotationTrainer.jsx`  
**Purpose:** Interactive notation practice pad enabling learners to execute moves in real time, view move history, undo turns, and copy generated sequences.

#### Component Props:
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `moves` | `Array<string> \| 'basic' \| 'rotations' \| 'slices' \| 'all'` | `'basic'` | Set of interactive buttons to display. |
| `dimension` | `string \| number` | `'3x3'` | Cube dimension. |
| `initialState`| `Object` | `undefined` | Base state. |
| `initialScramble` | `string` | `''` | Initial scramble applied before user input. |
| `title` | `string` | `'Notation Practice'` | Header title. |
| `description`| `string` | `undefined` | Subtitle description. |
| `showHistory`| `boolean` | `true` | Renders move history sequence and undo controls. |
| `maxHistory` | `number` | `30` | Maximum history stack depth. |
| `allowReset` | `boolean` | `true` | Renders reset button. |
| `onMoveExecute` | `function` | `undefined` | Callback `(token, newState, moveHistory) => void`. |

---

## 4. Verification & Invariant Testing Summary

The test suite in `client/src/services/cubeEngine/cubeEngine.test.js` was expanded from 14 to 21 comprehensive test groups:

```text
Running: Group 1: Matrix utilities (rotateClockwise, rotateCounterClockwise, rotate180)... ✓ PASSED
Running: Group 2: Scramble parser tokenization... ✓ PASSED
Running: Group 3: Solved Cube Initialization... ✓ PASSED
Running: Group 4: Four Quarter Turns Invariant (M^4 = Identity)... ✓ PASSED
Running: Group 5: Move + Inverse Invariant (M * M^-1 = Identity)... ✓ PASSED
Running: Group 6: Color Conservation Invariant... ✓ PASSED
Running: Group 7: Fixed Centers Stability (3x3, 5x5)... ✓ PASSED
Running: Physical Test 1 — All 12 Single Quarter Turns... ✓ PASSED
Running: Physical Test 2 — Double Turns (R2, L2, U2, D2, F2, B2)... ✓ PASSED
Running: Physical Test 3 — Multi-Move Combinations... ✓ PASSED
Running: Physical Test 4 — Unique Sticker Permutations Debug Cube... ✓ PASSED
Running: Physical Test 5 — User Regression Scramble State Verification... ✓ PASSED
Running: Physical Test 6 — Cross-Implementation Validation (100 Random csTimer 3x3 Scrambles)... ✓ PASSED
Running: Group 8: 2D Visualizer Net Mapper Contract... ✓ PASSED
Running: Group 9: Trainer V1 Parser Extension (Rotations & Slices)... ✓ PASSED
Running: Group 10: Whole-Cube Rotations Invariants (x4, y4, z4 = Identity & Inverses across 2x2-5x5)... ✓ PASSED
Running: Group 11: 3x3 Slice Moves Invariants (M4, E4, S4 = Identity & Inverses)... ✓ PASSED
Running: Group 12: Physical Correctness for Whole-Cube Rotations (x, y, z)... ✓ PASSED
Running: Group 13: Physical Correctness for Slice Moves (M, E, S)... ✓ PASSED
Running: Group 14: Algorithm Mathematical Equivalences (x = R M' L', y = U E' D', z = F S B')... ✓ PASSED
Running: Group 15: Speedcubing Algorithms Cyclic Invariants ((Sexy)^6=I, (H-Perm)^2=I, (T-Perm)^2=I, Sune+AntiSune=I)... ✓ PASSED

Test Summary: Passed 21/21 tests (100% success).
```

---

## 5. Phase 2 Readiness

Phase 1 provides all foundational math and interactive UI primitives needed for:
1. **Phase 2:** MDX lesson rendering pipeline and custom interactive component mapping.
2. **Phase 3:** Authoring the complete 46-lesson Trainer curriculum with embedded `<CubeViewer />`, `<AlgorithmPlayer />`, and `<NotationTrainer />` interactive blocks.
