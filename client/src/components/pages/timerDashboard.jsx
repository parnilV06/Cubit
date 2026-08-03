import { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Pencil, X, Play, Pause, Volume2, VolumeX, Repeat, Check, Trash, Trash2 } from 'lucide-react';
import { useStore } from '../../services/store';
import { useFocusStore } from '../../services/focusStore';
import CubeNetRenderer from '../../services/cubeEngine/visualizer/CubeNetRenderer.jsx';
import SessionDeleteModal from '../ui/SessionDeleteModal.jsx';
import './appStyles.css';

export default function TimerDashboard() {
  const activeSession = useStore((state) => state.activeSession);
  const activeScramble = useStore((state) => state.activeScramble);
  const generateNewScramble = useStore((state) => state.generateNewScramble);
  const sessions = useStore((state) => state.sessions);
  const solves = useStore((state) => state.solves);
  const addSolve = useStore((state) => state.addSolve);
  const createSession = useStore((state) => state.createSession);
  const renameSession = useStore((state) => state.renameSession);
  const deleteSession = useStore((state) => state.deleteSession);
  const notes = useStore((state) => state.notes);
  const addNote = useStore((state) => state.addNote);
  const deleteNoteAction = useStore((state) => state.deleteNoteAction);

  // Auto-generate active scramble if missing or session loaded
  useEffect(() => {
    if (activeSession && !activeScramble) {
      generateNewScramble();
    }
  }, [activeSession, activeScramble, generateNewScramble]);

  // Timer States
  const [timerState, setTimerState] = useState('idle'); // 'idle', 'holding', 'ready', 'running', 'saving', 'error'
  const [frozenTime, setFrozenTime] = useState(0);
  const [saveError, setSaveError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Create Session Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [selectedPuzzleType, setSelectedPuzzleType] = useState('THREE_BY_THREE');
  const [modalError, setModalError] = useState('');
  const [isSubmittingSession, setIsSubmittingSession] = useState(false);

  // Rename Session Modal States
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameSessionName, setRenameSessionName] = useState('');
  const [renameModalError, setRenameModalError] = useState('');
  const [isSubmittingRename, setIsSubmittingRename] = useState(false);

  // Delete Session Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = () => {
    if (!activeSession) return;
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDeleteSession = async (sessionId) => {
    try {
      await deleteSession(sessionId);
      handleReset();
      triggerToast('Session deleted');
    } catch (err) {
      console.error('Failed to delete session:', err);
      throw err;
    }
  };

  // Notes Local States & Handlers
  const [noteText, setNoteText] = useState('');

  const handleSaveNote = async () => {
    const trimmed = noteText.trim();
    if (!trimmed) return;
    try {
      await addNote(trimmed);
      setNoteText('');
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNoteAction(id);
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  // Focus Mode Audio Store State
  const focusTracks = useFocusStore((state) => state.tracks);
  const currentTrack = useFocusStore((state) => state.currentTrack);
  const isPlaying = useFocusStore((state) => state.isPlaying);
  const currentTime = useFocusStore((state) => state.currentTime);
  const duration = useFocusStore((state) => state.duration);
  const volume = useFocusStore((state) => state.volume);
  const isMuted = useFocusStore((state) => state.isMuted);
  const isLooping = useFocusStore((state) => state.isLooping);
  const audioError = useFocusStore((state) => state.audioError);
  const fetchFocusTracks = useFocusStore((state) => state.fetchTracks);
  const selectTrack = useFocusStore((state) => state.selectTrack);
  const togglePlay = useFocusStore((state) => state.togglePlay);
  const seekFocusAudio = useFocusStore((state) => state.seek);
  const setVolume = useFocusStore((state) => state.setVolume);
  const toggleMute = useFocusStore((state) => state.toggleMute);
  const toggleLoop = useFocusStore((state) => state.toggleLoop);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    fetchFocusTracks();
  }, [fetchFocusTracks]);

  const formatAudioTime = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const trackDuration = duration || currentTrack?.duration || 0;
    if (width > 0 && trackDuration > 0) {
      const percentage = clickX / width;
      seekFocusAudio(percentage * trackDuration);
    }
  };

  const effectiveDuration = duration || currentTrack?.duration || 0;
  const progressPercent = effectiveDuration > 0 ? Math.min(100, Math.max(0, (currentTime / effectiveDuration) * 100)) : 0;

  // Refs for timing & event handling
  const timerStateRef = useRef('idle');
  const startTimeRef = useRef(0);
  const toastTimeoutRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const holdTimeoutRef = useRef(null);
  const digitsRef = useRef(null);
  const activeScrambleRef = useRef(activeScramble);
  const activeSessionRef = useRef(activeSession);
  const isAnyModalOpenRef = useRef(false);

  // Keep refs in sync
  useEffect(() => {
    activeScrambleRef.current = activeScramble;
  }, [activeScramble]);

  useEffect(() => {
    activeSessionRef.current = activeSession;
  }, [activeSession]);

  useEffect(() => {
    isAnyModalOpenRef.current = isCreateModalOpen || isRenameModalOpen || isDeleteModalOpen;
  }, [isCreateModalOpen, isRenameModalOpen, isDeleteModalOpen]);

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

    const currentScrambleText = activeScrambleRef.current?.scramble || '';
    const currentSession = activeSessionRef.current;

    if (currentSession) {
      try {
        await addSolve(durationSeconds, currentScrambleText);
        setTimerStateAndRef('idle');
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
      generateNewScramble();
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
    generateNewScramble();
  };

  // Helper: Auto-calculate next session name (e.g. Session 7)
  const calculateNextSessionName = (sessionsList) => {
    if (!sessionsList || sessionsList.length === 0) return 'Session 1';
    let maxNum = 0;
    sessionsList.forEach((s) => {
      if (s.name) {
        const match = s.name.match(/^Session\s+(\d+)$/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
    });
    const nextNum = maxNum > 0 ? maxNum + 1 : sessionsList.length + 1;
    return `Session ${nextNum}`;
  };

  // Handlers for Create Session Modal
  const handleOpenCreateSessionModal = () => {
    const defaultName = calculateNextSessionName(sessions);
    setNewSessionName(defaultName);
    setSelectedPuzzleType(activeSession?.puzzleType || 'THREE_BY_THREE');
    setModalError('');
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateSessionModal = () => {
    setIsCreateModalOpen(false);
    setModalError('');
  };

  const handleCreateSessionSubmit = async (e) => {
    if (e) e.preventDefault();
    const trimmedName = newSessionName.trim();
    if (!trimmedName) {
      setModalError('Session name cannot be empty.');
      return;
    }

    const isDuplicate = sessions.some(
      (s) => s.name && s.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      setModalError('A session with this name already exists.');
      return;
    }

    setIsSubmittingSession(true);
    setModalError('');
    try {
      await createSession(trimmedName, selectedPuzzleType);
      setIsCreateModalOpen(false);
      handleReset();
      triggerToast(`Switched to new session: ${trimmedName}`);
    } catch (err) {
      console.error('Failed to create session:', err);
      setModalError(
        err.response?.data?.message || err.message || 'Failed to create session'
      );
    } finally {
      setIsSubmittingSession(false);
    }
  };

  // Handlers for Rename Session Modal
  const handleOpenRenameModal = () => {
    if (!activeSession) return;
    setRenameSessionName(activeSession.name || '');
    setRenameModalError('');
    setIsRenameModalOpen(true);
  };

  const handleCloseRenameModal = () => {
    setIsRenameModalOpen(false);
    setRenameModalError('');
  };

  const handleRenameSessionSubmit = async (e) => {
    if (e) e.preventDefault();
    const trimmedName = renameSessionName.trim();
    if (!trimmedName) {
      setRenameModalError('Session name cannot be empty.');
      return;
    }
    if (trimmedName === activeSession?.name) {
      setIsRenameModalOpen(false);
      return;
    }

    const isDuplicate = sessions.some(
      (s) => s.id !== activeSession?.id && s.name && s.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      setRenameModalError('A session with this name already exists.');
      return;
    }

    setIsSubmittingRename(true);
    setRenameModalError('');
    try {
      await renameSession(activeSession.id, trimmedName);
      setIsRenameModalOpen(false);
      triggerToast(`Session renamed to: ${trimmedName}`);
    } catch (err) {
      console.error('Failed to rename session:', err);
      setRenameModalError(
        err.response?.data?.message || err.message || 'Failed to rename session'
      );
    } finally {
      setIsSubmittingRename(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat || isAnyModalOpenRef.current) {
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
      if (isAnyModalOpenRef.current) {
        return;
      }

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

  // State for bottom features
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

        {/* Scramble Display Box */}
        <div className="scramble-box">
          <div className="scramble-title">Scramble</div>
          <div className="scramble-text-container">
            <div className="scramble-text">
              {activeScramble?.scramble || 'Loading scramble...'}
            </div>
          </div>
        </div>

        {/* Timer Display Box */}
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

        {/* Action Buttons */}
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
          {/* Live Stage 2 Net Visualizer */}
          {selectedFeatures.visualizer && (
            <div className="feature-panel visualizer-panel">
              <div className="feature-panel-title">Scrambled State</div>
              <div className="visualizer-net-container">
                <CubeNetRenderer 
                  netData={activeScramble?.visualization} 
                  cubeState={activeScramble?.cubeState} 
                  maxContainerWidth={240} 
                />
              </div>
            </div>
          )}

          {selectedFeatures.notes && (
            <div className="feature-panel notes-panel">
              <div className="notes-scroll-wrapper">
                <div className="feature-panel-title">Session Notes</div>
                <div className="notes-input-wrapper">
                  <textarea 
                    placeholder="Type your notes here..." 
                    className="notes-textarea"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  ></textarea>
                  {noteText.trim() && (
                    <button className="save-note-btn" onClick={handleSaveNote} title="Save Note">
                      <Check size={14} />
                    </button>
                  )}
                </div>
                <div className="notes-list-container">
                  {notes && notes.length > 0 ? (
                    notes.map(note => (
                      <div key={note.id} className="note-item">
                        <div className="note-body">
                          <p className="note-content">{note.content}</p>
                          <span className="note-timestamp">
                            {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <button className="delete-note-btn" onClick={() => handleDeleteNote(note.id)} title="Delete Note">
                          <Trash size={12} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="no-notes-placeholder">No notes for this session.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedFeatures.session && (
            <div className="feature-panel session-panel">
              <div className="session-panel-header">
                <h4 className="session-panel-title">Session Management</h4>
                {activeSession && (
                  <button
                    className="session-delete-icon-btn"
                    onClick={handleOpenDeleteModal}
                    title="Delete Current Session"
                    aria-label="Delete Current Session"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <div className="session-details-content">
                <p>
                  <span className="label">Current Session:</span>{' '}
                  <span className="val">{activeSession?.name || 'Default Session'}</span>
                </p>
                <p>
                  <span className="label">Solves:</span>{' '}
                  <span className="val">{solves.length}</span>
                </p>
                <p>
                  <span className="label">Mean:</span>{' '}
                  <span className="val">{mean}</span>
                </p>
              </div>
              <div className="session-actions">
                <button
                  className="session-action-btn primary"
                  onClick={handleOpenCreateSessionModal}
                >
                  <Plus size={14} /> New Session
                </button>
                <button
                  className="session-action-btn secondary"
                  onClick={handleOpenRenameModal}
                  disabled={!activeSession}
                >
                  <Pencil size={14} /> Rename
                </button>
              </div>
            </div>
          )}

          {selectedFeatures.focus && (
            <div className="feature-panel focus-panel">
              <div className="focus-title">{currentTrack?.title || 'Deep Focus Synth Music'}</div>
              {audioError && <div className="focus-error-message">{audioError}</div>}
              <div className="focus-progress-container">
                <div 
                  className="focus-progress-bar" 
                  onClick={handleProgressClick}
                  style={{ cursor: 'pointer' }}
                  title="Click to seek"
                >
                  <div className="focus-progress-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="focus-time">
                  {formatAudioTime(currentTime)} / {formatAudioTime(effectiveDuration)}
                </div>
              </div>
              <div className="focus-controls">
                <select 
                  className="track-select"
                  value={currentTrack?.id || ''}
                  onChange={(e) => selectTrack(e.target.value)}
                >
                  {focusTracks.length === 0 ? (
                    <option value="">choose track...</option>
                  ) : (
                    focusTracks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.category})
                      </option>
                    ))
                  )}
                </select>

                <button 
                  className="icon-btn" 
                  onClick={togglePlay}
                  title={isPlaying ? "Pause" : "Play"}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={20} color="white" /> : <Play size={20} color="white" />}
                </button>

                <div 
                  className="focus-volume-wrapper"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <button 
                    className="icon-btn" 
                    onClick={toggleMute}
                    title={isMuted ? "Unmute" : "Mute"}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? <VolumeX size={20} color="white" /> : <Volume2 size={20} color="white" />}
                  </button>
                  {showVolumeSlider && (
                    <input 
                      type="range" 
                      className="focus-volume-slider" 
                      min="0" 
                      max="1" 
                      step="0.05" 
                      value={isMuted ? 0 : volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                    />
                  )}
                </div>

                <button 
                  className="icon-btn"
                  onClick={toggleLoop}
                  title={isLooping ? "Looping Enabled" : "Looping Disabled"}
                  aria-label="Toggle Loop"
                >
                  <Repeat size={18} color={isLooping ? "var(--brand-primary, #572ff7)" : "rgba(255,255,255,0.5)"} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Session Modal */}
      {isCreateModalOpen && (
        <div className="session-modal-overlay" onClick={handleCloseCreateSessionModal}>
          <div className="session-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="session-modal-header">
              <h3>Create New Session</h3>
              <button
                className="session-modal-close-btn"
                onClick={handleCloseCreateSessionModal}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSessionSubmit} className="session-modal-form">
              {modalError && <div className="session-modal-error">{modalError}</div>}

              <div className="session-form-group">
                <label htmlFor="session-name-input">Session Name</label>
                <input
                  id="session-name-input"
                  type="text"
                  className="session-input"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="e.g. Session 7"
                  autoFocus
                />
              </div>

              <div className="session-form-group">
                <label htmlFor="puzzle-type-select">Puzzle Type</label>
                <select
                  id="puzzle-type-select"
                  className="session-select"
                  value={selectedPuzzleType}
                  onChange={(e) => setSelectedPuzzleType(e.target.value)}
                >
                  <option value="THREE_BY_THREE">3 × 3 WCA</option>
                  <option value="TWO_BY_TWO">2 × 2 WCA</option>
                  <option value="FOUR_BY_FOUR">4 × 4 WCA</option>
                  <option value="FIVE_BY_FIVE">5 × 5 WCA</option>
                </select>
              </div>

              <div className="session-modal-actions">
                <button
                  type="button"
                  className="session-modal-btn cancel"
                  onClick={handleCloseCreateSessionModal}
                  disabled={isSubmittingSession}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="session-modal-btn primary"
                  disabled={isSubmittingSession}
                >
                  {isSubmittingSession ? 'Creating...' : 'Create Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rename Session Modal */}
      {isRenameModalOpen && (
        <div className="session-modal-overlay" onClick={handleCloseRenameModal}>
          <div className="session-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="session-modal-header">
              <h3>Rename Session</h3>
              <button
                className="session-modal-close-btn"
                onClick={handleCloseRenameModal}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRenameSessionSubmit} className="session-modal-form">
              {renameModalError && <div className="session-modal-error">{renameModalError}</div>}

              <div className="session-form-group">
                <label htmlFor="rename-session-input">Session Name</label>
                <input
                  id="rename-session-input"
                  type="text"
                  className="session-input"
                  value={renameSessionName}
                  onChange={(e) => setRenameSessionName(e.target.value)}
                  placeholder="Enter new name"
                  autoFocus
                />
              </div>

              <div className="session-modal-actions">
                <button
                  type="button"
                  className="session-modal-btn cancel"
                  onClick={handleCloseRenameModal}
                  disabled={isSubmittingRename}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="session-modal-btn primary"
                  disabled={isSubmittingRename}
                >
                  {isSubmittingRename ? 'Saving...' : 'Rename Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Session Delete Confirmation Modal */}
      <SessionDeleteModal
        isOpen={isDeleteModalOpen}
        session={activeSession}
        isOnlySession={sessions.length <= 1}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteSession}
      />
    </div>
  );
}
