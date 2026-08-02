/**
 * Cubit Cube Engine — Pure Mathematical Cube State Engine
 * 
 * Provides deterministic 3D spatial mathematical transformations for NxN Rubik's cubes.
 * Maps face matrix cells to 3D coordinate space (x, y, z), applies rigid body rotations
 * for face/layer turns, and maps stickers back to face matrices.
 * 
 * Guaranteed mathematical correctness across 2x2, 3x3, 4x4, and 5x5 puzzles,
 * including wide moves and arbitrary scramble combinations.
 * 
 * Pure JavaScript module: ZERO dependencies on React, DOM, SVG, or UI elements.
 */

import {
  PUZZLE_DIMENSIONS,
  DEFAULT_PUZZLE_TYPE,
  CANONICAL_FACES,
  STICKER_COLORS,
  VALID_FACES,
} from './constants.js';
import { createMatrix } from './matrix.js';
import { parseScramble } from './parser.js';

/**
 * Resolves puzzle dimension N from puzzle type string ('2x2', '3x3', '4x4', '5x5') or number.
 * 
 * @param {string | number} puzzleTypeOrDimension 
 * @returns {number} Dimension N (e.g. 3)
 */
export function resolveDimension(puzzleTypeOrDimension) {
  if (typeof puzzleTypeOrDimension === 'number') {
    if (puzzleTypeOrDimension >= 2 && puzzleTypeOrDimension <= 5) {
      return puzzleTypeOrDimension;
    }
  } else if (typeof puzzleTypeOrDimension === 'string') {
    const mapped = PUZZLE_DIMENSIONS[puzzleTypeOrDimension];
    if (mapped) return mapped;
  }
  return PUZZLE_DIMENSIONS[DEFAULT_PUZZLE_TYPE];
}

/**
 * Creates a solved NxN cube state representation.
 * 
 * @param {string | number} [puzzleTypeOrDimension='3x3'] 
 * @returns {{ U: string[][], D: string[][], F: string[][], B: string[][], R: string[][], L: string[][], dimension: number }}
 */
export function createSolvedCube(puzzleTypeOrDimension = DEFAULT_PUZZLE_TYPE) {
  const dimension = resolveDimension(puzzleTypeOrDimension);
  
  return {
    dimension,
    U: createMatrix(dimension, CANONICAL_FACES.U),
    D: createMatrix(dimension, CANONICAL_FACES.D),
    F: createMatrix(dimension, CANONICAL_FACES.F),
    B: createMatrix(dimension, CANONICAL_FACES.B),
    R: createMatrix(dimension, CANONICAL_FACES.R),
    L: createMatrix(dimension, CANONICAL_FACES.L),
  };
}

/**
 * Maps a face matrix cell (face, r, c) to 3D unit space (x, y, z) in [-1, 1]^3.
 * 
 * @param {string} face - 'U', 'D', 'F', 'B', 'R', 'L'
 * @param {number} r - Row index [0 ... N-1]
 * @param {number} c - Column index [0 ... N-1]
 * @param {number} N - Dimension
 * @returns {{ x: number, y: number, z: number }}
 */
export function faceTo3D(face, r, c, N) {
  const u = -1 + (2 * c + 1) / N;
  const v = 1 - (2 * r + 1) / N;

  switch (face) {
    case 'U': return { x: u, y: 1, z: -v };
    case 'D': return { x: u, y: -1, z: v };
    case 'F': return { x: u, y: v, z: 1 };
    case 'B': return { x: -u, y: v, z: -1 };
    case 'R': return { x: 1, y: v, z: -u };
    case 'L': return { x: -1, y: v, z: u };
    default: throw new Error(`Invalid face "${face}"`);
  }
}

/**
 * Maps a 3D unit coordinate (x, y, z) back to face matrix cell (face, r, c).
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @param {number} N 
 * @returns {{ face: string, r: number, c: number }}
 */
export function spatialToFace(x, y, z, N) {
  const eps = 1e-4;
  let face, u, v;

  if (Math.abs(y - 1) < eps) { face = 'U'; u = x; v = -z; }
  else if (Math.abs(y + 1) < eps) { face = 'D'; u = x; v = z; }
  else if (Math.abs(z - 1) < eps) { face = 'F'; u = x; v = y; }
  else if (Math.abs(z + 1) < eps) { face = 'B'; u = -x; v = y; }
  else if (Math.abs(x - 1) < eps) { face = 'R'; u = -z; v = y; }
  else if (Math.abs(x + 1) < eps) { face = 'L'; u = z; v = y; }
  else {
    throw new Error(`Coordinates (${x}, ${y}, ${z}) do not lie on cube surface.`);
  }

  const c = Math.round((u + 1) * N / 2 - 0.5);
  const r = Math.round((1 - v) * N / 2 - 0.5);
  return { face, r, c };
}

/**
 * Rotates a 3D point (x, y, z) 90 degrees clockwise around a face normal.
 * 
 * @param {{ x: number, y: number, z: number }} pt 
 * @param {string} turnFace - Face being turned
 * @returns {{ x: number, y: number, z: number }}
 */
export function rotate3DPoint(pt, turnFace) {
  const { x, y, z } = pt;
  switch (turnFace) {
    case 'U': return { x: -z, y: y, z: x };
    case 'D': return { x: z, y: y, z: -x };
    case 'R': return { x: x, y: z, z: -y };
    case 'L': return { x: x, y: -z, z: y };
    case 'F': return { x: y, y: -x, z: z };
    case 'B': return { x: -y, y: x, z: z };
    default: throw new Error(`Invalid turnFace "${turnFace}"`);
  }
}

/**
 * Determines whether a 3D point lies within layer `k` of face `turnFace`.
 * 
 * @param {{ x: number, y: number, z: number }} pt 
 * @param {string} turnFace 
 * @param {number} k - Layer index (0 is outer layer)
 * @param {number} N 
 * @returns {boolean}
 */
export function isInLayer(pt, turnFace, k, N) {
  const layerWidth = 2 / N;
  const outerVal = 1 - k * layerWidth;
  const innerVal = 1 - (k + 1) * layerWidth;
  const eps = 1e-4;

  let val;
  switch (turnFace) {
    case 'U': val = pt.y; break;
    case 'D': val = -pt.y; break;
    case 'R': val = pt.x; break;
    case 'L': val = -pt.x; break;
    case 'F': val = pt.z; break;
    case 'B': val = -pt.z; break;
    default: return false;
  }

  return val <= outerVal + eps && val >= innerVal - eps;
}

/**
 * Applies a 90-degree clockwise quarter-turn to a single layer `k` of face `face`.
 * Returns a new immutable cube state object.
 * 
 * @param {Object} cubeState - Existing cube state
 * @param {'U'|'D'|'F'|'B'|'R'|'L'} face - Face name
 * @param {number} [k=0] - Layer index (0 is outer face)
 * @returns {Object} New cube state after layer turn
 */
export function turnLayer(cubeState, face, k = 0) {
  const N = cubeState.dimension;

  if (k < 0 || k >= N) {
    throw new Error(`Layer index ${k} out of bounds for ${N}x${N} cube.`);
  }

  const next = createSolvedCube(N);
  const faces = ['U', 'D', 'F', 'B', 'R', 'L'];

  // Rotate stickers in layer k using 3D spatial transformation
  for (const f of faces) {
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const pt = faceTo3D(f, r, c, N);
        let destPt = pt;
        if (isInLayer(pt, face, k, N)) {
          destPt = rotate3DPoint(pt, face);
        }
        const dest = spatialToFace(destPt.x, destPt.y, destPt.z, N);
        next[dest.face][dest.r][dest.c] = cubeState[f][r][c];
      }
    }
  }

  return next;
}

/**
 * Applies a single parsed move operation (e.g. { face: 'R', amount: 2, depth: 1 }) to a cube state.
 * 
 * @param {Object} cubeState 
 * @param {{ face: string, amount: number, depth: number }} moveObj 
 * @returns {Object} New cube state
 */
export function applyMove(cubeState, moveObj) {
  const { face, amount, depth = 1 } = moveObj;
  
  if (!VALID_FACES.includes(face)) {
    throw new Error(`Cannot apply move: invalid face "${face}"`);
  }

  let currentState = cubeState;
  
  // Normalize turn count (e.g. amount = -1 -> 3 quarter turns clockwise)
  const quarterTurnCount = ((amount % 4) + 4) % 4;
  const actualDepth = Math.min(depth, cubeState.dimension);

  for (let step = 0; step < quarterTurnCount; step++) {
    for (let k = 0; k < actualDepth; k++) {
      currentState = turnLayer(currentState, face, k);
    }
  }

  return currentState;
}

/**
 * Applies a scramble string or parsed move array to a solved cube state (or new solved cube of puzzleType).
 * Single public entry point for scramble application.
 * 
 * @param {string | Object[]} scrambleInput - Scramble string (e.g. "R U2 F'") or parsed moves array
 * @param {string | number} [puzzleTypeOrDimension='3x3'] - Puzzle type (e.g. '3x3')
 * @returns {Object} Scrambled cube state
 */
export function applyScramble(scrambleInput, puzzleTypeOrDimension = DEFAULT_PUZZLE_TYPE) {
  const initialState = createSolvedCube(puzzleTypeOrDimension);

  let moves = [];
  if (typeof scrambleInput === 'string') {
    moves = parseScramble(scrambleInput);
  } else if (Array.isArray(scrambleInput)) {
    moves = scrambleInput;
  } else {
    throw new Error('Invalid scrambleInput: expected scramble string or array of parsed moves.');
  }

  let currentState = initialState;
  for (const move of moves) {
    currentState = applyMove(currentState, move);
  }

  return currentState;
}

/**
 * Validates sticker color conservation for an NxN cube state.
 * Verifies that each of the 6 canonical colors appears exactly N^2 times.
 * 
 * @param {Object} cubeState 
 * @returns {{ isValid: boolean, countMap: Record<string, number>, totalStickers: number, expectedPerColor: number }}
 */
export function validateCubeState(cubeState) {
  const N = cubeState.dimension;
  const expectedPerColor = N * N;
  const countMap = {
    [STICKER_COLORS.WHITE]: 0,
    [STICKER_COLORS.YELLOW]: 0,
    [STICKER_COLORS.GREEN]: 0,
    [STICKER_COLORS.BLUE]: 0,
    [STICKER_COLORS.RED]: 0,
    [STICKER_COLORS.ORANGE]: 0,
  };

  const faces = [cubeState.U, cubeState.D, cubeState.F, cubeState.B, cubeState.R, cubeState.L];
  
  let totalStickers = 0;
  for (const face of faces) {
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const color = face[r][c];
        if (countMap[color] !== undefined) {
          countMap[color]++;
        }
        totalStickers++;
      }
    }
  }

  const isValid = Object.values(countMap).every(count => count === expectedPerColor) && totalStickers === 6 * expectedPerColor;

  return {
    isValid,
    countMap,
    totalStickers,
    expectedPerColor,
  };
}

/**
 * Gets fixed center sticker colors for odd N cubes (3x3, 5x5).
 * 
 * @param {Object} cubeState 
 * @returns {Record<string, string> | null} Center colors per face or null if even N
 */
export function getCenterStickers(cubeState) {
  const N = cubeState.dimension;
  if (N % 2 === 0) return null;

  const mid = Math.floor(N / 2);
  return {
    U: cubeState.U[mid][mid],
    D: cubeState.D[mid][mid],
    F: cubeState.F[mid][mid],
    B: cubeState.B[mid][mid],
    R: cubeState.R[mid][mid],
    L: cubeState.L[mid][mid],
  };
}
