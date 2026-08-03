import { useState, useEffect, useMemo } from 'react';
import { X, Play } from 'lucide-react';
import { solveAPI } from '../../services/api';
import { calculateAverageOfN } from '../../utils/statsHelpers';
import { formatPuzzleDisplay } from '../../services/scramble/index';
import './stats.css';

export default function SessionDetailsModal({
  session,
  isOpen,
  onClose,
  onOpenInTimer,
}) {
  const [solves, setSolves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !session?.id) return;

    let isMounted = true;
    const fetchSessionSolves = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await solveAPI.getSolves(session.id);
        if (isMounted) {
          const rawSolves = response.data?.solves || response.solves || [];
          const mappedSolves = rawSolves.map((s) => ({
            ...s,
            time: s.time / 1000,
          }));
          setSolves(mappedSolves);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch session solves for details:', err);
          setError(err.message || 'Failed to load solves');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSessionSolves();
    return () => {
      isMounted = false;
    };
  }, [isOpen, session?.id]);

  // Math Calculations (same source of truth rules as StatsBar)
  const activeSolves = useMemo(() => {
    return solves.map((s) => {
      if (s.penalty === 'PLUS_TWO') return s.time + 2;
      return s.time;
    });
  }, [solves]);

  const validSolves = useMemo(() => {
    return solves
      .filter((s) => s.penalty !== 'DNF')
      .map((s) => (s.penalty === 'PLUS_TWO' ? s.time + 2 : s.time));
  }, [solves]);

  const pb = useMemo(() => {
    return validSolves.length ? Math.min(...validSolves) : null;
  }, [validSolves]);

  const mean = useMemo(() => {
    return validSolves.length
      ? validSolves.reduce((a, b) => a + b, 0) / validSolves.length
      : null;
  }, [validSolves]);

  const ao5 = useMemo(() => {
    return calculateAverageOfN(activeSolves, 5);
  }, [activeSolves]);

  const ao12 = useMemo(() => {
    return calculateAverageOfN(activeSolves, 12);
  }, [activeSolves]);

  const formatTimeDisplay = (timeSec) => {
    if (timeSec === null || timeSec === undefined || isNaN(timeSec) || timeSec === Infinity) {
      return '--';
    }
    const mins = Math.floor(timeSec / 60);
    const secs = (timeSec % 60).toFixed(2);
    if (mins > 0) {
      const secStr = Math.floor(timeSec % 60).toString().padStart(2, '0');
      const msStr = Math.round((timeSec % 1) * 100).toString().padStart(2, '0');
      return `${mins}:${secStr}.${msStr}s`;
    }
    return `${secs}s`;
  };

  const formatSolveTime = (solve) => {
    if (solve.penalty === 'DNF') return 'DNF';
    const effectiveTime = solve.penalty === 'PLUS_TWO' ? solve.time + 2 : solve.time;
    const mins = Math.floor(effectiveTime / 60);
    const secs = (effectiveTime % 60).toFixed(2);
    if (mins > 0) {
      const secStr = Math.floor(effectiveTime % 60).toString().padStart(2, '0');
      const msStr = Math.round((effectiveTime % 1) * 100).toString().padStart(2, '0');
      return `${mins}:${secStr}.${msStr}`;
    }
    return secs;
  };

  if (!isOpen || !session) return null;

  return (
    <div className="session-modal-overlay" onClick={onClose}>
      <div
        className="session-modal-content details-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', width: '100%' }}
      >
        {/* Header */}
        <div className="session-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ margin: 0 }}>{session.name || session.sessionName}</h3>
              <span className="puzzle-capsule" style={{ fontSize: '11px', padding: '3px 8px' }}>
                {formatPuzzleDisplay(session.puzzleType)}
              </span>
            </div>
            {session.createdAt && (
              <span style={{ fontSize: '12px', color: '#777788', marginTop: '4px', display: 'block' }}>
                Created {new Date(session.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <button className="session-modal-close-btn" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        {/* KPI Grid */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '4px' }}>
          <div className="stats-box">
            <div className="stats-box-title">P.B</div>
            <div className="stats-box-value">{formatTimeDisplay(pb)}</div>
          </div>
          <div className="stats-box">
            <div className="stats-box-title">MEAN</div>
            <div className="stats-box-value">{formatTimeDisplay(mean)}</div>
          </div>
          <div className="stats-box">
            <div className="stats-box-title">AO5</div>
            <div className="stats-box-value">{formatTimeDisplay(ao5)}</div>
          </div>
          <div className="stats-box">
            <div className="stats-box-title">AO12</div>
            <div className="stats-box-value">{formatTimeDisplay(ao12)}</div>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: '#a8a8b5', fontWeight: 500 }}>
          Total Solves: <span style={{ color: '#fff' }}>{solves.length}</span>
        </div>

        <div className="stats-divider" style={{ margin: '4px 0' }}></div>

        {/* Solves List */}
        <div className="details-solves-container" style={{ maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '13px' }}>
              Loading historical solves...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#ea4335', fontSize: '13px' }}>
              {error}
            </div>
          ) : solves.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666', fontSize: '13px', fontStyle: 'italic' }}>
              No solves recorded in this session.
            </div>
          ) : (
            <div className="stats-list">
              {[...solves].reverse().map((solve, index) => {
                const solveNum = solves.length - index;
                const effectiveTime = solve.penalty === 'PLUS_TWO' ? solve.time + 2 : solve.time;
                const isPb = pb > 0 && solve.penalty !== 'DNF' && Math.abs(effectiveTime - pb) < 0.001;

                return (
                  <div
                    key={solve.id || index}
                    className="stats-list-item"
                    style={{
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#0f0f13',
                      marginBottom: '6px',
                      border: '1px solid #272730'
                    }}
                  >
                    <span style={{ fontSize: '13px', color: '#ddd', fontFamily: 'Rubik, sans-serif' }}>
                      <strong style={{ color: '#777', width: '32px', display: 'inline-block' }}>
                        {solveNum}.
                      </strong>
                      {formatSolveTime(solve)}
                    </span>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {isPb && <span className="badge pb">P.B</span>}
                      {solve.penalty === 'PLUS_TWO' && <span className="badge plus2">+2</span>}
                      {solve.penalty === 'DNF' && <span className="badge dnf">DNF</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="session-modal-actions" style={{ marginTop: '10px' }}>
          <button type="button" className="session-modal-btn cancel" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="session-modal-btn primary"
            onClick={() => {
              onOpenInTimer(session.id);
              onClose();
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Play size={14} /> Open in Timer
          </button>
        </div>
      </div>
    </div>
  );
}
