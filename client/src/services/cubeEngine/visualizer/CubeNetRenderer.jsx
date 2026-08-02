/**
 * Cubit Cube Engine — 2D Cube Net Renderer Component
 * 
 * Renders an unfolded 2D cube net visualization for 2x2, 3x3, 4x4, and 5x5 Rubik's cubes.
 * 
 * Standard Unfolded Structure:
 *             [ U ]
 *   [ L ]     [ F ]     [ R ]     [ B ]
 *             [ D ]
 * 
 * Features:
 * - Pure inline styling to ensure 100% robust rendering across all build/CSS environments
 * - Distinct outer face boundaries with subtle slate borders and rounded corners
 * - Precise sticker size caps to guarantee ample top & bottom padding inside visualizer cards
 * - No text face labels displayed (clean net aesthetic)
 */

import React from 'react';
import { mapCubeStateToNetData } from './mapper.js';

/**
 * Single Face Grid Component
 * Renders an N x N matrix of stickers for a single cube face.
 * 
 * @param {{ faceData: Array<Array<Object>>, dimension: number, stickerSize: number }} props
 */
function FaceGrid({ faceData, dimension, stickerSize }) {
  if (!faceData) return null;

  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: `repeat(${dimension}, ${stickerSize}px)`,
        gridTemplateRows: `repeat(${dimension}, ${stickerSize}px)`,
        gap: '2px',
        padding: '2px',
        backgroundColor: '#0f172a', // slate-900 background
        border: '1.5px solid #334155', // slate-700 outer boundary
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.4)',
        boxSizing: 'border-box',
      }}
    >
      {faceData.flatMap((row) =>
        row.map((sticker) => (
          <div
            key={sticker.id}
            style={{
              backgroundColor: sticker.hexColor,
              width: `${stickerSize}px`,
              height: `${stickerSize}px`,
              borderRadius: '2px',
              border: '1px solid rgba(0, 0, 0, 0.25)',
              boxSizing: 'border-box',
              transition: 'transform 0.15s ease',
            }}
            title={`Position (${sticker.row + 1}, ${sticker.col + 1}): ${sticker.colorKey}`}
          />
        ))
      )}
    </div>
  );
}

/**
 * 2D Cube Net Renderer Component
 * 
 * @param {{ cubeState?: Object, netData?: Object, maxContainerWidth?: number }} props
 */
export function CubeNetRenderer({ cubeState, netData, maxContainerWidth = 260 }) {
  const data = netData || (cubeState ? mapCubeStateToNetData(cubeState) : null);

  if (!data) {
    return (
      <div style={{ padding: '16px', color: '#94a3b8', fontSize: '12px', fontFamily: 'monospace', textAlign: 'center' }}>
        No Cube State Provided
      </div>
    );
  }

  const { dimension, netLayout } = data;

  // Spacing parameters
  const netFaceGap = 4; // px gap between faces in the net
  const facePadding = 4; // 2px padding on each side of each face box (4px total)
  const innerStickerGaps = (dimension - 1) * 2; // 2px gap between stickers within a face
  const totalNonStickerWidth = (4 * (facePadding + innerStickerGaps)) + (3 * netFaceGap);

  const availableForStickers = Math.max(30, maxContainerWidth - totalNonStickerWidth);
  const calculatedStickerSize = Math.floor(availableForStickers / (4 * dimension));

  // Max sticker size limits for comfortable vertical and horizontal headroom
  const maxStickerSizeMap = { 2: 17, 3: 13, 4: 10, 5: 8 };
  const maxAllowed = maxStickerSizeMap[dimension] || 12;
  const stickerSize = Math.max(5, Math.min(maxAllowed, calculatedStickerSize));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '2px 0',
        userSelect: 'none',
        boxSizing: 'border-box',
      }}
    >
      {/* 4-column x 3-row CSS Net Grid Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, auto)',
          gridTemplateRows: 'repeat(3, auto)',
          gap: `${netFaceGap}px`,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Row 1: U (Up) Face - Positioned in Column 2 */}
        <div style={{ gridRow: 1, gridColumn: 2, display: 'flex', justifyContent: 'center' }}>
          <FaceGrid faceData={netLayout.U} dimension={dimension} stickerSize={stickerSize} />
        </div>

        {/* Row 2: L, F, R, B Faces - Positioned in Columns 1 to 4 */}
        <div style={{ gridRow: 2, gridColumn: 1, display: 'flex', justifyContent: 'center' }}>
          <FaceGrid faceData={netLayout.L} dimension={dimension} stickerSize={stickerSize} />
        </div>
        <div style={{ gridRow: 2, gridColumn: 2, display: 'flex', justifyContent: 'center' }}>
          <FaceGrid faceData={netLayout.F} dimension={dimension} stickerSize={stickerSize} />
        </div>
        <div style={{ gridRow: 2, gridColumn: 3, display: 'flex', justifyContent: 'center' }}>
          <FaceGrid faceData={netLayout.R} dimension={dimension} stickerSize={stickerSize} />
        </div>
        <div style={{ gridRow: 2, gridColumn: 4, display: 'flex', justifyContent: 'center' }}>
          <FaceGrid faceData={netLayout.B} dimension={dimension} stickerSize={stickerSize} />
        </div>

        {/* Row 3: D (Down) Face - Positioned in Column 2 */}
        <div style={{ gridRow: 3, gridColumn: 2, display: 'flex', justifyContent: 'center' }}>
          <FaceGrid faceData={netLayout.D} dimension={dimension} stickerSize={stickerSize} />
        </div>
      </div>
    </div>
  );
}

export default CubeNetRenderer;
