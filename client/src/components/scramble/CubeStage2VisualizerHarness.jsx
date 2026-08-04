/**
 * Cubit Stage 2 Cube Engine & 2D Net Visualizer Interactive Demo Harness
 * 
 * Demonstrates real-time scramble generation (Stage 1), mathematical state
 * transformation (Stage 2 Engine), state validation, and 2D net rendering.
 */

import { useState, useMemo } from 'react';
import { RotateCw, RotateCcw, Copy, Check } from 'lucide-react';
import { generateScramble } from '../../services/scramble/index.js';
import {
  createSolvedCube,
  applyScramble,
  validateCubeState,
  parseScramble,
} from '../../services/cubeEngine/index.js';
import CubeNetRenderer from '../../services/cubeEngine/visualizer/CubeNetRenderer.jsx';

const SUPPORTED_PUZZLES = ['2x2', '3x3', '4x4', '5x5'];

export function CubeStage2VisualizerHarness() {
  const [selectedPuzzle, setSelectedPuzzle] = useState('3x3');
  const [scrambleString, setScrambleString] = useState('');
  const [copied, setCopied] = useState(false);

  // Compute live cube state from scramble string
  const cubeState = useMemo(() => {
    if (!scrambleString.trim()) {
      return createSolvedCube(selectedPuzzle);
    }
    try {
      return applyScramble(scrambleString, selectedPuzzle);
    } catch (err) {
      console.warn('Scramble calculation fallback:', err);
      return createSolvedCube(selectedPuzzle);
    }
  }, [scrambleString, selectedPuzzle]);

  // Compute state validation metrics
  const validation = useMemo(() => validateCubeState(cubeState), [cubeState]);

  // Compute parsed moves count
  const parsedMoves = useMemo(() => {
    try {
      return parseScramble(scrambleString);
    } catch (e) {
      return [];
    }
  }, [scrambleString]);

  // Generate new scramble
  const handleGenerateScramble = () => {
    try {
      const obj = generateScramble(selectedPuzzle);
      setScrambleString(obj.scramble);
    } catch (e) {
      console.error('Failed to generate scramble:', e);
    }
  };

  // Reset cube to solved
  const handleResetSolved = () => {
    setScrambleString('');
  };

  // Copy scramble string
  const handleCopyScramble = () => {
    if (!scrambleString) return;
    navigator.clipboard.writeText(scrambleString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '620px',
        margin: '0 auto 24px auto',
        padding: '24px',
        borderRadius: '16px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
        color: 'var(--text-primary)',
        boxSizing: 'border-box',
      }}
    >
      {/* Card Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: '16px',
          borderBottom: '1px solid var(--border-primary)',
          paddingBottom: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              margin: '0 0 4px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary)',
              }}
            ></span>
            Cubit Cube Engine — 2D Visualizer
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Deterministic NxN move mathematics &amp; unfolded net renderer
          </p>
        </div>

        {/* Puzzle Selector Tabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-primary)',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid var(--border-primary)',
            gap: '4px',
          }}
        >
          {SUPPORTED_PUZZLES.map((puzzle) => (
            <button
              key={puzzle}
              onClick={() => {
                setSelectedPuzzle(puzzle);
                setScrambleString('');
              }}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor:
                  selectedPuzzle === puzzle ? 'var(--brand-primary)' : 'transparent',
                color: selectedPuzzle === puzzle ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              {puzzle}
            </button>
          ))}
        </div>
      </div>

      {/* Control Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={handleGenerateScramble}
          className="btn-primary"
          style={{
            flex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          <RotateCw size={16} />
          Generate Scramble
        </button>

        <button
          onClick={handleResetSolved}
          className="btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '12px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={15} />
          Reset Solved
        </button>
      </div>

      {/* Scramble Display Bar */}
      <div
        style={{
          padding: '14px 16px',
          borderRadius: '10px',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-primary)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div
          style={{
            flex: 1,
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            fontFamily: 'Consolas, Monaco, monospace',
            fontSize: '13px',
            color: scrambleString ? '#fde047' : 'var(--text-secondary)',
            fontStyle: scrambleString ? 'normal' : 'italic',
          }}
        >
          {scrambleString || 'Cube is solved (No scramble applied)'}
        </div>
        {scrambleString && (
          <button
            onClick={handleCopyScramble}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontFamily: 'Consolas, Monaco, monospace',
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>

      {/* Engine Status Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-primary)',
            fontSize: '13px',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>Moves Parsed:</span>
          <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--brand-primary)' }}>
            {parsedMoves.length}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-primary)',
            fontSize: '13px',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>Color Conservation:</span>
          <span
            style={{
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: validation.isValid ? '#4ade80' : '#f87171',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: validation.isValid ? '#4ade80' : '#f87171',
              }}
            ></span>
            {validation.isValid ? 'Conserved' : 'Invalid'}
          </span>
        </div>
      </div>

      {/* 2D Unfolded Net Renderer Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <CubeNetRenderer cubeState={cubeState} maxContainerWidth={320} />
      </div>
    </div>
  );
}

export default CubeStage2VisualizerHarness;
