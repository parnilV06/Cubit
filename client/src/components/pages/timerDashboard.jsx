import { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../../services/store';
import './appStyles.css';
import cube2dNet from '../../assets/cube-2d-net-scramble.png';
import playPauseIcon from '../../assets/play-pause.svg';
import volumeIcon from '../../assets/volume.svg';

const generateScramble = () => {
  const moves = ['R', 'L', 'U', 'D', 'F', 'B'];
  const modifiers = ['', "'", '2'];
  const scramble = [];
  let lastMove = '';
  
  for (let i = 0; i < 20; i++) {
    let move = moves[Math.floor(Math.random() * moves.length)];
    while (move === lastMove) {
      move = moves[Math.floor(Math.random() * moves.length)];
    }
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
    lastMove = move;
  }
  return scramble.join(' ');
};

export default function TimerDashboard() {
  const activeSession = useStore((state) => state.activeSession);
  const solves = useStore((state) => state.solves);
  const addSolve = useStore((state) => state.addSolve);

  // Timer States
  const [timerState, setTimerState] = useState('idle'); // 'idle', 'holding', 'ready', 'running', 'saving', 'error'
  const [scramble, setScramble] = useState(generateScramble());
  const [frozenTime, setFrozenTime] = useState(0);
  const [saveError, setSaveError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Refs for timing & event handling
  const timerStateRef = useRef('idle');
  const startTimeRef = useRef(0);
  const toastTimeoutRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const holdTimeoutRef = useRef(null);
  const digitsRef = useRef(null);
  const scrambleRef = useRef(scramble);
  const activeSessionRef = useRef(activeSession);

  // Keep refs in sync
  useEffect(() => {
    scrambleRef.current = scramble;
  }, [scramble]);

  useEffect(() => {
    activeSessionRef.current = activeSession;
  }, [activeSession]);

  // Synchronize timerStateRef with timerState
  const setTimerStateAndRef = (newState) => {
    timerStateRef.current = newState;
    setTimerState(newState);
  };

  const formatTime = (timeInSeconds) => {
    if (typeof timeInSeconds !== 'number' || isNaN(timeInSeconds)) {
      return '0.000';
    }
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.floor((timeInSeconds % 1) * 1000);
    const msStr = milliseconds.toString().padStart(3, '0');
    
    if (minutes > 0) {
      const secStr = seconds.toString().padStart(2, '0');
      return `${minutes}:${secStr}.${msStr}`;
    } else {
      return `${seconds}.${msStr}`;
    }
  };

  const tick = () => {
    if (timerStateRef.current !== 'running') return;
    
    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    if (digitsRef.current) {
      digitsRef.current.textContent = formatTime(elapsed);
    }
    
    animationFrameIdRef.current = requestAnimationFrame(tick);
  };

  const startTimer = () => {
    startTimeRef.current = performance.now();
    setTimerStateAndRef('running');
    setSaveError(null);

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    animationFrameIdRef.current = requestAnimationFrame(tick);
  };

  const triggerToast = (message) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ show: true, message });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2500);
  };

  const stopTimer = async () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    const endTime = performance.now();
    const durationSeconds = (endTime - startTimeRef.current) / 1000;

    if (digitsRef.current) {
      digitsRef.current.textContent = formatTime(durationSeconds);
    }
    setFrozenTime(durationSeconds);
    setTimerStateAndRef('saving');

    const currentScramble = scrambleRef.current;
    const currentSession = activeSessionRef.current;

    if (currentSession) {
      try {
        await addSolve(durationSeconds, currentScramble);
        setTimerStateAndRef('idle');
        setScramble(generateScramble());
        if (digitsRef.current) {
          digitsRef.current.textContent = '0.000';
        }
        triggerToast(`Solve saved: ${formatTime(durationSeconds)}`);
      } catch (err) {
        console.error('Failed to save solve:', err);
        setSaveError(err.message || 'Failed to save solve');
        setTimerStateAndRef('error');
      }
    } else {
      setTimerStateAndRef('idle');
      setScramble(generateScramble());
      if (digitsRef.current) {
        digitsRef.current.textContent = '0.000';
      }
    }
  };

  const cancelHolding = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    setTimerStateAndRef('idle');
    if (digitsRef.current) {
      digitsRef.current.textContent = '0.000';
    }
  };

  const handleReset = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    setTimerStateAndRef('idle');
    setFrozenTime(0);
    setSaveError(null);
    if (digitsRef.current) {
      digitsRef.current.textContent = '0.000';
    }
  };

  const handleNewScramble = () => {
    setScramble(generateScramble());
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) {
        return;
      }

      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return;
      }

      const state = timerStateRef.current;

      if (e.code === 'Space') {
        e.preventDefault();

        if (state === 'running') {
          stopTimer();
          return;
        }

        if (state === 'idle') {
          setTimerStateAndRef('holding');
          holdTimeoutRef.current = setTimeout(() => {
            if (timerStateRef.current === 'holding') {
              setTimerStateAndRef('ready');
            }
          }, 500);
        }
      } else {
        if (state === 'running') {
          e.preventDefault();
          stopTimer();
        } else if (state === 'holding' || state === 'ready') {
          cancelHolding();
        }
      }
    };

    const handleKeyUp = (e) => {
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return;
      }

      const state = timerStateRef.current;

      if (e.code === 'Space') {
        e.preventDefault();

        if (state === 'holding') {
          cancelHolding();
        } else if (state === 'ready') {
          startTimer();
        }
      }
    };

    const handleBlur = () => {
      const state = timerStateRef.current;
      if (state === 'running') {
        stopTimer();
      } else if (state === 'holding' || state === 'ready') {
        cancelHolding();
      }
    };

    const handleWindowMouseDown = (e) => {
      if (timerStateRef.current === 'running') {
        const isResetClick = e.target && e.target.closest('.timer-btn') && !e.target.closest('.primary');
        if (isResetClick) {
          return;
        }
        e.preventDefault();
        stopTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('mousedown', handleWindowMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('mousedown', handleWindowMouseDown);
      
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Session stats calculations
  const validSolves = useMemo(() => {
    return solves
      .filter(s => s.penalty !== 'DNF')
      .map(s => s.penalty === 'PLUS_TWO' ? s.time + 2 : s.time);
  }, [solves]);

  const mean = useMemo(() => {
    return validSolves.length 
      ? (validSolves.reduce((a, b) => a + b, 0) / validSolves.length).toFixed(2) 
      : '0.00';
  }, [validSolves]);

  // State for the 4 bottom features. Max 2 can be true.
  const [selectedFeatures, setSelectedFeatures] = useState({
    visualizer: true,
    notes: false,
    session: false,
    focus: false
  });

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev => {
      const isCurrentlySelected = prev[feature];
      if (isCurrentlySelected) {
        return { ...prev, [feature]: false };
      } else {
        const selectedCount = Object.values(prev).filter(Boolean).length;
        if (selectedCount >= 2) {
          const firstSelected = Object.keys(prev).find(key => prev[key]);
          return { ...prev, [firstSelected]: false, [feature]: true };
        } else {
          return { ...prev, [feature]: true };
        }
      }
    });
  };

  return (
    <div className="dashboard-container">
      {/* Top Main Timer Area */}
      <div className="timer-main-area">
        {toast.show && (
          <div className="timer-toast">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34a853" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{toast.message}</span>
          </div>
        )}
        <div className="scramble-box">
          <div className="scramble-title">Scramble</div>
          <div className="scramble-text-container">
            <div className="scramble-text">
              {scramble}
            </div>
          </div>
        </div>

        <div className="timer-display-box">
          {timerState === 'idle' && (
            <>
              <div className="timer-digits" style={{ color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>
                0.000
              </div>
              <div className="timer-instruction">
                Hold 'SPACE' and release to start
              </div>
            </>
          )}
          {timerState === 'holding' && (
            <>
              <div className="timer-digits" style={{ color: '#fbbc05', fontSize: 'clamp(30px, 5vh, 60px)', letterSpacing: 'normal' }}>
                Hold Space...
              </div>
              <div className="timer-instruction">
                Keep holding...
              </div>
            </>
          )}
          {timerState === 'ready' && (
            <>
              <div className="timer-digits" style={{ color: '#34a853', fontSize: 'clamp(30px, 5vh, 60px)', letterSpacing: 'normal', lineHeight: 1.2, textAlign: 'center' }}>
                Ready!
              </div>
              <div className="timer-instruction" style={{ color: '#34a853' }}>
                Release to Start
              </div>
            </>
          )}
          {timerState === 'running' && (
            <>
              <div 
                ref={digitsRef} 
                className="timer-digits" 
                style={{ color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}
              >
                0.000
              </div>
              <div className="timer-instruction">
                Press any key to stop
              </div>
            </>
          )}
          {(timerState === 'saving' || timerState === 'error') && (
            <>
              <div 
                ref={digitsRef} 
                className="timer-digits" 
                style={{ color: timerState === 'error' ? '#ea4335' : '#ffffff', fontVariantNumeric: 'tabular-nums' }}
              >
                {formatTime(frozenTime)}
              </div>
              <div className="timer-instruction" style={{ color: timerState === 'error' ? '#ea4335' : 'white', fontSize: '14px', padding: '0 10px', textAlign: 'center' }}>
                {timerState === 'error' 
                  ? `Error: ${saveError || 'Failed to save solve'}. Press Reset to discard.` 
                  : 'Saving solve...'}
              </div>
            </>
          )}
        </div>

        <div className="timer-actions">
          <button 
            className="timer-btn" 
            onClick={handleReset} 
            disabled={timerState === 'saving'}
            style={{ 
              opacity: timerState === 'saving' ? 0.5 : 1, 
              cursor: timerState === 'saving' ? 'not-allowed' : 'pointer' 
            }}
          >
            Reset
          </button>
          <button 
            className="timer-btn primary" 
            onClick={handleNewScramble} 
            disabled={timerState === 'running' || timerState === 'saving' || timerState === 'holding' || timerState === 'ready'}
            style={{ 
              opacity: (timerState === 'running' || timerState === 'saving' || timerState === 'holding' || timerState === 'ready') ? 0.5 : 1, 
              cursor: (timerState === 'running' || timerState === 'saving' || timerState === 'holding' || timerState === 'ready') ? 'not-allowed' : 'pointer' 
            }}
          >
            New Scramble
          </button>
        </div>
      </div>

      {/* Bottom Features Area */}
      <div className="features-bottom-area">
        <div className="features-tabs">
          <button 
            className={`feature-tab ${selectedFeatures.visualizer ? 'active' : ''}`}
            onClick={() => handleFeatureToggle('visualizer')}
          >
            Visualizer
          </button>
          <button 
            className={`feature-tab ${selectedFeatures.notes ? 'active' : ''}`}
            onClick={() => handleFeatureToggle('notes')}
          >
            Notes
          </button>
          <button 
            className={`feature-tab ${selectedFeatures.session ? 'active' : ''}`}
            onClick={() => handleFeatureToggle('session')}
          >
            Session
          </button>
          <button 
            className={`feature-tab ${selectedFeatures.focus ? 'active' : ''}`}
            onClick={() => handleFeatureToggle('focus')}
          >
            Focus Mode
          </button>
        </div>

        <div className="features-content">
          {selectedFeatures.visualizer && (
            <div className="feature-panel visualizer-panel">
              <div className="feature-panel-title">Scrambled State</div>
              <img src={cube2dNet} alt="Cube 2D Net" className="cube-net-img" />
            </div>
          )}

          {selectedFeatures.notes && (
            <div className="feature-panel notes-panel">
              <div className="feature-panel-title">Session Notes</div>
              <textarea placeholder="Type your notes here..." className="notes-textarea"></textarea>
            </div>
          )}

          {selectedFeatures.session && (
            <div className="feature-panel session-panel">
              <div className="feature-panel-title">Session Details</div>
              <div className="session-details-content">
                <p>Current Session: {activeSession?.name || 'Default Session'}</p>
                <p>Solves: {solves.length}</p>
                <p>Mean: {mean}</p>
              </div>
            </div>
          )}

          {selectedFeatures.focus && (
            <div className="feature-panel focus-panel">
              <div className="focus-title">Deep Focus Synth Music</div>
              <div className="focus-progress-container">
                <div className="focus-progress-bar">
                  <div className="focus-progress-fill" style={{width: '50%'}}></div>
                </div>
                <div className="focus-time">2:00 / 4:00</div>
              </div>
              <div className="focus-controls">
                <select className="track-select">
                  <option>choose track...</option>
                </select>
                <button className="icon-btn"><img src={playPauseIcon} alt="Play" /></button>
                <button className="icon-btn"><img src={volumeIcon} alt="Volume" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
