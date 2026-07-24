import { useMemo } from 'react';
import { ChevronRight, ChevronLeft, Trash2 } from 'lucide-react';
import { useStore } from '../../services/store';
import { calculateAverageOfN } from '../../utils/statsHelpers';
import './layout.css';

const StatsBar = ({ isExpanded, setIsExpanded }) => {
  const solves = useStore((state) => state.solves);
  const activeSession = useStore((state) => state.activeSession);
  const sessions = useStore((state) => state.sessions);
  const selectSession = useStore((state) => state.selectSession);
  const updateSolve = useStore((state) => state.updateSolve);
  const deleteSolve = useStore((state) => state.deleteSolve);

  // Map solves list to time values
  const activeSolves = useMemo(() => {
    return solves.map(s => {
      if (s.penalty === 'PLUS_TWO') return s.time + 2;
      return s.time;
    });
  }, [solves]);

  const validSolves = useMemo(() => {
    return solves
      .filter(s => s.penalty !== 'DNF')
      .map(s => s.penalty === 'PLUS_TWO' ? s.time + 2 : s.time);
  }, [solves]);

  // Calculations
  const pb = useMemo(() => {
    return validSolves.length ? Math.min(...validSolves) : 0;
  }, [validSolves]);

  const mean = useMemo(() => {
    return validSolves.length ? (validSolves.reduce((a, b) => a + b, 0) / validSolves.length) : 0;
  }, [validSolves]);

  const ao5 = useMemo(() => {
    return calculateAverageOfN(activeSolves, 5);
  }, [activeSolves]);

  const ao12 = useMemo(() => {
    return calculateAverageOfN(activeSolves, 12);
  }, [activeSolves]);

  const formatTime = (time) => {
    if (time === null || time === undefined || isNaN(time) || time === Infinity || time === 0) return '-- : --';
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    const secPart = Math.floor(secs).toString();
    const msPart = Math.round((secs - Math.floor(secs)) * 100).toString().padStart(2, '0');
    if (mins > 0) {
      return `${mins} : ${secPart.padStart(2, '0')} : ${msPart}`;
    }
    return `${secPart} : ${msPart}`;
  };

  const handlePenaltyChange = async (id, penalty) => {
    try {
      await updateSolve(id, penalty);
    } catch (err) {
      console.error('Failed to change penalty:', err);
    }
  };

  const handleDeleteSolve = async (id) => {
    if (window.confirm('Are you sure you want to delete this solve?')) {
      try {
        await deleteSolve(id);
      } catch (err) {
        console.error('Failed to delete solve:', err);
      }
    }
  };

  const formatPuzzleType = (type) => {
    switch (type) {
      case 'THREE_BY_THREE': return '3 x 3 WCA';
      case 'TWO_BY_TWO': return '2 x 2 WCA';
      case 'FOUR_BY_FOUR': return '4 x 4 WCA';
      default: return type || '3 x 3 WCA';
    }
  };

  return (
    <div className={`app-stats-bar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button 
        className={`stats-toggle-btn ${!isExpanded ? 'collapsed' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      <div className="stats-content">
        <div className="stats-dropdowns">
          <select 
            className="stats-dropdown session-select" 
            value={activeSession?.id || ''}
            onChange={(e) => selectSession(e.target.value)}
          >
            {sessions.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select className="stats-dropdown puzzle-select" disabled value={activeSession?.puzzleType || 'THREE_BY_THREE'}>
            <option value="THREE_BY_THREE">3 x 3 WCA</option>
            <option value="TWO_BY_TWO">2 x 2 WCA</option>
            <option value="FOUR_BY_FOUR">4 x 4 WCA</option>
          </select>
        </div>

        <div className="stats-grid">
          <div className="stats-box">
            <div className="stats-box-title">P.B</div>
            <div className="stats-box-value">{formatTime(pb)}</div>
          </div>
          <div className="stats-box">
            <div className="stats-box-title">MEAN</div>
            <div className="stats-box-value">{formatTime(mean)}</div>
          </div>
          <div className="stats-box">
            <div className="stats-box-title">A012</div>
            <div className="stats-box-value">{formatTime(ao12)}</div>
          </div>
          <div className="stats-box">
            <div className="stats-box-title">A05</div>
            <div className="stats-box-value">{formatTime(ao5)}</div>
          </div>
        </div>

        <div className="stats-solves-title">Total Solves : {solves.length}</div>
        <div className="stats-divider"></div>

        <div className="stats-list">
          {solves.map((solve, index) => {
            const num = solves.length - index;
            const isPb = pb > 0 && solve.penalty !== 'DNF' && (solve.penalty === 'PLUS_TWO' ? solve.time + 2 : solve.time) === pb;
            return (
              <div className="stats-list-item" key={solve.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem' }}>
                  {num} . &nbsp;&nbsp; {solve.penalty === 'DNF' ? 'DNF' : formatTime(solve.penalty === 'PLUS_TWO' ? solve.time + 2 : solve.time)}
                </span>
                
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  {isPb && <span className="badge pb">P.B</span>}
                  
                  {solve.penalty === 'DNF' ? (
                    <span 
                      className="badge dnf" 
                      onClick={() => handlePenaltyChange(solve.id, 'NONE')} 
                      style={{ cursor: 'pointer' }}
                    >
                      DNF
                    </span>
                  ) : solve.penalty === 'PLUS_TWO' ? (
                    <span 
                      className="badge plus2" 
                      onClick={() => handlePenaltyChange(solve.id, 'NONE')} 
                      style={{ cursor: 'pointer' }}
                    >
                      +2
                    </span>
                  ) : (
                    <div className="solve-actions">
                      <button 
                        onClick={() => handlePenaltyChange(solve.id, 'PLUS_TWO')} 
                        style={{ background: 'transparent', border: '1px solid #572ff7', color: '#a0a0ff', fontSize: '0.65rem', padding: '1px 3px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        +2
                      </button>
                      <button 
                        onClick={() => handlePenaltyChange(solve.id, 'DNF')} 
                        style={{ background: 'transparent', border: '1px solid #ff4d4d', color: '#ffa0a0', fontSize: '0.65rem', padding: '1px 3px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        DNF
                      </button>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => handleDeleteSolve(solve.id)} 
                    style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '0 2px', display: 'flex', alignItems: 'center' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
