/**
 * Cubit Scramble Generator Service - Test Suite
 * 
 * Verifies scramble generation correctness, contract validation, uniqueness,
 * and recovery from edge cases/errors (unsupported types, library crash).
 * 
 * Run using: node src/services/scramble/scramble.test.js
 */

import assert from 'assert';
import { generateScramble, SUPPORTED_PUZZLES } from './index.js';
import { isValidScrambleObject } from './types.js';
import cstimer from 'cstimer_module';

// ANSI colors for beautiful terminal output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

let passedTests = 0;
let totalTests = 0;

/**
 * Declares and executes a single test case block.
 * @param {string} description - The name of the test.
 * @param {function} fn - The test body assertion callback.
 */
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

// ----------------------------------------------------
// TEST 1: Check generation and contracts for all puzzles
// ----------------------------------------------------
test('Generate scrambles for all WCA supported puzzle types (2x2, 3x3, 4x4, 5x5)', () => {
  const types = Object.values(SUPPORTED_PUZZLES);
  
  for (const type of types) {
    const obj = generateScramble(type);
    
    // 1. Verify object structure conforms to the ScrambleObject contract
    assert.strictEqual(isValidScrambleObject(obj), true, `ScrambleObject contract validation failed for ${type}`);
    assert.ok(obj.id && typeof obj.id === 'string', 'Should possess a unique ID string');
    assert.strictEqual(obj.puzzleType, type, 'puzzleType must match request');
    assert.ok(obj.scramble && typeof obj.scramble === 'string', 'scramble must be a non-empty string');
    assert.ok(obj.timestamp && typeof obj.timestamp === 'number', 'timestamp must be a number');
    assert.strictEqual(obj.cubeState, null, 'cubeState should default to null (Stage 2 hook)');
    assert.strictEqual(obj.visualization, null, 'visualization should default to null (Stage 2 hook)');
    assert.strictEqual(obj.metadata.generator, 'cstimer_module', 'generator source should be cstimer_module');
    
    console.log(`  [${type}] Generated scramble: ${obj.scramble}`);
  }
});

// ----------------------------------------------------
// TEST 2: Check consecutive scramble uniqueness
// ----------------------------------------------------
test('Verify multiple consecutive generations produce different valid scrambles', () => {
  const count = 15;
  const scrambles = new Set();
  
  for (let i = 0; i < count; i++) {
    const obj = generateScramble(SUPPORTED_PUZZLES.THREE_BY_THREE);
    scrambles.add(obj.scramble);
  }
  
  // A WCA random-state generator should never produce the exact same scramble consecutively
  assert.strictEqual(scrambles.size, count, `Generated ${count} scrambles, but only ${scrambles.size} were unique.`);
});

// ----------------------------------------------------
// TEST 3: Check unsupported puzzle graceful recovery
// ----------------------------------------------------
test('Verify invalid/unsupported puzzle types are handled gracefully', () => {
  // Intercept console.warn to verify warning is triggered
  const originalWarn = console.warn;
  let warnCalled = false;
  console.warn = (...args) => {
    warnCalled = true;
    originalWarn(...args);
  };

  try {
    const obj = generateScramble('unsupported_megaminx');
    
    assert.strictEqual(warnCalled, true, 'Should warn about invalid puzzle type request');
    assert.strictEqual(isValidScrambleObject(obj), true, 'Returned object should still match ScrambleObject contract');
    assert.strictEqual(obj.puzzleType, SUPPORTED_PUZZLES.THREE_BY_THREE, 'Should fall back to default 3x3');
    assert.strictEqual(obj.metadata.generator, 'local_fallback_unsupported', 'generator metadata should note the unsupported fallback');
    
    console.log(`  [Fallback] Generated fallback: ${obj.scramble}`);
  } finally {
    console.warn = originalWarn;
  }
});

// ----------------------------------------------------
// TEST 4: Check csTimer failure / error handling fallback
// ----------------------------------------------------
test('Verify csTimer library failures are handled gracefully without crashing', () => {
  const originalGetScramble = cstimer.getScramble;
  const originalWarn = console.warn;
  let warnCalled = false;
  console.warn = (...args) => {
    warnCalled = true;
    originalWarn(...args);
  };

  // Mock csTimer library failure by throwing an error inside getScramble
  cstimer.getScramble = () => {
    throw new Error('Fatal: csTimer WASM/Internal module loading failed.');
  };

  try {
    const obj = generateScramble(SUPPORTED_PUZZLES.FOUR_BY_FOUR);
    
    assert.strictEqual(warnCalled, true, 'Should log a warning about library failure');
    assert.strictEqual(isValidScrambleObject(obj), true, 'Fallback object must still be a valid ScrambleObject');
    assert.strictEqual(obj.puzzleType, SUPPORTED_PUZZLES.FOUR_BY_FOUR, 'Should preserve requested puzzleType');
    assert.strictEqual(obj.metadata.generator, 'local_fallback_error', 'generator metadata should note error fallback');
    assert.ok(obj.scramble.length > 10, 'Fallback scramble should be generated and look like a proper 4x4 scramble');
    
    console.log(`  [Library Failure Fallback] Generated: ${obj.scramble}`);
  } finally {
    // Restore original state
    cstimer.getScramble = originalGetScramble;
    console.warn = originalWarn;
  }
});

// ----------------------------------------------------
// TEST SUMMARY & RESULT
// ----------------------------------------------------
console.log(`\n${BOLD}Test Summary:${RESET} Passed ${passedTests}/${totalTests} tests.`);
if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log(`${GREEN}${BOLD}All tests passed successfully!${RESET}\n`);
}
