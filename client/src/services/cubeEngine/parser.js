/**
 * Cubit Cube Engine — Scramble Notation Parser
 * 
 * Converts raw scramble strings produced by Stage 1 (csTimer) into structured move operations.
 * Supports 2x2, 3x3, 4x4, and 5x5 WCA notation, including standard face turns, wide moves,
 * numeric layer prefixes, and quarter/half-turn modifiers.
 */

import { VALID_FACES, VALID_ROTATIONS, VALID_SLICES } from './constants.js';

/**
 * Parses a single move token string into a structured move operation.
 * 
 * Supported move categories:
 * 1. Standard face turns & wide moves:
 *    - "R"   => { raw: "R", face: "R", amount: 1,  depth: 1, isWide: false }
 *    - "U2"  => { raw: "U2", face: "U", amount: 2,  depth: 1, isWide: false }
 *    - "F'"  => { raw: "F'", face: "F", amount: -1, depth: 1, isWide: false }
 *    - "Rw"  => { raw: "Rw", face: "R", amount: 1,  depth: 2, isWide: true }
 *    - "Fw2" => { raw: "Fw2", face: "F", amount: 2,  depth: 2, isWide: true }
 *    - "3Fw'" => { raw: "3Fw'", face: "F", amount: -1, depth: 3, isWide: true }
 *    - "r"   => { raw: "r", face: "R", amount: 1,  depth: 2, isWide: true } (lowercase wide move)
 * 
 * 2. Whole-cube rotations:
 *    - "x", "x'", "x2" => { raw: "x", type: "rotation", axis: "x", amount: 1 }
 *    - "y", "y'", "y2" => { raw: "y", type: "rotation", axis: "y", amount: 1 }
 *    - "z", "z'", "z2" => { raw: "z", type: "rotation", axis: "z", amount: 1 }
 * 
 * 3. Slice moves (3x3):
 *    - "M", "M'", "M2" => { raw: "M", type: "slice", slice: "M", amount: 1 }
 *    - "E", "E'", "E2" => { raw: "E", type: "slice", slice: "E", amount: 1 }
 *    - "S", "S'", "S2" => { raw: "S", type: "slice", slice: "S", amount: 1 }
 * 
 * @param {string} token - A single move string
 * @returns {{ raw: string, face?: string, amount: number, depth?: number, isWide?: boolean, type?: string, axis?: string, slice?: string }}
 * @throws {Error} If token format is invalid or unsupported.
 */
export function parseMoveToken(token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid move token: Token must be a non-empty string.');
  }

  const cleanToken = token.trim();
  if (!cleanToken) {
    throw new Error('Invalid move token: Received blank string.');
  }

  // 1. Check for whole-cube rotation (x, y, z, X, Y, Z with optional ' or 2 modifier)
  const rotationMatch = cleanToken.match(/^([xyzXYZ])(['2']?)$/);
  if (rotationMatch) {
    const [, axisChar, modifier] = rotationMatch;
    const axis = axisChar.toLowerCase();
    let amount = 1;
    if (modifier === "'") {
      amount = -1;
    } else if (modifier === '2') {
      amount = 2;
    }

    return {
      raw: cleanToken,
      type: 'rotation',
      axis,
      amount,
    };
  }

  // 2. Check for 3x3 slice move (M, E, S, m, e, s with optional ' or 2 modifier)
  const sliceMatch = cleanToken.match(/^([MESmes])(['2']?)$/);
  if (sliceMatch) {
    const [, sliceChar, modifier] = sliceMatch;
    const slice = sliceChar.toUpperCase();
    let amount = 1;
    if (modifier === "'") {
      amount = -1;
    } else if (modifier === '2') {
      amount = 2;
    }

    return {
      raw: cleanToken,
      type: 'slice',
      slice,
      amount,
    };
  }

  // 3. Check for standard face turns and wide moves: optional layer prefix digit(s), face character, optional 'w', optional modifier (' or 2)
  const faceRegex = /^(\d+)?([UDRLFBudrlfb]w?)(['2']?)$/;
  const match = cleanToken.match(faceRegex);

  if (!match) {
    throw new Error(`Unsupported or malformed move token: "${cleanToken}"`);
  }

  const [, prefixStr, moveCode, modifier] = match;

  const baseChar = moveCode[0];
  const isLowercase = baseChar >= 'a' && baseChar <= 'z';
  const face = baseChar.toUpperCase();

  if (!VALID_FACES.includes(face)) {
    throw new Error(`Invalid face identifier in token "${cleanToken}": "${face}"`);
  }

  const hasWideSuffix = moveCode.endsWith('w');
  const isWide = hasWideSuffix || isLowercase;

  // Determine move turn amount: 1 for clockwise, -1 for counter-clockwise, 2 for 180°
  let amount = 1;
  if (modifier === "'") {
    amount = -1;
  } else if (modifier === '2') {
    amount = 2;
  }

  // Determine layer depth: default depth is 1 for face turns, 2 for standard wide turns ('Rw')
  let depth = 1;
  if (prefixStr) {
    depth = parseInt(prefixStr, 10);
  } else if (isWide) {
    depth = 2;
  }

  if (depth < 1) {
    throw new Error(`Invalid layer depth in token "${cleanToken}": depth must be >= 1`);
  }

  return {
    raw: cleanToken,
    face,
    amount,
    depth,
    isWide,
  };
}

/**
 * Tokenizes and parses a complete scramble string into an array of structured move objects.
 * 
 * @param {string} scrambleString - Space-separated move tokens (e.g. "R U2 F' Lw2 x M2")
 * @returns {Array<Object>}
 * @throws {Error} If scramble string is invalid or contains malformed tokens.
 */
export function parseScramble(scrambleString) {
  if (typeof scrambleString !== 'string') {
    throw new Error('Scramble input must be a string.');
  }

  const tokens = scrambleString.trim().split(/\s+/).filter(Boolean);
  
  if (tokens.length === 0) {
    return [];
  }

  return tokens.map(parseMoveToken);
}

