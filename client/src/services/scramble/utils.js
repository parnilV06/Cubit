/**
 * Cubit Scramble Utilities
 * 
 * General helper functions for unique identifier generation, string parsing,
 * and puzzle type normalization.
 */

/**
 * Generates a cryptographically secure or math-random fallback UUID v4.
 * 
 * @returns {string} A standard UUID v4 string.
 */
export function generateUUID() {
  // Try modern Web Crypto API first
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  // Fallback RFC4122 v4 compliant generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Standardizes scramble string formatting.
 * 
 * @param {string} rawScramble - The raw scramble string.
 * @returns {string} The trimmed and normalized scramble string.
 */
export function normalizeScrambleString(rawScramble) {
  if (!rawScramble || typeof rawScramble !== 'string') {
    return '';
  }
  return rawScramble.trim().replace(/\s+/g, ' ');
}

/**
 * Normalizes any puzzle type representation (Prisma enum, short code, display string)
 * into canonical Scramble/CubeEngine puzzle type ('2x2', '3x3', '4x4', '5x5').
 * 
 * @param {string | number} rawType 
 * @returns {'2x2' | '3x3' | '4x4' | '5x5'}
 */
export function normalizePuzzleType(rawType) {
  if (!rawType) return '3x3';
  const str = String(rawType).trim().toUpperCase();

  if (str === 'TWO_BY_TWO' || str === '2X2' || str === '2' || str.includes('2')) return '2x2';
  if (str === 'THREE_BY_THREE' || str === '3X3' || str === '3' || str.includes('3')) return '3x3';
  if (str === 'FOUR_BY_FOUR' || str === '4X4' || str === '4' || str.includes('4')) return '4x4';
  if (str === 'FIVE_BY_FIVE' || str === '5X5' || str === '5' || str.includes('5')) return '5x5';

  return '3x3';
}

/**
 * Formats a puzzle type for UI display (e.g. "3 × 3 WCA").
 * 
 * @param {string | number} rawType 
 * @returns {string}
 */
export function formatPuzzleDisplay(rawType) {
  const norm = normalizePuzzleType(rawType);
  switch (norm) {
    case '2x2': return '2 × 2 WCA';
    case '3x3': return '3 × 3 WCA';
    case '4x4': return '4 × 4 WCA';
    case '5x5': return '5 × 5 WCA';
    default: return '3 × 3 WCA';
  }
}
