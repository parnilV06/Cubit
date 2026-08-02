/**
 * Cubit Cube Engine — Scramble Notation Parser
 * 
 * Converts raw scramble strings produced by Stage 1 (csTimer) into structured move operations.
 * Supports 2x2, 3x3, 4x4, and 5x5 WCA notation, including standard face turns, wide moves,
 * numeric layer prefixes, and quarter/half-turn modifiers.
 */

import { VALID_FACES } from './constants.js';

/**
 * Parses a single scramble move token string.
 * 
 * Examples:
 * - "R"   => { face: "R", amount: 1,  depth: 1, isWide: false }
 * - "U2"  => { face: "U", amount: 2,  depth: 1, isWide: false }
 * - "F'"  => { face: "F", amount: -1, depth: 1, isWide: false }
 * - "Rw"  => { face: "R", amount: 1,  depth: 2, isWide: true }
 * - "Fw2" => { face: "F", amount: 2,  depth: 2, isWide: true }
 * - "3Fw'" => { face: "F", amount: -1, depth: 3, isWide: true }
 * - "r"   => { face: "R", amount: 1,  depth: 2, isWide: true } (lowercase wide move)
 * 
 * @param {string} token - A single move string
 * @returns {{ raw: string, face: string, amount: number, depth: number, isWide: boolean }}
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

  // Regex format: optional layer prefix digit(s), face character (uppercase or lowercase), optional 'w', optional modifier (' or 2)
  const regex = /^(\d+)?([UDRLFBudrlfb]w?)(['2']?)$/;
  const match = cleanToken.match(regex);

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
 * @param {string} scrambleString - Space-separated move tokens (e.g. "R U2 F' Lw2")
 * @returns {Array<{ raw: string, face: string, amount: number, depth: number, isWide: boolean }>}
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
