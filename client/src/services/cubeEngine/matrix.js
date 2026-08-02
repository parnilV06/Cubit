/**
 * Cubit Cube Engine — Matrix Transformation Utilities
 * 
 * Provides pure matrix transformations for NxN grids.
 * Works for any dimension N >= 1.
 */

/**
 * Creates an N x N matrix initialized with a given value or generator function.
 * 
 * @param {number} n - Matrix size (N x N)
 * @param {any | ((row: number, col: number) => any)} [fillValue=null] - Value or function to populate matrix
 * @returns {any[][]} N x N matrix
 */
export function createMatrix(n, fillValue = null) {
  if (n <= 0 || !Number.isInteger(n)) {
    throw new Error(`Invalid matrix dimension: ${n}`);
  }
  const isFn = typeof fillValue === 'function';
  return Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => (isFn ? fillValue(r, c) : fillValue))
  );
}

/**
 * Rotates an N x N matrix 90 degrees clockwise.
 * 
 * @param {any[][]} matrix - N x N matrix
 * @returns {any[][]} A new rotated matrix
 */
export function rotateClockwise(matrix) {
  const n = matrix.length;
  const result = createMatrix(n);
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      result[c][n - 1 - r] = matrix[r][c];
    }
  }
  return result;
}

/**
 * Rotates an N x N matrix 90 degrees counter-clockwise.
 * Equivalent to 3 quarter-turns clockwise.
 * 
 * @param {any[][]} matrix - N x N matrix
 * @returns {any[][]} A new rotated matrix
 */
export function rotateCounterClockwise(matrix) {
  const n = matrix.length;
  const result = createMatrix(n);
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      result[n - 1 - c][r] = matrix[r][c];
    }
  }
  return result;
}

/**
 * Rotates an N x N matrix 180 degrees.
 * Equivalent to 2 quarter-turns clockwise.
 * 
 * @param {any[][]} matrix - N x N matrix
 * @returns {any[][]} A new rotated matrix
 */
export function rotate180(matrix) {
  const n = matrix.length;
  const result = createMatrix(n);
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      result[n - 1 - r][n - 1 - c] = matrix[r][c];
    }
  }
  return result;
}

/**
 * Deep clones an N x N matrix.
 * 
 * @param {any[][]} matrix 
 * @returns {any[][]}
 */
export function cloneMatrix(matrix) {
  return matrix.map(row => [...row]);
}
