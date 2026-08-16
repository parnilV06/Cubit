/**
 * Cubit Cube Engine Stage 2 — Comprehensive Deterministic & Physical Correctness Test Suite
 * 
 * Category A — Invariant & Group Algebraic Tests (M * M^-1, M^4, scramble * inverse, color conservation)
 * Category B — Physical Correctness Tests (Golden 12 quarter turns, double turns, multi-moves, 
 *              unique sticker debug permutations, user regression scramble, and 100-scramble cross-validation oracle)
 * 
 * Run using: node src/services/cubeEngine/cubeEngine.test.js
 */

import assert from 'assert';
import cstimer from 'cstimer_module';
import {
  createSolvedCube,
  turnLayer,
  applyMove,
  applyScramble,
  validateCubeState,
  getCenterStickers,
} from './engine.js';
import {
  createMatrix,
  rotateClockwise,
  rotateCounterClockwise,
  rotate180,
} from './matrix.js';
import { parseMoveToken, parseScramble } from './parser.js';
import { mapCubeStateToNetData } from './visualizer/mapper.js';
import { STICKER_COLORS, CANONICAL_FACES } from './constants.js';

// ANSI colors for clean CLI output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

let passedTests = 0;
let totalTests = 0;

function test(description, fn) {
  totalTests++;
  console.log(`\n${BOLD}Running:${RESET} ${description}...`);
  try {
    fn();
    console.log(`${GREEN}✓ PASSED${RESET}`);
    passedTests++;
  } catch (error) {
    console.error(`${RED}✗ FAILED${RESET}`);
    console.error(error);
  }
}

// ====================================================
// INDEPENDENT WCA 54-STICKER REFERENCE ORACLE
// ====================================================
function createWcaReferenceOracle() {
  const U = 0, D = 9, F = 18, B = 27, L = 36, R = 45;
  
  let state = new Array(54);
  for (let i = 0; i < 9; i++) state[U + i] = STICKER_COLORS.WHITE;
  for (let i = 0; i < 9; i++) state[D + i] = STICKER_COLORS.YELLOW;
  for (let i = 0; i < 9; i++) state[F + i] = STICKER_COLORS.GREEN;
  for (let i = 0; i < 9; i++) state[B + i] = STICKER_COLORS.BLUE;
  for (let i = 0; i < 9; i++) state[L + i] = STICKER_COLORS.ORANGE;
  for (let i = 0; i < 9; i++) state[R + i] = STICKER_COLORS.RED;

  function permute(cycles) {
    const next = [...state];
    for (const cycle of cycles) {
      const lastVal = state[cycle[cycle.length - 1]];
      for (let i = cycle.length - 1; i > 0; i--) {
        next[cycle[i]] = state[cycle[i - 1]];
      }
      next[cycle[0]] = lastVal;
    }
    state = next;
  }

  const p = (...arr) => arr.map(x => x - 1);

  // Canonical physical WCA facelet permutation cycles
  const MOVES = {
    U: [p(1,3,9,7), p(2,6,8,4), p(46,19,37,28), p(47,20,38,29), p(48,21,39,30)],
    D: [p(10,12,18,16), p(11,15,17,13), p(52,34,43,25), p(53,35,44,26), p(54,36,45,27)],
    R: [p(46,48,54,52), p(47,51,53,49), p(3,34,12,21), p(6,31,15,24), p(9,28,18,27)],
    L: [p(37,39,45,43), p(38,42,44,40), p(1,19,10,36), p(4,22,13,33), p(7,25,16,30)],
    F: [p(19,21,27,25), p(20,24,26,22), p(7,46,12,45), p(8,49,11,42), p(9,52,10,39)],
    B: [p(28,30,36,34), p(29,33,35,31), p(3,37,16,54), p(2,40,17,51), p(1,43,18,48)],
  };

  return {
    applyScramble(scrambleStr) {
      const tokens = scrambleStr.trim().split(/\s+/).filter(Boolean);
      for (const tok of tokens) {
        const face = tok[0];
        const mod = tok.slice(1);
        let count = 1;
        if (mod === "'") count = 3;
        if (mod === '2') count = 2;
        for (let i = 0; i < count; i++) {
          permute(MOVES[face]);
        }
      }
    },
    getMatrices() {
      const getFaceMat = (offset) => [
        [state[offset + 0], state[offset + 1], state[offset + 2]],
        [state[offset + 3], state[offset + 4], state[offset + 5]],
        [state[offset + 6], state[offset + 7], state[offset + 8]],
      ];
      return {
        U: getFaceMat(U),
        D: getFaceMat(D),
        F: getFaceMat(F),
        B: getFaceMat(B),
        L: getFaceMat(L),
        R: getFaceMat(R),
      };
    }
  };
}


// ====================================================
// CATEGORY A — ALGEBRAIC & INVARIANT TESTS
// ====================================================

test('Group 1: Matrix utilities (rotateClockwise, rotateCounterClockwise, rotate180)', () => {
  const input = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  assert.deepStrictEqual(rotateClockwise(input), [
    [7, 4, 1],
    [8, 5, 2],
    [9, 6, 3],
  ]);

  assert.deepStrictEqual(rotateCounterClockwise(input), [
    [3, 6, 9],
    [2, 5, 8],
    [1, 4, 7],
  ]);

  assert.deepStrictEqual(rotate180(input), [
    [9, 8, 7],
    [6, 5, 4],
    [3, 2, 1],
  ]);
});

test('Group 2: Scramble parser tokenization', () => {
  assert.deepStrictEqual(parseMoveToken('R'), { raw: 'R', face: 'R', amount: 1, depth: 1, isWide: false });
  assert.deepStrictEqual(parseMoveToken("U'"), { raw: "U'", face: 'U', amount: -1, depth: 1, isWide: false });
  assert.deepStrictEqual(parseMoveToken('F2'), { raw: 'F2', face: 'F', amount: 2, depth: 1, isWide: false });
  assert.deepStrictEqual(parseMoveToken('Rw'), { raw: 'Rw', face: 'R', amount: 1, depth: 2, isWide: true });
  assert.deepStrictEqual(parseMoveToken("Fw'"), { raw: "Fw'", face: 'F', amount: -1, depth: 2, isWide: true });
  assert.deepStrictEqual(parseMoveToken('3Fw2'), { raw: '3Fw2', face: 'F', amount: 2, depth: 3, isWide: true });

  const parsed = parseScramble("R U2 F' Rw2");
  assert.strictEqual(parsed.length, 4);
  assert.throws(() => parseMoveToken('INVALID_TOKEN'));
});

test('Group 3: Solved Cube Initialization', () => {
  const solved3 = createSolvedCube('3x3');
  assert.strictEqual(solved3.U[0][0], STICKER_COLORS.WHITE);
  assert.strictEqual(solved3.D[0][0], STICKER_COLORS.YELLOW);
  assert.strictEqual(solved3.F[0][0], STICKER_COLORS.GREEN);
  assert.strictEqual(solved3.B[0][0], STICKER_COLORS.BLUE);
  assert.strictEqual(solved3.R[0][0], STICKER_COLORS.RED);
  assert.strictEqual(solved3.L[0][0], STICKER_COLORS.ORANGE);
  assert.strictEqual(validateCubeState(solved3).isValid, true);
});

test('Group 4: Four Quarter Turns Invariant (M^4 = Identity)', () => {
  ['2x2', '3x3', '4x4', '5x5'].forEach((puzzle) => {
    ['U', 'D', 'F', 'B', 'R', 'L'].forEach((face) => {
      let cube = createSolvedCube(puzzle);
      const solvedJson = JSON.stringify(cube);

      for (let i = 0; i < 4; i++) {
        cube = applyMove(cube, { face, amount: 1, depth: 1 });
      }
      assert.strictEqual(JSON.stringify(cube), solvedJson);
    });
  });
});

test('Group 5: Move + Inverse Invariant (M * M^-1 = Identity)', () => {
  ['2x2', '3x3', '4x4', '5x5'].forEach((puzzle) => {
    ['U', 'D', 'F', 'B', 'R', 'L'].forEach((face) => {
      let cube = createSolvedCube(puzzle);
      const solvedJson = JSON.stringify(cube);

      cube = applyMove(cube, { face, amount: 1, depth: 1 });
      cube = applyMove(cube, { face, amount: -1, depth: 1 });
      assert.strictEqual(JSON.stringify(cube), solvedJson);

      if (puzzle === '4x4' || puzzle === '5x5') {
        cube = applyMove(cube, { face, amount: 1, depth: 2 });
        cube = applyMove(cube, { face, amount: -1, depth: 2 });
        assert.strictEqual(JSON.stringify(cube), solvedJson);
      }
    });
  });
});

test('Group 6: Color Conservation Invariant', () => {
  ['2x2', '3x3', '4x4', '5x5'].forEach((puzzle) => {
    let cube = createSolvedCube(puzzle);
    cube = applyScramble("R U2 F' L D2 R2 B2 U L2 F2 D R2", puzzle);
    const val = validateCubeState(cube);
    assert.strictEqual(val.isValid, true);
  });
});

test('Group 7: Fixed Centers Stability (3x3, 5x5)', () => {
  const centersBefore = getCenterStickers(createSolvedCube('3x3'));
  const cube3 = applyScramble("R U F' L D B R2 U2", '3x3');
  const centersAfter = getCenterStickers(cube3);
  assert.deepStrictEqual(centersAfter, centersBefore);
});


// ====================================================
// CATEGORY B — PHYSICAL CORRECTNESS TESTS
// ====================================================

test('Physical Test 1 — All 12 Single Quarter Turns (R, R\', L, L\', U, U\', D, D\', F, F\', B, B\')', () => {
  const moves = ['R', "R'", 'L', "L'", 'U', "U'", 'D', "D'", 'F', "F'", 'B', "B'"];
  
  for (const moveStr of moves) {
    const cubitState = applyScramble(moveStr, '3x3');
    
    const oracle = createWcaReferenceOracle();
    oracle.applyScramble(moveStr);
    const expectedState = oracle.getMatrices();

    for (const f of ['U', 'D', 'F', 'B', 'L', 'R']) {
      assert.deepStrictEqual(
        cubitState[f],
        expectedState[f],
        `Physical move ${moveStr} failed on face ${f}`
      );
    }
  }
});

test('Physical Test 2 — Double Turns (R2, L2, U2, D2, F2, B2)', () => {
  const moves = ['R2', 'L2', 'U2', 'D2', 'F2', 'B2'];
  
  for (const moveStr of moves) {
    const cubitState = applyScramble(moveStr, '3x3');
    
    const oracle = createWcaReferenceOracle();
    oracle.applyScramble(moveStr);
    const expectedState = oracle.getMatrices();

    for (const f of ['U', 'D', 'F', 'B', 'L', 'R']) {
      assert.deepStrictEqual(
        cubitState[f],
        expectedState[f],
        `Double turn ${moveStr} failed on face ${f}`
      );
    }
  }
});

test('Physical Test 3 — Multi-Move Combinations (R U, R U R\', F R, U R U\', R U R\' U\')', () => {
  const combinations = ['R U', 'R U R\'', 'F R', 'U R U\'', 'R U R\' U\''];

  for (const seq of combinations) {
    const cubitState = applyScramble(seq, '3x3');

    const oracle = createWcaReferenceOracle();
    oracle.applyScramble(seq);
    const expectedState = oracle.getMatrices();

    for (const f of ['U', 'D', 'F', 'B', 'L', 'R']) {
      assert.deepStrictEqual(
        cubitState[f],
        expectedState[f],
        `Multi-move sequence "${seq}" failed on face ${f}`
      );
    }
  }
});

test('Physical Test 4 — Unique Sticker Permutations Debug Cube', () => {
  // Verifies sticker movements using unique cell labels U00..B22
  const uniqueCube = { dimension: 3 };
  ['U', 'D', 'F', 'B', 'R', 'L'].forEach((f) => {
    uniqueCube[f] = createMatrix(3, (r, c) => `${f}${r}${c}`);
  });

  // Apply R turn
  const afterR = turnLayer(uniqueCube, 'R', 0);
  
  // Hardcoded physical sticker destination check for R turn
  assert.strictEqual(afterR.U[0][2], 'F02');
  assert.strictEqual(afterR.U[1][2], 'F12');
  assert.strictEqual(afterR.U[2][2], 'F22');

  assert.strictEqual(afterR.B[0][0], 'U22');
  assert.strictEqual(afterR.B[1][0], 'U12');
  assert.strictEqual(afterR.B[2][0], 'U02');

  assert.strictEqual(afterR.D[0][2], 'B20');
  assert.strictEqual(afterR.D[1][2], 'B10');
  assert.strictEqual(afterR.D[2][2], 'B00');

  assert.strictEqual(afterR.F[0][2], 'D02');
  assert.strictEqual(afterR.F[1][2], 'D12');
  assert.strictEqual(afterR.F[2][2], 'D22');
});

test('Physical Test 5 — User Regression Scramble State Verification', () => {
  const regressionScramble = "F L R D R U2 F' B' R D2 F' B' R2 U B2 U' R D R2 L F";
  
  const cubitState = applyScramble(regressionScramble, '3x3');
  
  const oracle = createWcaReferenceOracle();
  oracle.applyScramble(regressionScramble);
  const oracleState = oracle.getMatrices();

  for (const f of ['U', 'D', 'F', 'B', 'L', 'R']) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        assert.strictEqual(
          cubitState[f][r][c],
          oracleState[f][r][c],
          `Regression scramble mismatch at Face ${f} [${r}][${c}]`
        );
      }
    }
  }
});

test('Physical Test 6 — Cross-Implementation Validation (100 Random csTimer 3x3 Scrambles)', () => {
  for (let run = 1; run <= 100; run++) {
    const rawScramble = cstimer.getScramble('333', 0).trim();
    
    const cubitState = applyScramble(rawScramble, '3x3');

    const oracle = createWcaReferenceOracle();
    oracle.applyScramble(rawScramble);
    const oracleState = oracle.getMatrices();

    for (const f of ['U', 'D', 'F', 'B', 'L', 'R']) {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          assert.strictEqual(
            cubitState[f][r][c],
            oracleState[f][r][c],
            `Cross-validation failed on scramble #${run} ("${rawScramble}") at Face ${f} [${r}][${c}]`
          );
        }
      }
    }
  }
});

test('Group 8: 2D Visualizer Net Mapper Contract', () => {
  const solved = createSolvedCube('3x3');
  const netData = mapCubeStateToNetData(solved);

  assert.strictEqual(netData.dimension, 3);
  assert.strictEqual(netData.netLayout.U[0][0].colorKey, STICKER_COLORS.WHITE);
  assert.strictEqual(netData.netLayout.U[0][0].hexColor, '#F8FAFC');
  assert.strictEqual(netData.netLayout.F[0][0].colorKey, STICKER_COLORS.GREEN);
  assert.strictEqual(netData.netLayout.F[0][0].hexColor, '#22C55E');
});

// ====================================================
// CATEGORY C — TRAINER V1 NOTATION & EXTENSION TESTS
// ====================================================

test('Group 9: Trainer V1 Parser Extension (Rotations & Slices)', () => {
  // Rotations
  assert.deepStrictEqual(parseMoveToken('x'), { raw: 'x', type: 'rotation', axis: 'x', amount: 1 });
  assert.deepStrictEqual(parseMoveToken("x'"), { raw: "x'", type: 'rotation', axis: 'x', amount: -1 });
  assert.deepStrictEqual(parseMoveToken('x2'), { raw: 'x2', type: 'rotation', axis: 'x', amount: 2 });
  assert.deepStrictEqual(parseMoveToken('y'), { raw: 'y', type: 'rotation', axis: 'y', amount: 1 });
  assert.deepStrictEqual(parseMoveToken("y'"), { raw: "y'", type: 'rotation', axis: 'y', amount: -1 });
  assert.deepStrictEqual(parseMoveToken('y2'), { raw: 'y2', type: 'rotation', axis: 'y', amount: 2 });
  assert.deepStrictEqual(parseMoveToken('z'), { raw: 'z', type: 'rotation', axis: 'z', amount: 1 });
  assert.deepStrictEqual(parseMoveToken("z'"), { raw: "z'", type: 'rotation', axis: 'z', amount: -1 });
  assert.deepStrictEqual(parseMoveToken('z2'), { raw: 'z2', type: 'rotation', axis: 'z', amount: 2 });

  // Slices
  assert.deepStrictEqual(parseMoveToken('M'), { raw: 'M', type: 'slice', slice: 'M', amount: 1 });
  assert.deepStrictEqual(parseMoveToken("M'"), { raw: "M'", type: 'slice', slice: 'M', amount: -1 });
  assert.deepStrictEqual(parseMoveToken('M2'), { raw: 'M2', type: 'slice', slice: 'M', amount: 2 });
  assert.deepStrictEqual(parseMoveToken('E'), { raw: 'E', type: 'slice', slice: 'E', amount: 1 });
  assert.deepStrictEqual(parseMoveToken("E'"), { raw: "E'", type: 'slice', slice: 'E', amount: -1 });
  assert.deepStrictEqual(parseMoveToken('E2'), { raw: 'E2', type: 'slice', slice: 'E', amount: 2 });
  assert.deepStrictEqual(parseMoveToken('S'), { raw: 'S', type: 'slice', slice: 'S', amount: 1 });
  assert.deepStrictEqual(parseMoveToken("S'"), { raw: "S'", type: 'slice', slice: 'S', amount: -1 });
  assert.deepStrictEqual(parseMoveToken('S2'), { raw: 'S2', type: 'slice', slice: 'S', amount: 2 });

  // Mixed Algorithm Parsing
  const parsed = parseScramble("R U R' U' x M2 U M2 U2 M2 U M2 y'");
  assert.strictEqual(parsed.length, 13);
  assert.strictEqual(parsed[4].type, 'rotation');
  assert.strictEqual(parsed[4].axis, 'x');
  assert.strictEqual(parsed[5].type, 'slice');
  assert.strictEqual(parsed[5].slice, 'M');
  assert.strictEqual(parsed[12].type, 'rotation');
  assert.strictEqual(parsed[12].axis, 'y');
  assert.strictEqual(parsed[12].amount, -1);

  // Invalid Token Error Handling
  assert.throws(() => parseMoveToken('3x')); // prefix not allowed on rotation
  assert.throws(() => parseMoveToken('Mw')); // wide not allowed on slice
  assert.throws(() => parseMoveToken('INVALID_TOKEN'));
});

test('Group 10: Whole-Cube Rotations Invariants (x4, y4, z4 = Identity & Inverses)', () => {
  ['2x2', '3x3', '4x4', '5x5'].forEach((puzzle) => {
    ['x', 'y', 'z'].forEach((axis) => {
      const solved = createSolvedCube(puzzle);
      const solvedJson = JSON.stringify(solved);

      // Four quarter rotations = Identity
      let cube = solved;
      for (let i = 0; i < 4; i++) {
        cube = applyMove(cube, { type: 'rotation', axis, amount: 1 });
      }
      assert.strictEqual(JSON.stringify(cube), solvedJson, `${puzzle} ${axis}^4 should equal identity`);

      // Rotation + Inverse = Identity
      cube = applyMove(solved, { type: 'rotation', axis, amount: 1 });
      cube = applyMove(cube, { type: 'rotation', axis, amount: -1 });
      assert.strictEqual(JSON.stringify(cube), solvedJson, `${puzzle} ${axis} * ${axis}' should equal identity`);

      // Double rotation twice = Identity
      cube = applyMove(solved, { type: 'rotation', axis, amount: 2 });
      cube = applyMove(cube, { type: 'rotation', axis, amount: 2 });
      assert.strictEqual(JSON.stringify(cube), solvedJson, `${puzzle} ${axis}2 * ${axis}2 should equal identity`);
    });
  });
});

test('Group 11: 3x3 Slice Moves Invariants (M4, E4, S4 = Identity & Inverses)', () => {
  ['M', 'E', 'S'].forEach((slice) => {
    const solved = createSolvedCube('3x3');
    const solvedJson = JSON.stringify(solved);

    // Four quarter slices = Identity
    let cube = solved;
    for (let i = 0; i < 4; i++) {
      cube = applyMove(cube, { type: 'slice', slice, amount: 1 });
    }
    assert.strictEqual(JSON.stringify(cube), solvedJson, `3x3 ${slice}^4 should equal identity`);

    // Slice + Inverse = Identity
    cube = applyMove(solved, { type: 'slice', slice, amount: 1 });
    cube = applyMove(cube, { type: 'slice', slice, amount: -1 });
    assert.strictEqual(JSON.stringify(cube), solvedJson, `3x3 ${slice} * ${slice}' should equal identity`);

    // Double slice twice = Identity
    cube = applyMove(solved, { type: 'slice', slice, amount: 2 });
    cube = applyMove(cube, { type: 'slice', slice, amount: 2 });
    assert.strictEqual(JSON.stringify(cube), solvedJson, `3x3 ${slice}2 * ${slice}2 should equal identity`);
  });

  // Slice move on non-3x3 cube must throw clear descriptive error
  const cube2 = createSolvedCube('2x2');
  assert.throws(() => applyMove(cube2, { type: 'slice', slice: 'M', amount: 1 }));
  const cube4 = createSolvedCube('4x4');
  assert.throws(() => applyMove(cube4, { type: 'slice', slice: 'E', amount: 1 }));
});

test('Group 12: Physical Correctness for Whole-Cube Rotations (x, y, z)', () => {
  // Create unique labeled debug cube U00..B22
  function makeUniqueCube() {
    const cube = { dimension: 3 };
    ['U', 'D', 'F', 'B', 'R', 'L'].forEach((f) => {
      cube[f] = createMatrix(3, (r, c) => `${f}${r}${c}`);
    });
    return cube;
  }

  // --- Verify 'x' rotation (rotates around +X axis in R direction) ---
  // Looking at R face: F goes to U, U goes to B, B goes to D, D goes to F.
  // R face rotates clockwise, L face rotates counter-clockwise.
  const afterX = applyMove(makeUniqueCube(), 'x');

  // R face rotated clockwise: (r, c) -> (c, 2-r)
  assert.strictEqual(afterX.R[0][0], 'R20');
  assert.strictEqual(afterX.R[0][2], 'R00');
  assert.strictEqual(afterX.R[2][2], 'R02');
  assert.strictEqual(afterX.R[1][1], 'R11');

  // L face rotated counter-clockwise: (r, c) -> (2-c, r)
  assert.strictEqual(afterX.L[0][0], 'L02');
  assert.strictEqual(afterX.L[0][2], 'L22');
  assert.strictEqual(afterX.L[2][2], 'L20');
  assert.strictEqual(afterX.L[1][1], 'L11');

  // F moved to U:
  assert.strictEqual(afterX.U[0][0], 'F00');
  assert.strictEqual(afterX.U[1][1], 'F11');
  assert.strictEqual(afterX.U[2][2], 'F22');

  // U moved to B (inverted in row & col due to back face orientation):
  assert.strictEqual(afterX.B[1][1], 'U11');
  assert.strictEqual(afterX.B[0][0], 'U22');
  assert.strictEqual(afterX.B[2][2], 'U00');

  // B moved to D:
  assert.strictEqual(afterX.D[1][1], 'B11');
  assert.strictEqual(afterX.D[0][0], 'B22');
  assert.strictEqual(afterX.D[2][2], 'B00');

  // D moved to F:
  assert.strictEqual(afterX.F[1][1], 'D11');
  assert.strictEqual(afterX.F[0][0], 'D00');
  assert.strictEqual(afterX.F[2][2], 'D22');

  // --- Verify 'y' rotation (rotates around +Y axis in U direction) ---
  // Looking at U face: F goes to L, L goes to B, B goes to R, R goes to F.
  // U face rotates clockwise, D face rotates counter-clockwise.
  const afterY = applyMove(makeUniqueCube(), 'y');

  // U face rotated clockwise:
  assert.strictEqual(afterY.U[0][0], 'U20');
  assert.strictEqual(afterY.U[0][2], 'U00');
  assert.strictEqual(afterY.U[2][2], 'U02');
  assert.strictEqual(afterY.U[1][1], 'U11');

  // D face rotated counter-clockwise:
  assert.strictEqual(afterY.D[0][0], 'D02');
  assert.strictEqual(afterY.D[0][2], 'D22');
  assert.strictEqual(afterY.D[2][2], 'D20');
  assert.strictEqual(afterY.D[1][1], 'D11');

  // Centers moved according to y: R -> F -> L -> B -> R
  assert.strictEqual(afterY.F[1][1], 'R11');
  assert.strictEqual(afterY.L[1][1], 'F11');
  assert.strictEqual(afterY.B[1][1], 'L11');
  assert.strictEqual(afterY.R[1][1], 'B11');

  // --- Verify 'z' rotation (rotates around +Z axis in F direction) ---
  // Looking at F face: U goes to R, R goes to D, D goes to L, L goes to U.
  // F face rotates clockwise, B face rotates counter-clockwise.
  const afterZ = applyMove(makeUniqueCube(), 'z');

  assert.strictEqual(afterZ.F[1][1], 'F11');
  assert.strictEqual(afterZ.F[0][0], 'F20');
  assert.strictEqual(afterZ.B[1][1], 'B11');
  assert.strictEqual(afterZ.B[0][0], 'B02');

  assert.strictEqual(afterZ.R[1][1], 'U11');
  assert.strictEqual(afterZ.D[1][1], 'R11');
  assert.strictEqual(afterZ.L[1][1], 'D11');
  assert.strictEqual(afterZ.U[1][1], 'L11');
});

test('Group 13: Physical Correctness for Slice Moves (M, E, S)', () => {
  function makeUniqueCube() {
    const cube = { dimension: 3 };
    ['U', 'D', 'F', 'B', 'R', 'L'].forEach((f) => {
      cube[f] = createMatrix(3, (r, c) => `${f}${r}${c}`);
    });
    return cube;
  }

  // --- Verify 'M' slice (follows L direction) ---
  // R and L outer faces MUST be completely untouched!
  // Corners MUST be completely untouched!
  const afterM = applyMove(makeUniqueCube(), 'M');

  // R and L unchanged
  assert.strictEqual(afterM.R[0][0], 'R00');
  assert.strictEqual(afterM.R[1][1], 'R11');
  assert.strictEqual(afterM.L[0][0], 'L00');
  assert.strictEqual(afterM.L[1][1], 'L11');

  // Corners on U, D, F, B unchanged
  assert.strictEqual(afterM.U[0][0], 'U00');
  assert.strictEqual(afterM.U[0][2], 'U02');
  assert.strictEqual(afterM.F[0][0], 'F00');
  assert.strictEqual(afterM.F[2][2], 'F22');

  // M slice centers permute: U -> F -> D -> B -> U
  assert.strictEqual(afterM.F[1][1], 'U11'); // Top goes to front
  assert.strictEqual(afterM.D[1][1], 'F11'); // Front goes to bottom
  assert.strictEqual(afterM.B[1][1], 'D11'); // Bottom goes to back
  assert.strictEqual(afterM.U[1][1], 'B11'); // Back goes to top

  // --- Verify 'E' slice (follows D direction) ---
  // U and D outer faces MUST be completely untouched!
  const afterE = applyMove(makeUniqueCube(), 'E');

  assert.strictEqual(afterE.U[0][0], 'U00');
  assert.strictEqual(afterE.U[1][1], 'U11');
  assert.strictEqual(afterE.D[0][0], 'D00');
  assert.strictEqual(afterE.D[1][1], 'D11');

  // E slice centers permute: F -> R -> B -> L -> F
  assert.strictEqual(afterE.R[1][1], 'F11');
  assert.strictEqual(afterE.B[1][1], 'R11');
  assert.strictEqual(afterE.L[1][1], 'B11');
  assert.strictEqual(afterE.F[1][1], 'L11');

  // --- Verify 'S' slice (follows F direction) ---
  // F and B outer faces MUST be completely untouched!
  const afterS = applyMove(makeUniqueCube(), 'S');

  assert.strictEqual(afterS.F[0][0], 'F00');
  assert.strictEqual(afterS.F[1][1], 'F11');
  assert.strictEqual(afterS.B[0][0], 'B00');
  assert.strictEqual(afterS.B[1][1], 'B11');

  // S slice centers permute: U -> R -> D -> L -> U
  assert.strictEqual(afterS.R[1][1], 'U11');
  assert.strictEqual(afterS.D[1][1], 'R11');
  assert.strictEqual(afterS.L[1][1], 'D11');
  assert.strictEqual(afterS.U[1][1], 'L11');
});

test('Group 14: Algorithm Mathematical Equivalences (x = R M\' L\', y = U E\' D\', z = F S B\')', () => {
  // Test x == R M' L'
  const stateX = applyScramble('x', '3x3');
  const stateRML = applyScramble("R M' L'", '3x3');
  assert.strictEqual(JSON.stringify(stateX), JSON.stringify(stateRML), "x should match R M' L'");

  // Test y == U E' D'
  const stateY = applyScramble('y', '3x3');
  const stateUED = applyScramble("U E' D'", '3x3');
  assert.strictEqual(JSON.stringify(stateY), JSON.stringify(stateUED), "y should match U E' D'");

  // Test z == F S B'
  const stateZ = applyScramble('z', '3x3');
  const stateFSB = applyScramble("F S B'", '3x3');
  assert.strictEqual(JSON.stringify(stateZ), JSON.stringify(stateFSB), "z should match F S B'");
});

test('Group 15: Speedcubing Algorithms Cyclic Invariants', () => {
  const solved = createSolvedCube('3x3');
  const solvedJson = JSON.stringify(solved);

  // 1. Sexy Move x 6 = Identity
  let sexyCube = solved;
  for (let i = 0; i < 6; i++) {
    sexyCube = applyScramble("R U R' U'", sexyCube);
  }
  assert.strictEqual(JSON.stringify(sexyCube), solvedJson, 'Sexy move (R U R\' U\') applied 6 times must restore solved state');

  // 2. H-Permutation x 2 = Identity
  const hPerm = 'M2 U M2 U2 M2 U M2';
  let hCube = applyScramble(hPerm, '3x3');
  // Confirm center colors are still conserved
  assert.strictEqual(validateCubeState(hCube).isValid, true);
  // Apply second time to return to solved
  hCube = applyScramble(hPerm, hCube);
  assert.strictEqual(JSON.stringify(hCube), solvedJson, 'H-Perm (M2 U M2 U2 M2 U M2) applied 2 times must restore solved state');

  // 3. T-Permutation x 2 = Identity
  const tPerm = "R U R' U' R' F R2 U' R' U' R U R' F'";
  let tCube = applyScramble(tPerm, '3x3');
  assert.strictEqual(validateCubeState(tCube).isValid, true);
  tCube = applyScramble(tPerm, tCube);
  assert.strictEqual(JSON.stringify(tCube), solvedJson, 'T-Perm applied 2 times must restore solved state');

  // 4. Sune + Anti-Sune = Identity
  const sune = "R U R' U R U2 R'";
  const antiSune = "R U2 R' U' R U' R'";
  const suneCombo = applyScramble(`${sune} ${antiSune}`, '3x3');
  assert.strictEqual(JSON.stringify(suneCombo), solvedJson, 'Sune followed by Anti-Sune must restore solved state');
});

// Final Summary
console.log(`\n${BOLD}Test Summary:${RESET} Passed ${passedTests}/${totalTests} tests.`);
if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log(`${GREEN}${BOLD}All Cube Engine tests (Category A, B & C) passed successfully!${RESET}\n`);
}

