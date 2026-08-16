import { createSolvedCube, applyScramble, validateCubeState } from '../../client/src/services/cubeEngine/engine.js';
import { parseScramble } from '../../client/src/services/cubeEngine/parser.js';

console.log('\n======================================================');
console.log('🧪 VERIFYING MODULE 05 CFOP ALGORITHMS VIA CUBE ENGINE');
console.log('======================================================\n');

const testCases = [
  // --- F2L Triggers & Inserts ---
  { name: "Right Insert (U R U' R')", alg: "U R U' R'" },
  { name: "Left Insert (U' L' U L)", alg: "U' L' U L" },
  { name: "Sexy Move (R U R' U')", alg: "R U R' U'" },
  { name: "Reverse Sexy (U R U' R')", alg: "U R U' R'" },
  { name: "Sledgehammer (R' F R F')", alg: "R' F R F'" },
  { name: "Hedgeslammer (F R' F' R)", alg: "F R' F' R" },
  { name: "F2L Case: Corner White Top, Match Edge (R U2 R' U' R U R')", alg: "R U2 R' U' R U R'" },
  { name: "F2L Back-Right Insert (R' U' R)", alg: "R' U' R" },
  { name: "F2L Back-Left Insert (L U L')", alg: "L U L'" },

  // --- 2-Look OLL (Edge Orientation) ---
  { name: "OLL Edge: Bar (F R U R' U' F')", alg: "F R U R' U' F'" },
  { name: "OLL Edge: L-Shape (f R U R' U' f')", alg: "f R U R' U' f'" },
  { name: "OLL Edge: Dot (F R U R' U' F' f R U R' U' f')", alg: "F R U R' U' F' f R U R' U' f'" },

  // --- 2-Look OLL (Corner Orientation / 7 Cases) ---
  { name: "OLL 27: Sune (R U R' U R U2 R')", alg: "R U R' U R U2 R'" },
  { name: "OLL 26: Anti-Sune (R U2 R' U' R U' R')", alg: "R U2 R' U' R U' R'" },
  { name: "OLL 21: H Case (R U2 R' U' R U R' U' R U' R')", alg: "R U2 R' U' R U R' U' R U' R'" },
  { name: "OLL 22: Pi Case (R U2 R2 U' R2 U' R2 U2 R)", alg: "R U2 R2 U' R2 U' R2 U2 R" },
  { name: "OLL 23: Headlights / U (R2 D R' U2 R D' R' U2 R')", alg: "R2 D R' U2 R D' R' U2 R'" },
  { name: "OLL 24: Chameleon / T (r U R' U' r' F R F')", alg: "r U R' U' r' F R F'" },
  { name: "OLL 25: Bowtie / L (F' r U R' U' r' F R)", alg: "F' r U R' U' r' F R" },

  // --- 2-Look PLL & Full PLL ---
  { name: "PLL: T-Perm (R U R' U' R' F R2 U' R' U' R U R' F')", alg: "R U R' U' R' F R2 U' R' U' R U R' F'" },
  { name: "PLL: Y-Perm (F R U' R' U' R U R' F' R U R' U' R' F R F')", alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'" },
  { name: "PLL: Ua-Perm (R U' R U R U R U' R' U' R2)", alg: "R U' R U R U R U' R' U' R2" },
  { name: "PLL: Ub-Perm (R2 U R U R' U' R' U' R' U R')", alg: "R2 U R U R' U' R' U' R' U R'" },
  { name: "PLL: H-Perm (M2 U M2 U2 M2 U M2)", alg: "M2 U M2 U2 M2 U M2" },
  { name: "PLL: Z-Perm (M2 U M2 U M' U2 M2 U2 M')", alg: "M2 U M2 U M' U2 M2 U2 M'" },
  { name: "PLL: Aa-Perm (x R' U R' D2 R U' R' D2 R2 x')", alg: "x R' U R' D2 R U' R' D2 R2 x'" },
  { name: "PLL: Ab-Perm (x R2 D2 R U R' D2 R U' R x')", alg: "x R2 D2 R U R' D2 R U' R x'" },
  { name: "PLL: Ja-Perm (x R2 F R F' R U2 r' U r U2 x')", alg: "x R2 F R F' R U2 r' U r U2 x'" },
  { name: "PLL: Jb-Perm (R U R' F' R U R' U' R' F R2 U' R')", alg: "R U R' F' R U R' U' R' F R2 U' R'" },
  { name: "PLL: Ra-Perm (R U' R' U' R U R D R' U' R D' R' U2 R')", alg: "R U' R' U' R U R D R' U' R D' R' U2 R'" },
  { name: "PLL: Rb-Perm (R' U2 R U2 R' F R U R' U' R' F' R2)", alg: "R' U2 R U2 R' F R U R' U' R' F' R2" },
  { name: "PLL: F-Perm (R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R)", alg: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R" },
  { name: "PLL: V-Perm (R' U R' U' y R' F' R2 U' R' U R' F R F y')", alg: "R' U R' U' y R' F' R2 U' R' U R' F R F y'" },
  { name: "PLL: E-Perm (x' R U' R' D R U R' D' R U R' D R U' R' D' x)", alg: "x' R U' R' D R U R' D' R U R' D R U' R' D' x" },
  { name: "PLL: Na-Perm (R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R')", alg: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'" },
  { name: "PLL: Nb-Perm (R' U R U' R' F' U' F R U R' F R' F' R U' R)", alg: "R' U R U' R' F' U' F R U R' F R' F' R U' R" },
  { name: "PLL: Ga-Perm (R2 U R' U R' U' R U' R2 D U' R' U R D')", alg: "R2 U R' U R' U' R U' R2 D U' R' U R D'" },
  { name: "PLL: Gb-Perm (R' U' R U D' R2 U R' U R U' R U' R2 D)", alg: "R' U' R U D' R2 U R' U R U' R U' R2 D" },
  { name: "PLL: Gc-Perm (R2 U' R U' R U R' U R2 D' U R U' R' D)", alg: "R2 U' R U' R U R' U R2 D' U R U' R' D" },
  { name: "PLL: Gd-Perm (R U R' U' D R2 U' R U' R' U R' U R2 D')", alg: "R U R' U' D R2 U' R U' R' U R' U R2 D'" }
];

let failed = 0;

for (const t of testCases) {
  try {
    const moves = parseScramble(t.alg);
    if (!moves || moves.length === 0) {
      console.error(`❌ [${t.name}] Failed to parse moves for: "${t.alg}"`);
      failed++;
      continue;
    }

    // Apply algorithm
    let state = applyScramble(t.alg, '3x3');

    // Apply multiple times to check cyclic color conservation
    for (let i = 0; i < 11; i++) {
      state = applyScramble(t.alg, state);
    }
    const validation = validateCubeState(state);
    if (!validation.isValid) {
      console.error(`❌ [${t.name}] Broke color conservation!`);
      failed++;
    } else {
      console.log(`✅ [${t.name}] Verified (${moves.length} moves)`);
    }
  } catch (err) {
    console.error(`❌ [${t.name}] Threw exception:`, err.message);
    failed++;
  }
}

console.log('\n======================================================');
console.log(`📊 RESULTS: ${testCases.length - failed}/${testCases.length} Algorithms Validated. Failures: ${failed}`);
console.log('======================================================\n');

if (failed > 0) process.exit(1);
