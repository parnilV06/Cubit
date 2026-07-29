/**
 * Cubit Scramble Generator Service - Generator Implementation
 * 
 * Interacts directly with cstimer_module to generate random-state/WCA-compliant scrambles.
 * Features a smart local fallback algorithm to ensure high availability and prevent crashes.
 * 
 * Architectural Note:
 * This is the ONLY file in the entire application that imports or depends on `cstimer_module`.
 * If we need to swap out csTimer for TNoodle or a custom backend, only this file requires edits.
 */

import cstimer from 'cstimer_module';
import {
  SUPPORTED_PUZZLES,
  DEFAULT_PUZZLE,
  CSTIMER_PUZZLE_MAPPINGS,
  FALLBACK_MOVES,
  FALLBACK_LENGTHS,
} from './constants.js';
import { generateUUID, normalizeScrambleString } from './utils.js';
import { isValidPuzzleType } from './types.js';

/**
 * Generates a pseudo-random scramble locally as a fallback mechanism.
 * Adheres to base move tables per puzzle type and avoids repeating faces consecutively.
 * 
 * @param {string} puzzleType - Normalized puzzle type ('2x2', '3x3', '4x4', '5x5').
 * @returns {string} A valid looking puzzle scramble string.
 */
export function generateLocalFallback(puzzleType) {
  const resolvedType = isValidPuzzleType(puzzleType) ? puzzleType : DEFAULT_PUZZLE;
  const moves = FALLBACK_MOVES[resolvedType];
  const length = FALLBACK_LENGTHS[resolvedType];
  const modifiers = ['', "'", '2'];
  
  const scrambleMoves = [];
  let lastFace = null;
  
  for (let i = 0; i < length; i++) {
    // Exclude the face of the previous move to prevent trivial cancellations (like R R')
    let availableMoves = moves;
    if (lastFace) {
      availableMoves = moves.filter(move => move[0] !== lastFace[0]);
    }
    
    // Pick a random move and modifier
    const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    
    scrambleMoves.push(`${move}${modifier}`);
    lastFace = move;
  }
  
  return scrambleMoves.join(' ');
}

/**
 * Generates a scramble object for the specified puzzle type.
 * Single entry point for WCA scramble generation in Cubit.
 * 
 * @param {string} [puzzleType='3x3'] - The type of puzzle (e.g. '2x2', '3x3', '4x4', '5x5').
 * @returns {import('./types.js').ScrambleObject} The structured scramble object.
 */
export function generateScramble(puzzleType = DEFAULT_PUZZLE) {
  let resolvedPuzzleType = puzzleType;
  let isUnsupported = false;
  let warningMessage = null;

  // Validate request
  if (!isValidPuzzleType(resolvedPuzzleType)) {
    warningMessage = `Unsupported puzzle type "${puzzleType}" requested. Falling back to default "${DEFAULT_PUZZLE}".`;
    console.warn(warningMessage);
    resolvedPuzzleType = DEFAULT_PUZZLE;
    isUnsupported = true;
  }

  const mapping = CSTIMER_PUZZLE_MAPPINGS[resolvedPuzzleType];
  let scrambleString = '';
  let generatorSource = 'cstimer_module';

  if (isUnsupported) {
    scrambleString = generateLocalFallback(resolvedPuzzleType);
    generatorSource = 'local_fallback_unsupported';
  } else {
    try {
      // Direct call to csTimer module
      const rawScramble = cstimer.getScramble(mapping.code, mapping.length);
      scrambleString = normalizeScrambleString(rawScramble);
      
      if (!scrambleString) {
        throw new Error('Received an empty scramble from csTimer library.');
      }
    } catch (error) {
      warningMessage = `csTimer generation failed for "${resolvedPuzzleType}": ${error.message}. Falling back to local generator.`;
      console.warn(warningMessage);
      scrambleString = generateLocalFallback(resolvedPuzzleType);
      generatorSource = 'local_fallback_error';
    }
  }

  // Construct the returned structured ScrambleObject contract
  return {
    id: generateUUID(),
    puzzleType: resolvedPuzzleType,
    scramble: scrambleString,
    timestamp: Date.now(),
    cubeState: null, // Reserved for Stage 2 (Cube Engine state logic)
    visualization: null, // Reserved for Stage 2 (SVG/Renderer data)
    metadata: {
      generator: generatorSource,
      generatedAt: new Date().toISOString(),
      ...(warningMessage ? { warning: warningMessage } : {})
    }
  };
}
