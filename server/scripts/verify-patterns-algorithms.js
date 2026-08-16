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
console.log('🧪 VERIFYING MODULE 06 ALGORITHMS & PATTERNS VIA CUBE ENGINE');
console.log('======================================================\n');

const patternsToTest = [
  {
    name: 'Sexy Move (1x)',
    alg: "R U R' U'",
    testCycle: 6, // 6 reps returns to solved
  },
  {
    name: 'Sledgehammer (1x)',
    alg: "R' F R F'",
    testCycle: 6, // 6 reps returns to solved
    inverse: "F R' F' R", // Hedgeslammer restores 1 Sledgehammer
  },
  {
    name: 'Checkerboard',
    alg: 'R2 L2 U2 D2 F2 B2',
    isSelfInverse: true,
  },
  {
    name: 'Snake / Anaconda',
    alg: "L U B' U' R L' B R' F B' D R D' F'",
    inverse: "F D R' D' B F' R B' L R' U B U' L'",
  },
  {
    name: 'Cube in a Cube',
    alg: "F L F U' R U F2 L2 U' L' B D' B' L2 U",
    inverse: "U' L2 B D B' L U L2 F2 U' R' U F' L' F'",
  },
  {
    name: 'Six Spots (Center Swap)',
    alg: "U D' R L' F B' U D'",
    inverse: "D U' B F' L R' D U'",
  },
  {
    name: 'Cross Pattern / Wire',
    alg: "R L U D' F B' R L",
    inverse: "L' R' B F' D U' L' R'",
  },
  {
    name: 'Stripes / Vertical Lines',
    alg: "F U F R L2 B D' R D2 L D' B R2 L F U F",
    inverse: "F' U' F' L' R2 B' D L' D2 R' D B' L2 R' F' U' F'",
  },
  {
    name: 'Superflip (20 moves)',
    alg: "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2",
    isSelfInverse: true,
  }
];

let failed = 0;

for (const p of patternsToTest) {
  try {
    const moves = parseScramble(p.alg);
    if (!moves || moves.length === 0) {
      console.error(`❌ [${p.name}] Failed to parse moves for: "${p.alg}"`);
      failed++;
      continue;
    }

    // Apply algorithm from solved cube
    let state = applyScramble(p.alg, '3x3');
    const validState = validateCubeState(state);
    if (!validState.isValid) {
      console.error(`❌ [${p.name}] Broke valid cube state invariant!`);
      failed++;
      continue;
    }

    // Test cycle if defined
    if (p.testCycle) {
      let cycleState = createSolvedCube('3x3');
      for (let i = 0; i < p.testCycle; i++) {
        cycleState = applyScramble(p.alg, cycleState);
      }
      if (!isSolved(cycleState)) {
        console.error(`❌ [${p.name}] Expected ${p.testCycle} cycles to return to solved, but cube was not solved!`);
        failed++;
        continue;
      } else {
        console.log(`✅ [${p.name}] Verified (${moves.length} moves, cyclic order = ${p.testCycle})`);
      }
    }

    // Test self-inverse if defined
    if (p.isSelfInverse) {
      let selfInvState = applyScramble(p.alg, state);
      if (!isSolved(selfInvState)) {
        console.error(`❌ [${p.name}] Self-inverse test failed!`);
        failed++;
        continue;
      } else {
        console.log(`✅ [${p.name}] Verified (${moves.length} moves, Self-Inverse: Verified)`);
      }
    }

    // Test separate inverse if defined
    if (p.inverse) {
      const invMoves = parseScramble(p.inverse);
      if (!invMoves || invMoves.length === 0) {
        console.error(`❌ [${p.name}] Failed to parse inverse moves: "${p.inverse}"`);
        failed++;
        continue;
      }
      let restoredState = applyScramble(p.inverse, state);
      if (!isSolved(restoredState)) {
        console.error(`❌ [${p.name}] Inverse restoration failed to reach solved state!`);
        failed++;
        continue;
      } else {
        console.log(`✅ [${p.name}] Verified (${moves.length} moves, Inverse Restoration: Verified)`);
      }
    }
  } catch (err) {
    console.error(`❌ [${p.name}] Threw exception:`, err.message);
    failed++;
  }
}

console.log('\n======================================================');
console.log(`📊 RESULTS: ${patternsToTest.length - failed}/${patternsToTest.length} Patterns & Restorations Validated. Failures: ${failed}`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
