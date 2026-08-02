/**
 * Cubit Stage 2 Cube Engine & 2D Net Visualizer Interactive Demo Harness
 * 
 * Demonstrates real-time scramble generation (Stage 1), mathematical state
 * transformation (Stage 2 Engine), state validation, and 2D net rendering.
 */

import React, { useState, useMemo } from 'react';
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
    <div className="w-full max-w-xl mx-auto my-6 p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-2xl text-slate-100 backdrop-blur-md">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            Cubit Cube Engine — 2D Visualizer
          </h2>
          <p className="text-xs text-slate-400">
            Deterministic NxN move mathematics &amp; unfolded net renderer
          </p>
        </div>

        {/* Puzzle Selector Tabs */}
        <div className="flex bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          {SUPPORTED_PUZZLES.map((puzzle) => (
            <button
              key={puzzle}
              onClick={() => {
                setSelectedPuzzle(puzzle);
                setScrambleString('');
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-150 ${
                selectedPuzzle === puzzle
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {puzzle}
            </button>
          ))}
        </div>
      </div>

      {/* Control Action Bar */}
      <div className="flex items-center gap-2 my-4">
        <button
          onClick={handleGenerateScramble}
          className="flex-1 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 font-semibold text-xs text-white shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Generate Scramble
        </button>

        <button
          onClick={handleResetSolved}
          className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition-all"
        >
          Reset Solved
        </button>
      </div>

      {/* Scramble Display Bar */}
      <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 mb-4 flex items-center justify-between gap-3">
        <div className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-amber-300 tracking-wide scrollbar-none">
          {scrambleString || <span className="text-slate-500 italic">Cube is solved (No scramble applied)</span>}
        </div>
        {scrambleString && (
          <button
            onClick={handleCopyScramble}
            className="text-[11px] font-mono px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>

      {/* Engine Status Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs">
          <span className="text-slate-400">Moves Parsed:</span>
          <span className="font-mono font-semibold text-blue-400">{parsedMoves.length}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs">
          <span className="text-slate-400">Color Conservation:</span>
          <span className={`font-semibold flex items-center gap-1 ${validation.isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${validation.isValid ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
            {validation.isValid ? 'Conserved' : 'Invalid'}
          </span>
        </div>
      </div>

      {/* 2D Unfolded Net Renderer Container */}
      <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-950/90 border border-slate-800/90 shadow-inner">
        <CubeNetRenderer cubeState={cubeState} maxContainerWidth={320} />
      </div>
    </div>
  );
}

export default CubeStage2VisualizerHarness;
