/**
 * Cubit Scramble Generator Service - Public API Entrypoint
 * 
 * Provides the public interface for WCA-compliant scramble generation.
 * All components and services in the Cubit application must import from this file.
 * 
 * Attribution & Architecture Note:
 * - Cubit relies on the `cstimer_module` library for official WCA-compliant scramble generation.
 * - All other systems (Cube state engines, visualization renderers, timer interfaces, and users stats)
 *   are custom-built by Cubit.
 * - This service layer completely encapsulates the scramble generation library. The rest of the app
 *   is agnostic of the library, facilitating clean replacement in the future if required (e.g., TNoodle).
 */

export { generateScramble } from './generator.js';
export { SUPPORTED_PUZZLES } from './constants.js';
export { isValidPuzzleType, isValidScrambleObject } from './types.js';
