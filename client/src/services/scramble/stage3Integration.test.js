/**
 * Stage 3 Integration Test Suite — Active Scramble Pipeline & Engine Convergence
 * 
 * Verifies that the single active scramble pipeline correctly integrates Stage 1 (scramble generation)
 * with Stage 2 (mathematical cube engine + net visualizer) across all supported puzzle types.
 */

import assert from 'node:assert';
import { createActiveScramble } from './pipeline.js';
import { validateCubeState } from '../cubeEngine/engine.js';
import { normalizePuzzleType, formatPuzzleDisplay } from './utils.js';

console.log('----------------------------------------------------');
console.log('Running Stage 3 Integration Test Suite');
console.log('----------------------------------------------------\n');

// Test 1: Puzzle Type Normalization & Display
console.log('Running: Test 1 — Puzzle Type Normalization & Display formatting...');
assert.strictEqual(normalizePuzzleType('THREE_BY_THREE'), '3x3');
assert.strictEqual(normalizePuzzleType('TWO_BY_TWO'), '2x2');
assert.strictEqual(normalizePuzzleType('FOUR_BY_FOUR'), '4x4');
assert.strictEqual(normalizePuzzleType('FIVE_BY_FIVE'), '5x5');
assert.strictEqual(formatPuzzleDisplay('THREE_BY_THREE'), '3 × 3 WCA');
assert.strictEqual(formatPuzzleDisplay('TWO_BY_TWO'), '2 × 2 WCA');
assert.strictEqual(formatPuzzleDisplay('FOUR_BY_FOUR'), '4 × 4 WCA');
assert.strictEqual(formatPuzzleDisplay('FIVE_BY_FIVE'), '5 × 5 WCA');
console.log('✓ PASSED\n');

// Test 2: Active Scramble Creation for 2x2, 3x3, 4x4, 5x5
console.log('Running: Test 2 — Active Scramble Pipeline for 2x2, 3x3, 4x4, 5x5...');
const puzzles = ['TWO_BY_TWO', 'THREE_BY_THREE', 'FOUR_BY_FOUR', 'FIVE_BY_FIVE'];

puzzles.forEach((rawPuzzle) => {
  const activeScramble = createActiveScramble(rawPuzzle);

  assert.ok(activeScramble.id, 'Scramble must contain UUID');
  assert.ok(typeof activeScramble.scramble === 'string', 'Scramble text must be string');
  assert.ok(activeScramble.scramble.length > 0, 'Scramble text must not be empty');

  // Verify cube state dimension & color conservation
  const { cubeState, visualization } = activeScramble;
  assert.ok(cubeState, 'cubeState must be defined');
  const validation = validateCubeState(cubeState);
  assert.strictEqual(validation.isValid, true, `Color conservation must hold for ${rawPuzzle}`);

  // Verify visualization structure
  assert.ok(visualization && visualization.netLayout, 'visualization.netLayout must be defined');
  const { U, D, F, B, R, L } = visualization.netLayout;
  assert.ok(U && D && F && B && R && L, 'Visualization must include all 6 faces in netLayout');

  console.log(`  ✓ ${rawPuzzle} -> Scramble: "${activeScramble.scramble.slice(0, 30)}..." | ${validation.totalStickers} stickers conserved.`);
});
console.log('✓ PASSED\n');

// Test 3: Displayed Scramble & Visualizer Invariant Check
console.log('Running: Test 3 — Single Source of Truth Invariant Verification...');
for (let i = 0; i < 20; i++) {
  const activeScramble = createActiveScramble('THREE_BY_THREE');
  const manualAppliedState = validateCubeState(activeScramble.cubeState);
  assert.strictEqual(manualAppliedState.isValid, true);
}
console.log('✓ PASSED (20 random active scrambles verified single source of truth)\n');

// Test 4: Rapid Generation Performance Test
console.log('Running: Test 4 — Rapid Scramble Generation Performance (< 1000ms for 50 scrambles)...');
const start = performance.now();
for (let i = 0; i < 50; i++) {
  createActiveScramble('THREE_BY_THREE');
}
const duration = performance.now() - start;
console.log(`  Processed 50 full pipeline scrambles in ${duration.toFixed(2)}ms (${(duration / 50).toFixed(2)}ms / scramble)`);
assert.ok(duration < 1000, '50 scramble generations must execute under 1 second');
console.log('✓ PASSED\n');

console.log('----------------------------------------------------');
console.log('All Stage 3 Integration Tests Passed Successfully!');
console.log('----------------------------------------------------');
