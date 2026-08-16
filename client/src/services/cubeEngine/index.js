/**
 * Cubit Cube Engine Module Public API
 * 
 * Provides unified exports for state generation, matrix transforms, scramble parsing,
 * mathematical state engine, visualization mapping, and 2D net rendering.
 */

export {
  PUZZLE_DIMENSIONS,
  DEFAULT_PUZZLE_TYPE,
  STICKER_COLORS,
  CANONICAL_FACES,
  UI_COLOR_PALETTE,
  VALID_FACES,
  VALID_ROTATIONS,
  VALID_SLICES,
} from './constants.js';

export {
  createMatrix,
  rotateClockwise,
  rotateCounterClockwise,
  rotate180,
  cloneMatrix,
} from './matrix.js';

export {
  parseMoveToken,
  parseScramble,
} from './parser.js';

export {
  createSolvedCube,
  turnLayer,
  applyMove,
  applyScramble,
  validateCubeState,
  getCenterStickers,
  resolveDimension,
} from './engine.js';

export {
  mapFaceToStickerGrid,
  mapCubeStateToNetData,
} from './visualizer/mapper.js';

export { CubeNetRenderer } from './visualizer/CubeNetRenderer.jsx';
