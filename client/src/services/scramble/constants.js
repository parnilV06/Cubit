/**
 * Cubit Scramble Generator Service Constants
 * 
 * Defines supported puzzle types, csTimer internal codes, and fallback move configurations.
 */

/**
 * Supported puzzle types in Cubit V1
 * @type {Readonly<{TWO_BY_TWO: string, THREE_BY_THREE: string, FOUR_BY_FOUR: string, FIVE_BY_FIVE: string}>}
 */
export const SUPPORTED_PUZZLES = Object.freeze({
  TWO_BY_TWO: '2x2',
  THREE_BY_THREE: '3x3',
  FOUR_BY_FOUR: '4x4',
  FIVE_BY_FIVE: '5x5',
});

/**
 * Default puzzle type used as the primary event when none is specified.
 * @type {string}
 */
export const DEFAULT_PUZZLE = SUPPORTED_PUZZLES.THREE_BY_THREE;

/**
 * Mapping from Cubit public puzzle types to csTimer internal scramble codes and lengths.
 * @type {Readonly<Record<string, { code: string, length: number, name: string }>>}
 */
export const CSTIMER_PUZZLE_MAPPINGS = Object.freeze({
  [SUPPORTED_PUZZLES.TWO_BY_TWO]: {
    code: '222so',
    length: 0,
    name: '2x2x2 (Random State)',
  },
  [SUPPORTED_PUZZLES.THREE_BY_THREE]: {
    code: '333',
    length: 0,
    name: '3x3x3 (Random State)',
  },
  [SUPPORTED_PUZZLES.FOUR_BY_FOUR]: {
    code: '444wca',
    length: 0,
    name: '4x4x4 (WCA-compliant)',
  },
  [SUPPORTED_PUZZLES.FIVE_BY_FIVE]: {
    code: '555wca',
    length: 60,
    name: '5x5x5 (WCA-compliant)',
  },
});

/**
 * Move lists for local fallback scramble generation.
 * @type {Readonly<Record<string, string[]>>}
 */
export const FALLBACK_MOVES = Object.freeze({
  [SUPPORTED_PUZZLES.TWO_BY_TWO]: ['U', 'R', 'F'],
  [SUPPORTED_PUZZLES.THREE_BY_THREE]: ['U', 'D', 'R', 'L', 'F', 'B'],
  [SUPPORTED_PUZZLES.FOUR_BY_FOUR]: ['U', 'D', 'R', 'L', 'F', 'B', 'Uw', 'Dw', 'Rw', 'Lw', 'Fw', 'Bw'],
  [SUPPORTED_PUZZLES.FIVE_BY_FIVE]: ['U', 'D', 'R', 'L', 'F', 'B', 'Uw', 'Dw', 'Rw', 'Lw', 'Fw', 'Bw'],
});

/**
 * Standard scramble lengths used for fallback generation.
 * @type {Readonly<Record<string, number>>}
 */
export const FALLBACK_LENGTHS = Object.freeze({
  [SUPPORTED_PUZZLES.TWO_BY_TWO]: 11,
  [SUPPORTED_PUZZLES.THREE_BY_THREE]: 21,
  [SUPPORTED_PUZZLES.FOUR_BY_FOUR]: 40,
  [SUPPORTED_PUZZLES.FIVE_BY_FIVE]: 60,
});
