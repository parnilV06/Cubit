/**
 * Cubit Scramble Generator Service - Public API Entrypoint
 * 
 * Provides the public interface for WCA-compliant scramble generation and Stage 3 pipeline.
 * All components and services in the Cubit application must import from this file.
 */

export { generateScramble } from './generator.js';
export { SUPPORTED_PUZZLES } from './constants.js';
export { isValidPuzzleType, isValidScrambleObject } from './types.js';
export { generateUUID, normalizeScrambleString, normalizePuzzleType, formatPuzzleDisplay } from './utils.js';
export { createActiveScramble } from './pipeline.js';
