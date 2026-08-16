/**
 * Cubit Trainer — Reusable Interactive CubeViewer Component
 * 
 * Renders an unfolded 2D cube net visualization for any dimension (2x2 to 5x5),
 * computing state deterministically using pure cubeEngine math.
 */

import React, { useMemo, useState, useEffect } from 'react';
import { RotateCcw, Box } from 'lucide-react';
import {
  createSolvedCube,
  applyScramble,
  validateCubeState,
} from '../../../services/cubeEngine/index.js';
import CubeNetRenderer from '../../../services/cubeEngine/visualizer/CubeNetRenderer.jsx';

export function CubeViewer({
  dimension = '3x3',
  cubeState: externalCubeState,
  scramble = '',
  moves = '',
  initialState,
  title,
  description,
  showNet = true,
  maxContainerWidth = 280,
  showReset = false,
  showStatus = true,
  onStateChange,
  className = '',
  style = {},
}) {
  // State for interactive reset support
  const [activeScramble, setActiveScramble] = useState(scramble || moves || '');

  useEffect(() => {
    setActiveScramble(scramble || moves || '');
  }, [scramble, moves]);

  // Deterministically compute cube state
  const computedState = useMemo(() => {
    if (externalCubeState) {
      return externalCubeState;
    }
    try {
      if (activeScramble && activeScramble.trim()) {
        const base = initialState || dimension;
        return applyScramble(activeScramble, base);
      }
      return initialState || createSolvedCube(dimension);
    } catch (err) {
      console.warn('CubeViewer state calculation fallback:', err);
      return initialState || createSolvedCube(dimension);
    }
  }, [externalCubeState, activeScramble, initialState, dimension]);

  // Inform parent of state changes if requested
  useEffect(() => {
    if (onStateChange) {
      onStateChange(computedState);
    }
  }, [computedState, onStateChange]);

  // State validation
  const validation = useMemo(() => {
    try {
      return validateCubeState(computedState);
    } catch (e) {
      return { isValid: false };
    }
  }, [computedState]);

  const dimLabel = typeof dimension === 'number' ? `${dimension}x${dimension}` : dimension;

  const handleReset = () => {
    setActiveScramble('');
  };

  return (
    <div
      className={`cubit-trainer-cube-viewer ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: 'var(--bg-card, #17171c)',
        border: '1px solid var(--border-primary, #2b2b35)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
        color: 'var(--text-primary, #fafafa)',
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: `${Math.max(maxContainerWidth + 40, 280)}px`,
        margin: '0 auto',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Optional Title / Header */}
      {(title || description || showReset) && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: '1px solid var(--border-primary, #2b2b35)',
            gap: '8px',
          }}
        >
          <div style={{ textAlign: 'left', flex: 1 }}>
            {title && (
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary, #fafafa)',
                  fontFamily: 'var(--font-heading, sans-serif)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Box size={14} color="var(--brand-primary, #572ff7)" />
                {title}
              </div>
            )}
            {description && (
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary, #a8a8b5)',
                  marginTop: '2px',
                }}
              >
                {description}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: '600',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'rgba(87, 47, 247, 0.15)',
                color: 'var(--brand-ter, #bc8be0)',
                border: '1px solid rgba(87, 47, 247, 0.3)',
              }}
            >
              {dimLabel}
            </span>

            {showReset && activeScramble && (
              <button
                onClick={handleReset}
                title="Reset cube state"
                aria-label="Reset cube to solved state"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted, #7a7a88)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary, #fafafa)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted, #7a7a88)')}
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2D Unfolded Net Renderer */}
      {showNet && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '8px 0',
          }}
        >
          <CubeNetRenderer cubeState={computedState} maxContainerWidth={maxContainerWidth} />
        </div>
      )}

      {/* State Status Footnote (if enabled) */}
      {showStatus && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '8px',
            paddingTop: '6px',
            fontSize: '11px',
            color: 'var(--text-muted, #7a7a88)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: validation.isValid ? '#22c55e' : '#ef4444',
              }}
            />
            {validation.isValid ? 'Valid State' : 'Check Orientation'}
          </span>

          {activeScramble && (
            <span
              title={activeScramble}
              style={{
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: 'monospace',
                fontSize: '10px',
                color: 'var(--text-secondary, #a8a8b5)',
              }}
            >
              {activeScramble}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default CubeViewer;
