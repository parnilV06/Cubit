/**
 * Cubit Cube Engine — Visualization Mapper
 * 
 * Translates mathematical cube state matrices into structured 2D Net visualization data.
 * Pure mapping layer: Maps internal semantic color enums (WHITE, GREEN...) to UI CSS color hexes
 * and constructs the 2D unfolded cube net layout.
 */

import { UI_COLOR_PALETTE, STICKER_COLORS } from '../constants.js';

/**
 * Maps a face matrix of semantic color keys into visual sticker objects containing UI hex codes.
 * 
 * @param {string[][]} faceMatrix - N x N matrix of semantic color strings (e.g. 'WHITE')
 * @param {string} faceKey - Face identifier ('U', 'D', 'F', 'B', 'R', 'L')
 * @returns {Array<Array<{ colorKey: string, hexColor: string, face: string, row: number, col: number }>>}
 */
export function mapFaceToStickerGrid(faceMatrix, faceKey) {
  const N = faceMatrix.length;
  const grid = [];

  for (let r = 0; r < N; r++) {
    const row = [];
    for (let c = 0; c < N; c++) {
      const colorKey = faceMatrix[r][c] || STICKER_COLORS.WHITE;
      const hexColor = UI_COLOR_PALETTE[colorKey] || '#FFFFFF';
      row.push({
        colorKey,
        hexColor,
        face: faceKey,
        row: r,
        col: c,
        id: `${faceKey}-${r}-${c}`,
      });
    }
    grid.push(row);
  }

  return grid;
}

/**
 * Maps a complete cubeState object into structured 2D net rendering data.
 * 
 * @param {Object} cubeState - Cube state object containing U, D, F, B, R, L face matrices
 * @returns {{
 *   dimension: number,
 *   netLayout: {
 *     U: Array<Array<Object>>,
 *     L: Array<Array<Object>>,
 *     F: Array<Array<Object>>,
 *     R: Array<Array<Object>>,
 *     B: Array<Array<Object>>,
 *     D: Array<Array<Object>>
 *   }
 * }}
 */
export function mapCubeStateToNetData(cubeState) {
  if (!cubeState || !cubeState.U) {
    throw new Error('Invalid cubeState provided to visualization mapper.');
  }

  const dimension = cubeState.dimension || cubeState.U.length;

  return {
    dimension,
    netLayout: {
      U: mapFaceToStickerGrid(cubeState.U, 'U'),
      L: mapFaceToStickerGrid(cubeState.L, 'L'),
      F: mapFaceToStickerGrid(cubeState.F, 'F'),
      R: mapFaceToStickerGrid(cubeState.R, 'R'),
      B: mapFaceToStickerGrid(cubeState.B, 'B'),
      D: mapFaceToStickerGrid(cubeState.D, 'D'),
    },
  };
}
