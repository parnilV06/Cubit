/**
 * Cubit Scramble Utilities
 * 
 * General helper functions for unique identifier generation and string parsing.
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
