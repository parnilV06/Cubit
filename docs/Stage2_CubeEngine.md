# Cubit V1 — Stage 2 Technical Documentation
## Custom Cube State Engine & 2D Visualizer Specification

---

## 1. Architectural Overview

Stage 2 introduces Cubit's custom, deterministic mathematical cube-state and visualization engine. 

### Key Architectural Principles
- **Zero External Cubing Dependencies**: Cube representation, move mathematics, scramble parsing, state validation, and 2D net rendering are implemented natively in pure JavaScript.
- **Strict Decoupling**: The core mathematical engine (`engine.js`, `matrix.js`, `parser.js`) is completely independent of React, DOM, SVG, or UI dependencies.
- **Immutable State Design**: All state transformations yield new immutable cube-state structures, ensuring pure function behavior and race-condition free UI integration.
- **3D Rigid Body Rotation Math**: Transformations are calculated using a 3D spatial coordinate system $(x, y, z) \in [-1, 1]^3$ mapping face cells to 3D space and applying rigid rotation matrices around face normal vectors.

---

## 2. Canonical Cube Orientation & Color Palette

Cubit adheres to the standard WCA solved cube orientation across all supported $N \times N$ puzzle dimensions ($2 \times 2, 3 \times 3, 4 \times 4, 5 \times 5$).

### Face & Color Mapping
| Face Code | Face Name | Semantic Color Key | UI Hex Code | Orientation Reference |
| :---: | :---: | :---: | :---: | :---: |
| **U** | Upper | `WHITE` | `#F8FAFC` | Top |
| **D** | Down | `YELLOW` | `#FACC15` | Bottom |
| **F** | Front | `GREEN` | `#22C55E` | Front Facing |
| **B** | Back | `BLUE` | `#3B82F6` | Back Facing |
| **R** | Right | `RED` | `#EF4444` | Right Side |
| **L** | Left | `ORANGE` | `#F97316` | Left Side |

---

## 3. Mathematical Matrix & 3D Spatial Representation

Each NxN Rubik's cube state is stored as an object containing six $N \times N$ matrix grids (`U`, `D`, `F`, `B`, `R`, `L`) along with the puzzle dimension $N$.

```js
{
  dimension: 3,
  U: [ ['WHITE', 'WHITE', 'WHITE'], ... ],
  D: [ ['YELLOW', 'YELLOW', 'YELLOW'], ... ],
  F: [ ['GREEN', 'GREEN', 'GREEN'], ... ],
  B: [ ['BLUE', 'BLUE', 'BLUE'], ... ],
  R: [ ['RED', 'RED', 'RED'], ... ],
  L: [ ['ORANGE', 'ORANGE', 'ORANGE'], ... ]
}
```

### 3D Spatial Coordinate Mapping
Matrix cells $(r, c)$ for face $F$ are mapped to 3D space using normalized coordinates:
$$u = -1 + \frac{2c + 1}{N}, \quad v = 1 - \frac{2r + 1}{N}$$

- **U Face** ($y = +1$): $(x, y, z) = (u, 1, -v)$
- **D Face** ($y = -1$): $(x, y, z) = (u, -1, v)$
- **F Face** ($z = +1$): $(x, y, z) = (u, v, 1)$
- **B Face** ($z = -1$): $(x, y, z) = (-u, v, -1)$
- **R Face** ($x = +1$): $(x, y, z) = (1, v, -u)$
- **L Face** ($x = -1$): $(x, y, z) = (-1, v, u)$

### 90° Clockwise Rotation Matrices Around Face Normals
- **U Turn** (rotates around $+y$ axis): $(x, y, z) \to (z, y, -x)$
- **D Turn** (rotates around $-y$ axis): $(x, y, z) \to (-z, y, x)$
- **R Turn** (rotates around $+x$ axis): $(x, y, z) \to (x, z, -y)$
- **L Turn** (rotates around $-x$ axis): $(x, y, z) \to (x, -z, y)$
- **F Turn** (rotates around $+z$ axis): $(x, y, z) \to (-y, x, z)$
- **B Turn** (rotates around $-z$ axis): $(x, y, z) \to (y, -x, z)$

### Layer Turn Logic & Wide Moves
- **Outer Face Turn** (e.g. `R`): turns layer $k = 0$.
- **Wide Turn** (e.g. `Rw` or `2Rw`): turns layers $k = 0 \dots (\text{depth} - 1)$ iteratively.

---

## 4. Scramble Parser Specification

The parser (`parser.js`) converts WCA scramble strings produced by Stage 1 into structured move operation objects:

```js
parseMoveToken("3Fw2") 
// Returns: { raw: "3Fw2", face: "F", amount: 2, depth: 3, isWide: true }
```

### Supported Notation
- **Standard Face Turns**: `U`, `D`, `F`, `B`, `R`, `L`
- **Turn Modifiers**:
  - `""` (no suffix) $\implies$ Clockwise 90° (`amount: 1`)
  - `"'"` (prime suffix) $\implies$ Counter-clockwise 90° (`amount: -1`)
  - `"2"` (double turn suffix) $\implies$ Half turn 180° (`amount: 2`)
- **Wide Moves**: `Rw`, `Uw`, `Fw`, `Lw`, `Dw`, `Bw` or lowercase `r`, `u`, `f`, `l`, `d`, `b` $\implies$ (`depth: 2`)
- **Layer Depth Prefixes**: `3Fw2` $\implies$ (`depth: 3`)

---

## 5. 2D Unfolded Net Renderer Specification

The `CubeNetRenderer` component renders the 2D unfolded cube net conforming to standard cubing net layout:

```
          [ U ]
[ L ]     [ F ]     [ R ]     [ B ]
          [ D ]
```

### Key UI Features
- **Outer Face Boundaries**: Each $N \times N$ face is contained within a distinct Slate box with borders to prevent adjacent stickers from visually merging.
- **Subtle Inner Sticker Borders**: Stickers feature subtle dark inset borders and rounded corners.
- **Dynamic Sizing**: Sticker size is dynamically scaled based on container width and puzzle dimension ($2 \times 2$ to $5 \times 5$), ensuring clean fit within timer cards.

---

## 6. Correctness Verification & Test Suite

The engine is verified by a deterministic unit test suite (`cubeEngine.test.js`):

- **Test A — Solved State**: Validates initial solved matrices.
- **Test B — Four Quarter Turns**: Verifies $(Face)^4 = \text{Identity}$ for all 6 faces on $2 \times 2, 3 \times 3, 4 \times 4, 5 \times 5$.
- **Test C — Move + Inverse**: Verifies $M \cdot M^{-1} = \text{Identity}$ for face and wide turns.
- **Test D — Double Turns**: Verifies $M^2 \cdot M^2 = \text{Identity}$.
- **Test E — Scramble + Inverse Scramble**: Applied 100 random csTimer scrambles across $2 \times 2, 3 \times 3, 4 \times 4, 5 \times 5$; inverted sequence returned 100% back to solved state.
- **Test F — Color Conservation**: Confirms each of the 6 colors appears exactly $N^2$ times after scrambles.
- **Test G — Center Stability**: Confirms odd cube ($3 \times 3, 5 \times 5$) center stickers remain physically fixed.

---

## 7. Stage 3 Integration Guide

In Stage 3, the `ScrambleObject` generated by Stage 1 (`generator.js`) will automatically be enriched by invoking Stage 2:

```js
import { applyScramble, mapCubeStateToNetData } from '../cubeEngine/index.js';

const scrambleObj = generateScramble('3x3');
const cubeState = applyScramble(scrambleObj.scramble, scrambleObj.puzzleType);
const visualization = mapCubeStateToNetData(cubeState);

scrambleObj.cubeState = cubeState;
scrambleObj.visualization = visualization;
```
