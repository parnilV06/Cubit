/**
 * Cubit Active Scramble Pipeline (Stage 3 Integration)
 * 
 * Creates a single, authoritative active scramble object containing:
 * - Scramble metadata & UUID from Stage 1 (cstimer_module)
 * - Mathematical NxN cube state representation from Stage 2 Cube Engine
 * - 2D unfolded net visualization data from Stage 2 Visualizer Mapper
 * 
 * Guarantees that displayed scramble text and rendered 2D cube net originate
 * from the exact same scramble generation event.
 */

import { generateScramble } from './generator.js';
import { normalizePuzzleType } from './utils.js';
import { applyScramble } from '../cubeEngine/engine.js';
import { mapCubeStateToNetData } from '../cubeEngine/visualizer/mapper.js';

/**
 * Creates an authoritative Active Scramble object for a given puzzle type.
 * 
 * @param {string | number} rawPuzzleType - Puzzle type (e.g. 'THREE_BY_THREE', '3x3', '2x2')
 * @returns {Object} Full active scramble object with scramble string, state grid, and net data.
 */
export function createActiveScramble(rawPuzzleType = 'THREE_BY_THREE') {
  const enginePuzzleType = normalizePuzzleType(rawPuzzleType);
  
  // Stage 1: Generate WCA-compliant scramble string & metadata
  const scrambleObj = generateScramble(enginePuzzleType);
  
  // Stage 2: Calculate mathematical NxN cube state
  const cubeState = applyScramble(scrambleObj.scramble, enginePuzzleType);
  
  // Stage 2: Map cube state to 2D net layout grid data
  const visualization = mapCubeStateToNetData(cubeState);

  return {
    ...scrambleObj,
    rawPuzzleType,
    enginePuzzleType,
    cubeState,
    visualization,
  };
}
