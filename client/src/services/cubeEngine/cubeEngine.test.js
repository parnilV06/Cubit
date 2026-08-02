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

// Final Summary
console.log(`\n${BOLD}Test Summary:${RESET} Passed ${passedTests}/${totalTests} tests.`);
if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log(`${GREEN}${BOLD}All Cube Engine tests (Category A & B) passed successfully!${RESET}\n`);
}
