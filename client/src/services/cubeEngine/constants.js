/**
 * Cubit Cube Engine Constants
 * 
 * Defines puzzle dimensions, canonical sticker color enums, fixed cube orientation,
 * and UI color mapping for the 2D Net visualizer.
 */

/**
 * Standard puzzle sizes supported by Cubit
 * @type {Readonly<Record<string, number>>}
 */
export const PUZZLE_DIMENSIONS = Object.freeze({
  '2x2': 2,
  '3x3': 3,
  '4x4': 4,
  '5x5': 5,
});

export const DEFAULT_PUZZLE_TYPE = '3x3';

/**
 * Internal semantic sticker color representation.
 * The mathematical engine uses ONLY these semantic keys.
 * @type {Readonly<Record<string, string>>}
 */
export const STICKER_COLORS = Object.freeze({
  WHITE: 'WHITE',
  YELLOW: 'YELLOW',
  GREEN: 'GREEN',
  BLUE: 'BLUE',
  RED: 'RED',
  ORANGE: 'ORANGE',
});

/**
 * Fixed Canonical Solved Cube Orientation
 * 
 * Upper (U):  WHITE
 * Down (D):   YELLOW
 * Front (F):  GREEN
 * Back (B):   BLUE
 * Right (R):  RED
 * Left (L):   ORANGE
 * 
 * Unfolded 2D Net Structure:
 *             U (White)
 *   L (Orange) F (Green) R (Red) B (Blue)
 *             D (Yellow)
 */
export const CANONICAL_FACES = Object.freeze({
  U: STICKER_COLORS.WHITE,
  D: STICKER_COLORS.YELLOW,
  F: STICKER_COLORS.GREEN,
  B: STICKER_COLORS.BLUE,
  R: STICKER_COLORS.RED,
  L: STICKER_COLORS.ORANGE,
});

/**
 * UI Theme Hex Palette mapping internal semantic colors to UI CSS colors.
 * Tailored for modern dark-mode aesthetic with vibrant contrast.
 * @type {Readonly<Record<string, string>>}
 */
export const UI_COLOR_PALETTE = Object.freeze({
  [STICKER_COLORS.WHITE]: '#F8FAFC',  // Clean Slate-50 White
  [STICKER_COLORS.YELLOW]: '#FACC15', // Vibrant Amber-400 Yellow
  [STICKER_COLORS.GREEN]: '#22C55E',  // Crisp Green-500
  [STICKER_COLORS.BLUE]: '#3B82F6',   // Bright Blue-500
  [STICKER_COLORS.RED]: '#EF4444',    // Vibrant Red-500
  [STICKER_COLORS.ORANGE]: '#F97316', // Warm Orange-500
});

/**
 * List of valid basic face identifiers
 */
export const VALID_FACES = Object.freeze(['U', 'D', 'F', 'B', 'R', 'L']);
