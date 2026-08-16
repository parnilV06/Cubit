/**
 * Cubit Trainer — Reusable Interactive AlgorithmPlayer Component
 * 
 * Provides step-by-step playback, auto-play, speed controls, jump-to-step,
 * and real-time 2D net rendering using pure cubeEngine deterministic math.
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  FastForward,
  Layers,
} from 'lucide-react';
import {
  createSolvedCube,
  applyScramble,
  applyMove,
  parseScramble,
} from '../../../services/cubeEngine/index.js';
import CubeNetRenderer from '../../../services/cubeEngine/visualizer/CubeNetRenderer.jsx';

const SPEED_OPTIONS = [
  { label: '0.5x', value: 0.5, intervalMs: 1400 },
  { label: '1x', value: 1.0, intervalMs: 800 },
  { label: '1.5x', value: 1.5, intervalMs: 500 },
  { label: '2x', value: 2.0, intervalMs: 300 },
];

export function AlgorithmPlayer({
  algorithm = '',
  moves = '',
  dimension = '3x3',
  initialState,
  initialScramble = '',
  autoPlay = false,
  playbackSpeed = 1.0,
  title,
  description,
  showNotation = true,
  showSpeedControl = true,
  showStepButtons = true,
  maxContainerWidth = 280,
  onComplete,
  onStepChange,
  className = '',
  style = {},
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [selectedSpeed, setSelectedSpeed] = useState(playbackSpeed);
  const containerRef = useRef(null);
  const notationStripRef = useRef(null);

  // 1. Determine base starting cube state
  const baseStartingState = useMemo(() => {
    try {
      if (initialState) return initialState;
      if (initialScramble && initialScramble.trim()) {
        return applyScramble(initialScramble, dimension);
      }
      return createSolvedCube(dimension);
    } catch (e) {
      console.warn('AlgorithmPlayer base state error:', e);
      return createSolvedCube(dimension);
    }
  }, [initialState, initialScramble, dimension]);

  // 2. Parse algorithm tokens safely
  const effectiveAlg = algorithm || moves || '';
  const parsedMoves = useMemo(() => {
    if (!effectiveAlg || typeof effectiveAlg !== 'string') return [];
    try {
      return parseScramble(effectiveAlg);
    } catch (err) {
      console.warn('AlgorithmPlayer move parsing error:', err);
      return [];
    }
  }, [effectiveAlg]);

  const totalSteps = parsedMoves.length;

  // 3. Precompute state snapshots for every step [0 ... totalSteps]
  // Because cubeEngine is pure and fast (<0.1ms per move), precomputing allows instant,
  // zero-latency O(1) step forward, backward, and random jump!
  const stateSnapshots = useMemo(() => {
    const snapshots = [baseStartingState];
    let curr = baseStartingState;
    for (let i = 0; i < parsedMoves.length; i++) {
      try {
        curr = applyMove(curr, parsedMoves[i]);
      } catch (err) {
        console.warn(`Error applying step ${i} (${parsedMoves[i].raw}):`, err);
      }
      snapshots.push(curr);
    }
    return snapshots;
  }, [baseStartingState, parsedMoves]);

  // Reset step whenever algorithm or base state changes
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(autoPlay);
  }, [effectiveAlg, baseStartingState, autoPlay]);

  // Notify parent of step change
  useEffect(() => {
    if (onStepChange) {
      const currentMove = currentStep > 0 ? parsedMoves[currentStep - 1] : null;
      onStepChange(currentStep, totalSteps, currentMove);
    }
  }, [currentStep, totalSteps, parsedMoves, onStepChange]);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= totalSteps) {
      setIsPlaying(false);
      if (onComplete) onComplete();
      return;
    }

    const speedConfig = SPEED_OPTIONS.find((s) => s.value === selectedSpeed) || SPEED_OPTIONS[1];
    const timer = setTimeout(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= totalSteps) {
          setIsPlaying(false);
          if (onComplete) onComplete();
        }
        return next;
      });
    }, speedConfig.intervalMs);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps, selectedSpeed, onComplete]);

  // Auto-scroll active move pill inside the notation strip container only (without affecting document scroll)
  useEffect(() => {
    if (!notationStripRef.current || currentStep === 0) return;
    const activePill = notationStripRef.current.querySelector('[data-active="true"]');
    if (activePill && notationStripRef.current) {
      const container = notationStripRef.current;
      const pillLeft = activePill.offsetLeft;
      const pillWidth = activePill.offsetWidth;
      const containerWidth = container.clientWidth;
      const targetScroll = pillLeft - (containerWidth / 2) + (pillWidth / 2);
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  }, [currentStep]);

  // Navigation handlers
  const handlePlayPause = useCallback(() => {
    if (currentStep >= totalSteps && !isPlaying) {
      // If at end, loop back to start
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentStep, totalSteps, isPlaying]);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const handleStepBackward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const handleJumpToStep = useCallback((stepIndex) => {
    setIsPlaying(false);
    setCurrentStep(stepIndex);
  }, []);

  // Keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      handlePlayPause();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleStepForward();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleStepBackward();
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      handleReset();
    }
  };

  const currentCubeState = stateSnapshots[currentStep] || baseStartingState;
  const dimLabel = typeof dimension === 'number' ? `${dimension}x${dimension}` : dimension;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`cubit-trainer-algorithm-player ${className}`}
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
        outline: 'none',
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
            <Layers size={15} color="var(--brand-primary, #572ff7)" />
            {title || 'Algorithm Visualizer'}
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

        {/* Progress Step Counter */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            fontWeight: '600',
            padding: '3px 8px',
            borderRadius: '6px',
            backgroundColor: 'rgba(87, 47, 247, 0.15)',
            border: '1px solid rgba(87, 47, 247, 0.3)',
            color: 'var(--brand-ter, #bc8be0)',
          }}
        >
          <span>{currentStep}</span>
          <span style={{ opacity: 0.6 }}>/</span>
          <span>{totalSteps}</span>
        </div>
      </div>

      {/* Interactive Move Token Strip */}
      {showNotation && totalSteps > 0 && (
        <div
          ref={notationStripRef}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            padding: '6px 4px 10px 4px',
            marginBottom: '12px',
            scrollbarWidth: 'thin',
          }}
        >
          {/* Solved / Initial pill */}
          <button
            onClick={() => handleJumpToStep(0)}
            data-active={currentStep === 0}
            title="Jump to Start"
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: '600',
              fontFamily: 'monospace',
              borderRadius: '6px',
              border:
                currentStep === 0
                  ? '1.5px solid var(--brand-primary, #572ff7)'
                  : '1px solid var(--border-primary, #2b2b35)',
              backgroundColor:
                currentStep === 0
                  ? 'var(--brand-primary, #572ff7)'
                  : 'rgba(255, 255, 255, 0.04)',
              color: currentStep === 0 ? '#ffffff' : 'var(--text-secondary, #a8a8b5)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            Start
          </button>

          {/* Move token pills */}
          {parsedMoves.map((move, index) => {
            const stepNum = index + 1;
            const isCurrent = currentStep === stepNum;
            const isPast = currentStep > stepNum;

            return (
              <button
                key={`${move.raw}-${index}`}
                onClick={() => handleJumpToStep(stepNum)}
                data-active={isCurrent}
                title={`Jump to step ${stepNum}: ${move.raw}`}
                style={{
                  padding: '5px 10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  fontFamily: 'var(--font-timer, monospace)',
                  borderRadius: '6px',
                  border: isCurrent
                    ? '1.5px solid var(--brand-primary, #572ff7)'
                    : isPast
                    ? '1px solid rgba(87, 47, 247, 0.3)'
                    : '1px solid var(--border-primary, #2b2b35)',
                  backgroundColor: isCurrent
                    ? 'var(--brand-primary, #572ff7)'
                    : isPast
                    ? 'rgba(87, 47, 247, 0.12)'
                    : 'rgba(255, 255, 255, 0.04)',
                  color: isCurrent
                    ? '#ffffff'
                    : isPast
                    ? 'var(--brand-ter, #bc8be0)'
                    : 'var(--text-secondary, #a8a8b5)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isCurrent ? '0 0 10px rgba(87, 47, 247, 0.5)' : 'none',
                  transform: isCurrent ? 'scale(1.06)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                }}
              >
                {move.raw}
              </button>
            );
          })}
        </div>
      )}

      {/* 2D Unfolded Net Renderer Canvas */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '6px 0 14px 0',
        }}
      >
        <CubeNetRenderer cubeState={currentCubeState} maxContainerWidth={maxContainerWidth} />
      </div>

      {/* Controls Bar */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-primary, #2b2b35)',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {/* Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handleReset}
            title="Reset to start (R)"
            aria-label="Reset algorithm to step 0"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-primary, #2b2b35)',
              color: 'var(--text-secondary, #a8a8b5)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <RotateCcw size={14} />
          </button>

          {showStepButtons && (
            <button
              onClick={handleStepBackward}
              disabled={currentStep === 0}
              title="Step Backward (Left Arrow)"
              aria-label="Previous step"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-primary, #2b2b35)',
                color: currentStep === 0 ? 'var(--text-muted, #7a7a88)' : 'var(--text-primary, #fafafa)',
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                opacity: currentStep === 0 ? 0.5 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {/* Main Play / Pause Button */}
          <button
            onClick={handlePlayPause}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            aria-label={isPlaying ? 'Pause playback' : 'Start playback'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0 14px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'var(--brand-primary, #572ff7)',
              border: 'none',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(87, 47, 247, 0.35)',
              transition: 'all 0.15s ease',
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause' : currentStep >= totalSteps ? 'Replay' : 'Play'}</span>
          </button>

          {showStepButtons && (
            <button
              onClick={handleStepForward}
              disabled={currentStep >= totalSteps}
              title="Step Forward (Right Arrow)"
              aria-label="Next step"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-primary, #2b2b35)',
                color: currentStep >= totalSteps ? 'var(--text-muted, #7a7a88)' : 'var(--text-primary, #fafafa)',
                cursor: currentStep >= totalSteps ? 'not-allowed' : 'pointer',
                opacity: currentStep >= totalSteps ? 0.5 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {/* Speed Controls Selector */}
        {showSpeedControl && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              borderRadius: '6px',
              padding: '2px',
              border: '1px solid var(--border-primary, #2b2b35)',
              gap: '2px',
            }}
          >
            {SPEED_OPTIONS.map((spd) => (
              <button
                key={spd.value}
                onClick={() => setSelectedSpeed(spd.value)}
                style={{
                  padding: '3px 6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  fontFamily: 'monospace',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor:
                    selectedSpeed === spd.value ? 'var(--brand-primary, #572ff7)' : 'transparent',
                  color:
                    selectedSpeed === spd.value ? '#ffffff' : 'var(--text-secondary, #a8a8b5)',
                  transition: 'all 0.15s ease',
                }}
              >
                {spd.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AlgorithmPlayer;
