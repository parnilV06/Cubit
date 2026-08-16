import { createSolvedCube, applyScramble, validateCubeState } from '../../client/src/services/cubeEngine/engine.js';
import { parseScramble } from '../../client/src/services/cubeEngine/parser.js';
import { CANONICAL_FACES } from '../../client/src/services/cubeEngine/constants.js';

function isSolved(state) {
  for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
    const expected = CANONICAL_FACES[face];
    for (let r = 0; r < state.dimension; r++) {
      for (let c = 0; c < state.dimension; c++) {
        if (state[face][r][c] !== expected) return false;
      }
    }
  }
  return true;
}

console.log('======================================================');
console.log('🧪 VERIFYING MODULE 06 (SOLVING OTHER CUBES) ALGORITHMS');
console.log('======================================================\n');

const ALGORITHMS_TO_TEST = [
  // 2x2 Algorithms
  {
    puzzle: '2x2',
    name: '2x2 Sexy Move (Order 6)',
    alg: "R U R' U'",
    cycleCount: 6,
  },
  {
    puzzle: '2x2',
    name: '2x2 Sune (Order 6)',
    alg: "R U R' U R U2 R'",
    cycleCount: 6,
  },
  {
    puzzle: '2x2',
    name: '2x2 Anti-Sune',
    alg: "R U2 R' U' R U' R'",
    inverse: "R U R' U R U2 R'", // Sune reverses Anti-Sune (with U AUF)
  },
  {
    puzzle: '2x2',
    name: '2x2 T-Perm / Adjacent Swap',
    alg: "R U R' U' R' F R2 U' R' U' R U R' F'",
    cycleCount: 2,
  },
  {
    puzzle: '2x2',
    name: '2x2 Y-Perm / Diagonal Swap',
    alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    cycleCount: 2,
  },

  // 4x4 Algorithms
  {
    puzzle: '4x4',
    name: '4x4 Center Insert Commutator',
    alg: "Rw U Rw' U' Rw U2 Rw'",
    inverse: "Rw U2 Rw' U Rw U' Rw'",
  },
  {
    puzzle: '4x4',
    name: '4x4 Edge Flip Trigger (R U R\' F R\' F\' R)',
    alg: "R U R' F R' F' R",
    inverse: "R' F R F' R U' R'",
  },
  {
    puzzle: '4x4',
    name: '4x4 Slice-Flip-Slice Edge Pairing',
    alg: "Uw' R U R' F R' F' R Uw",
    inverse: "Uw' R' F R F' R U' R' Uw",
  },
  {
    puzzle: '4x4',
    name: '4x4 OLL Parity (Rw2 B2 U2 Lw U2 Rw\' U2 Rw U2 F2 Rw2 F2 Lw\' B2 Rw2)',
    alg: "Rw2 B2 U2 Lw U2 Rw' U2 Rw U2 F2 Rw2 F2 Lw' B2 Rw2",
    inverse: "Rw2 B2 Lw F2 Rw2 F2 U2 Rw' U2 Rw U2 Lw' U2 B2 Rw2",
  },
  {
    puzzle: '4x4',
    name: '4x4 PLL Parity (Uw2 Rw2 U2 r2 U2 Rw2 Uw2 / 2R2 U2 2R2 Uw2 2R2 u2)',
    alg: "Rw2 R2 U2 Rw2 R2 Uw2 Rw2 R2 Uw2",
    cycleCount: 2,
  },

  // 5x5 Algorithms
  {
    puzzle: '5x5',
    name: '5x5 Center 3-layer Depth Turn',
    alg: "3Rw U2 3Rw'",
    inverse: "3Rw U2 3Rw'",
  },
  {
    puzzle: '5x5',
    name: '5x5 Last Two Edges Slice Sequence',
    alg: "Uw' R U R' F R' F' R Uw",
    inverse: "Uw' R' F R F' R U' R' Uw",
  },
];

let passed = 0;
let failed = 0;

for (const test of ALGORITHMS_TO_TEST) {
  try {
    let state = createSolvedCube(test.puzzle);
    const parsed = parseScramble(test.alg);

    if (test.cycleCount) {
      for (let c = 0; c < test.cycleCount; c++) {
        state = applyScramble(test.alg, state);
      }
      if (isSolved(state)) {
        console.log(`✅ [${test.puzzle}] ${test.name} Verified (${parsed.length} moves, cyclic order = ${test.cycleCount})`);
        passed++;
      } else {
        console.error(`❌ [${test.puzzle}] ${test.name} Failed: Expected solved after ${test.cycleCount} cycles`);
        failed++;
      }
    } else if (test.inverse) {
      state = applyScramble(test.alg, state);
      state = applyScramble(test.inverse, state);
      if (isSolved(state)) {
        console.log(`✅ [${test.puzzle}] ${test.name} Verified (Inverse restoration verified)`);
        passed++;
      } else {
        console.error(`❌ [${test.puzzle}] ${test.name} Failed: Inverse did not restore solved cube`);
        failed++;
      }
    }
  } catch (err) {
    console.error(`❌ [${test.puzzle}] ${test.name} Error:`, err.message);
    failed++;
  }
}

console.log('\n======================================================');
console.log(`📊 RESULTS: ${passed}/${passed + failed} Algorithms Validated. Failures: ${failed}`);
console.log('======================================================\n');

if (failed > 0) process.exit(1);
