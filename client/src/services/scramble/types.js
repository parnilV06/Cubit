/**
 * Cubit Scramble Types and JSDoc Definitions
 * 
 * Provides type contracts and validation functions for use across the application,
 * laying the architectural contract for Stage 2 (Cube Engine) and Stage 3 (Timer UI).
 */

import { SUPPORTED_PUZZLES } from './constants.js';

/**
 * @typedef {Object} ScrambleObject
 * @property {string} id - A unique identifier (UUID v4) for tracking and persisting solves.
 * @property {string} puzzleType - The public puzzle type identifier ('2x2', '3x3', '4x4', '5x5').
 * @property {string} scramble - The raw WCA-compliant scramble string.
 * @property {number} timestamp - The UNIX epoch timestamp (in milliseconds) of generation.
 * @property {Object|null} [cubeState] - Placeholder for the puzzle's internal state (to be implemented in Stage 2).
 * @property {Object|null} [visualization] - Placeholder for SVG/canvas rendering configurations (to be implemented in Stage 2).
 * @property {Object} [metadata] - Extensible bag for execution parameters, seeds, or validation info.
 */

/**
 * Validates if the puzzle type is supported by Cubit.
 * 
 * @param {string} puzzleType - The puzzle type to validate.
 * @returns {boolean} True if the puzzle type is supported, false otherwise.
 */
export function isValidPuzzleType(puzzleType) {
  return Object.values(SUPPORTED_PUZZLES).includes(puzzleType);
}

/**
 * Validates if an object conforms to the ScrambleObject type contract.
 * 
 * @param {any} obj - The object to validate.
 * @returns {boolean} True if the object is a valid ScrambleObject, false otherwise.
 */
export function isValidScrambleObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  return (
    typeof obj.id === 'string' &&
    isValidPuzzleType(obj.puzzleType) &&
    typeof obj.scramble === 'string' &&
    typeof obj.timestamp === 'number'
  );
}
