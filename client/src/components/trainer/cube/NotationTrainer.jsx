/**
 * Cubit Trainer — Reusable Interactive NotationTrainer Component
 * 
 * Interactive notation practice workbench. Lets cubers execute moves (face turns,
 * rotations, slices) in real time with visual feedback, move history, undo, and reset.
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  RotateCcw,
  Undo2,
  Copy,
  Check,
  Gamepad2,
  Sparkles,
} from 'lucide-react';
import {
  createSolvedCube,
  applyScramble,
  applyMove,
  parseMoveToken,
} from '../../../services/cubeEngine/index.js';
import CubeNetRenderer from '../../../services/cubeEngine/visualizer/CubeNetRenderer.jsx';

const DEFAULT_BASIC_MOVES = [
  'R', "R'", 'U', "U'",
  'F', "F'", 'L', "L'",
  'D', "D'", 'B', "B'",
];

const DEFAULT_ROTATION_MOVES = ['x', "x'", 'y', "y'", 'z', "z'"];
const DEFAULT_SLICE_MOVES = ['M', "M'", 'E', "E'", 'S', "S'"];

export function NotationTrainer({
  moves = DEFAULT_BASIC_MOVES,
  dimension = '3x3',
  initialState,
  initialScramble = '',
  title = 'Notation Practice',
  description,
  showHistory = true,
  maxHistory = 30,
  allowReset = true,
  maxContainerWidth = 280,
  onMoveExecute,
  className = '',
  style = {},
}) {
  // Base initial state
  const baseStartingState = useMemo(() => {
    try {
      if (initialState) return initialState;
      if (initialScramble && initialScramble.trim()) {
        return applyScramble(initialScramble, dimension);
      }
      return createSolvedCube(dimension);
    } catch (e) {
      console.warn('NotationTrainer base state error:', e);
      return createSolvedCube(dimension);
    }
  }, [initialState, initialScramble, dimension]);

  // History stack of applied moves and resulting states
  const [history, setHistory] = useState([
    { token: null, state: baseStartingState },
  ]);
  const [copied, setCopied] = useState(false);
  const [lastClickedToken, setLastClickedToken] = useState(null);

  const currentState = history[history.length - 1].state;
  const moveHistoryTokens = useMemo(() => {
    return history.slice(1).map((h) => h.token);
  }, [history]);

  // Resolve move buttons list
  const activeMovesList = useMemo(() => {
    if (Array.isArray(moves)) return moves;
    if (moves === 'basic') return DEFAULT_BASIC_MOVES;
    if (moves === 'rotations') return DEFAULT_ROTATION_MOVES;
    if (moves === 'slices') return DEFAULT_SLICE_MOVES;
    if (moves === 'all') {
      return [...DEFAULT_BASIC_MOVES, ...DEFAULT_SLICE_MOVES, ...DEFAULT_ROTATION_MOVES];
    }
    return DEFAULT_BASIC_MOVES;
  }, [moves]);

  // Handle single move click
  const handleExecuteMove = useCallback(
    (token) => {
      try {
        const nextState = applyMove(currentState, token);
        setLastClickedToken(token);
        setTimeout(() => setLastClickedToken(null), 300);

        setHistory((prev) => {
          const next = [...prev, { token, state: nextState }];
          if (next.length > maxHistory + 1) {
            return [next[0], ...next.slice(next.length - maxHistory)];
          }
          return next;
        });

        if (onMoveExecute) {
          onMoveExecute(token, nextState, [...moveHistoryTokens, token]);
        }
      } catch (err) {
        console.error(`Failed to execute move "${token}":`, err);
      }
    },
    [currentState, maxHistory, onMoveExecute, moveHistoryTokens]
  );

  // Undo last move
  const handleUndo = useCallback(() => {
    if (history.length <= 1) return;
    setHistory((prev) => prev.slice(0, prev.length - 1));
  }, [history.length]);

  // Reset all moves back to initial base state
  const handleReset = useCallback(() => {
    setHistory([{ token: null, state: baseStartingState }]);
  }, [baseStartingState]);

  // Copy move history sequence to clipboard
  const handleCopySequence = () => {
    if (moveHistoryTokens.length === 0) return;
    const text = moveHistoryTokens.join(' ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dimLabel = typeof dimension === 'number' ? `${dimension}x${dimension}` : dimension;

  return (
    <div
      className={`cubit-trainer-notation-trainer ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '18px',
        borderRadius: '14px',
        backgroundColor: 'var(--bg-card, #17171c)',
        border: '1px solid var(--border-primary, #2b2b35)',
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.4)',
        color: 'var(--text-primary, #fafafa)',
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: `${Math.max(maxContainerWidth + 40, 320)}px`,
        margin: '0 auto',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--border-primary, #2b2b35)',
          gap: '8px',
        }}
      >
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: 'var(--text-primary, #fafafa)',
              fontFamily: 'var(--font-heading, sans-serif)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Gamepad2 size={15} color="var(--brand-primary, #572ff7)" />
            {title}
          </div>
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

        {/* Dimension Badge & Move Counter */}
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
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              color: 'var(--text-muted, #7a7a88)',
            }}
          >
            {moveHistoryTokens.length} moves
          </span>
        </div>
      </div>

      {/* 2D Unfolded Net Renderer */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '6px 0 12px 0',
        }}
      >
        <CubeNetRenderer cubeState={currentState} maxContainerWidth={maxContainerWidth} />
      </div>

      {/* Move Buttons Pad Grid */}
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '6px',
          marginBottom: '14px',
          boxSizing: 'border-box',
        }}
      >
        {activeMovesList.map((token) => {
          const isPrime = token.includes("'");
          const isDouble = token.includes('2');
          const isJustClicked = lastClickedToken === token;

          return (
            <button
              key={token}
              onClick={() => handleExecuteMove(token)}
              title={`Execute move ${token}`}
              style={{
                padding: '8px 4px',
                fontSize: '13px',
                fontWeight: '700',
                fontFamily: 'var(--font-timer, monospace)',
                borderRadius: '6px',
                border: isJustClicked
                  ? '1.5px solid var(--brand-primary, #572ff7)'
                  : '1px solid var(--border-primary, #2b2b35)',
                backgroundColor: isJustClicked
                  ? 'rgba(87, 47, 247, 0.3)'
                  : isPrime
                  ? 'rgba(167, 104, 212, 0.08)'
                  : 'rgba(255, 255, 255, 0.04)',
                color: isJustClicked
                  ? '#ffffff'
                  : isPrime
                  ? 'var(--brand-ter, #bc8be0)'
                  : 'var(--text-primary, #fafafa)',
                cursor: 'pointer',
                boxShadow: isJustClicked ? '0 0 12px rgba(87, 47, 247, 0.6)' : 'none',
                transform: isJustClicked ? 'scale(0.96)' : 'scale(1)',
                transition: 'all 0.12s ease',
              }}
              onMouseEnter={(e) => {
                if (!isJustClicked) {
                  e.currentTarget.style.backgroundColor = 'rgba(87, 47, 247, 0.18)';
                  e.currentTarget.style.borderColor = 'rgba(87, 47, 247, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isJustClicked) {
                  e.currentTarget.style.backgroundColor = isPrime
                    ? 'rgba(167, 104, 212, 0.08)'
                    : 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'var(--border-primary, #2b2b35)';
                }
              }}
            >
              {token}
            </button>
          );
        })}
      </div>

      {/* Move History Strip & Action Controls */}
      {showHistory && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-primary, #2b2b35)',
          }}
        >
          {/* Action Toolbar (Undo, Reset, Copy) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handleUndo}
                disabled={moveHistoryTokens.length === 0}
                title="Undo last move"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: '600',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-primary, #2b2b35)',
                  color:
                    moveHistoryTokens.length === 0
                      ? 'var(--text-muted, #7a7a88)'
                      : 'var(--text-primary, #fafafa)',
                  cursor: moveHistoryTokens.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: moveHistoryTokens.length === 0 ? 0.5 : 1,
                  transition: 'all 0.15s ease',
                }}
              >
                <Undo2 size={13} />
                Undo
              </button>

              {allowReset && (
                <button
                  onClick={handleReset}
                  disabled={moveHistoryTokens.length === 0}
                  title="Reset to starting state"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 10px',
                    fontSize: '11px',
                    fontWeight: '600',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-primary, #2b2b35)',
                    color:
                      moveHistoryTokens.length === 0
                        ? 'var(--text-muted, #7a7a88)'
                        : 'var(--text-secondary, #a8a8b5)',
                    cursor: moveHistoryTokens.length === 0 ? 'not-allowed' : 'pointer',
                    opacity: moveHistoryTokens.length === 0 ? 0.5 : 1,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <RotateCcw size={13} />
                  Reset
                </button>
              )}
            </div>

            {moveHistoryTokens.length > 0 && (
              <button
                onClick={handleCopySequence}
                title="Copy moves to clipboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(87, 47, 247, 0.15)',
                  border: '1px solid rgba(87, 47, 247, 0.3)',
                  color: 'var(--brand-ter, #bc8be0)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {copied ? <Check size={12} color="#22c55e" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>

          {/* History sequence text container */}
          <div
            style={{
              padding: '8px 10px',
              borderRadius: '6px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              minHeight: '28px',
              maxHeight: '48px',
              overflowY: 'auto',
              fontFamily: 'var(--font-timer, monospace)',
              fontSize: '12px',
              color:
                moveHistoryTokens.length > 0
                  ? 'var(--text-primary, #fafafa)'
                  : 'var(--text-muted, #7a7a88)',
              fontStyle: moveHistoryTokens.length > 0 ? 'normal' : 'italic',
              textAlign: 'left',
              wordBreak: 'break-word',
              lineHeight: '1.4',
            }}
          >
            {moveHistoryTokens.length > 0
              ? moveHistoryTokens.join(' ')
              : 'Click any move above to start practicing...'}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotationTrainer;
