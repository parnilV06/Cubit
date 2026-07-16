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
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [scramble, setScramble] = useState(generateScramble());

  const startTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const startTimer = () => {
    startTimeRef.current = Date.now();
    setIsRunning(true);
    timerIntervalRef.current = setInterval(() => {
      setTime((Date.now() - startTimeRef.current) / 1000);
    }, 10);
  };

  const stopTimer = async () => {
    clearInterval(timerIntervalRef.current);
    setIsRunning(false);
    const finalTime = (Date.now() - startTimeRef.current) / 1000;
    setTime(finalTime);
    
    if (activeSession) {
      try {
        await addSolve(finalTime, scramble);
      } catch (err) {
        console.error('Failed to save solve:', err);
      }
    }
    setScramble(generateScramble());
  };

  useEffect(() => {
    let holdTimeout = null;

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) {
          stopTimer();
          return;
        }
        if (!isHolding && !isReady) {
          setIsHolding(true);
          holdTimeout = setTimeout(() => {
            setIsReady(true);
          }, 350); // 350ms hold to turn ready (green)
        }
      } else {
        if (isRunning) {
          stopTimer();
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        clearTimeout(holdTimeout);
        setIsHolding(false);
        if (isReady) {
          setIsReady(false);
          startTimer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearTimeout(holdTimeout);
      clearInterval(timerIntervalRef.current);
    };
  }, [isRunning, isHolding, isReady, scramble, activeSession]);

  const formatTime = (t) => {
    const mins = Math.floor(t / 60);
    const secs = t % 60;
    const secPart = Math.floor(secs).toString();
    const msPart = Math.round((secs - Math.floor(secs)) * 100).toString().padStart(2, '0');
    if (mins > 0) {
      return `${mins} : ${secPart.padStart(2, '0')} : ${msPart}`;
    }
    return `${secPart} : ${msPart}`;
  };

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
        <div className="scramble-box">
          <div className="scramble-title">Scramble</div>
          <div className="scramble-text-container">
            <div className="scramble-text">
              {scramble}
            </div>
          </div>
        </div>

        <div className="timer-display-box">
          <div 
            className="timer-digits"
            style={{ 
              color: isReady ? '#34a853' : isHolding ? '#fbbc05' : '#ffffff',
              fontVariantNumeric: 'tabular-nums',
              transition: 'color 0.15s ease'
            }}
          >
            {formatTime(time)}
          </div>
          <div className="timer-instruction">
            {isRunning ? 'Press any key to stop' : isReady ? 'Release SPACE to start' : isHolding ? 'Keep holding...' : "Hold 'SPACE' and release to start"}
          </div>
        </div>

        <div className="timer-actions">
          <button className="timer-btn" onClick={() => setTime(0)}>Reset</button>
          <button className="timer-btn primary" onClick={() => setScramble(generateScramble())}>New Scramble</button>
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
