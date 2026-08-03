import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Pencil, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../services/store';
import { formatPuzzleDisplay } from '../../services/scramble/index';
import SessionDeleteModal from '../ui/SessionDeleteModal';
import SessionDetailsModal from './SessionDetailsModal';

const RecentSessions = ({ sessions, refetchDashboard }) => {
  const navigate = useNavigate();
  const allStoreSessions = useStore((state) => state.sessions);
  const renameSession = useStore((state) => state.renameSession);
  const deleteSession = useStore((state) => state.deleteSession);
  const selectSession = useStore((state) => state.selectSession);

  // States
  const [openMenuId, setOpenMenuId] = useState(null);
  const [detailsSession, setDetailsSession] = useState(null);
  
  // Pagination State
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Rename Modal State
  const [renameSessionObj, setRenameSessionObj] = useState(null);
  const [renameName, setRenameName] = useState('');
  const [renameError, setRenameError] = useState('');
  const [isSubmittingRename, setIsSubmittingRename] = useState(false);

  // Delete Modal State
  const [deleteSessionObj, setDeleteSessionObj] = useState(null);

  const containerRef = useRef(null);

  // Close 3-dot menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Merge allStoreSessions with stats API prop so ALL sessions are always included
  const effectiveSessions = useMemo(() => {
    const statsMap = new Map((sessions || []).map(s => [s.id, s]));
    
    // Sort all store sessions chronologically (newest first)
    const sortedStore = [...allStoreSessions].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    if (sortedStore.length === 0) {
      return sessions || [];
    }

    return sortedStore.map((s) => {
      const statsObj = statsMap.get(s.id);
      if (statsObj) {
        return statsObj;
      }
      return {
        id: s.id,
        name: s.name,
        puzzleType: s.puzzleType || 'THREE_BY_THREE',
        best: '--',
        mean: '--',
        ao5: '--',
        ao12: '--',
        date: new Date(s.createdAt).toLocaleDateString(),
        createdAt: s.createdAt
      };
    });
  }, [allStoreSessions, sessions]);

  const totalPages = Math.max(1, Math.ceil((effectiveSessions?.length || 0) / ITEMS_PER_PAGE));

  // Adjust page if totalPages changes (e.g. after session deletion)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [effectiveSessions?.length, totalPages, currentPage]);

  if (!effectiveSessions || effectiveSessions.length === 0) return null;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(effectiveSessions.length, currentPage * ITEMS_PER_PAGE);
  const currentSessions = effectiveSessions.slice(startIndex, endIndex);

  // Handlers
  const handleRowClick = (row) => {
    const foundSession = allStoreSessions.find(s => s.id === row.id) || {
      id: row.id,
      name: row.name,
      puzzleType: row.puzzleType || 'THREE_BY_THREE',
      createdAt: row.createdAt
    };
    setDetailsSession(foundSession);
  };

  const handleToggleMenu = (e, rowId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === rowId ? null : rowId);
  };

  const handleOpenRename = (e, row) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setRenameSessionObj(row);
    setRenameName(row.name || '');
    setRenameError('');
  };

  const handleOpenDelete = (e, row) => {
    e.stopPropagation();
    setOpenMenuId(null);
    const foundSession = allStoreSessions.find(s => s.id === row.id) || {
      id: row.id,
      name: row.name,
      puzzleType: row.puzzleType || 'THREE_BY_THREE',
      createdAt: row.createdAt
    };
    setDeleteSessionObj(foundSession);
  };

  const handleRenameSubmit = async (e) => {
    if (e) e.preventDefault();
    const trimmed = renameName.trim();
    if (!trimmed) {
      setRenameError('Session name cannot be empty.');
      return;
    }

    setIsSubmittingRename(true);
    setRenameError('');
    try {
      await renameSession(renameSessionObj.id, trimmed);
      setRenameSessionObj(null);
      if (refetchDashboard) await refetchDashboard();
    } catch (err) {
      console.error('Failed to rename session:', err);
      setRenameError(err.response?.data?.message || err.message || 'Failed to rename session');
    } finally {
      setIsSubmittingRename(false);
    }
  };

  const handleConfirmDelete = async (sessionId) => {
    try {
      await deleteSession(sessionId);
      if (refetchDashboard) await refetchDashboard();
    } catch (err) {
      console.error('Failed to delete session:', err);
      throw err;
    }
  };

  const handleOpenInTimer = async (sessionId) => {
    try {
      await selectSession(sessionId);
      navigate('/app');
    } catch (err) {
      console.error('Failed to switch session to Timer:', err);
    }
  };

  return (
    <div className="recent-sessions-card" ref={containerRef}>
      <h3>Sessions</h3>
      <table className="sessions-table">
        <thead>
          <tr>
            <th>Session name</th>
            <th>Puzzle</th>
            <th>Best Time</th>
            <th>A05</th>
            <th>A012</th>
            <th>Mean</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentSessions.map((row, i) => {
            const isMenuOpen = openMenuId === (row.id || i);

            return (
              <tr 
                key={row.id || i} 
                className="session-row"
                onClick={() => handleRowClick(row)}
              >
                <td style={{ fontWeight: 500 }}>{row.name}</td>
                <td>{formatPuzzleDisplay(row.puzzleType)}</td>
                <td>{row.best}{row.best !== '--' && 's'}</td>
                <td>{row.ao5}{row.ao5 !== '--' && 's'}</td>
                <td>{row.ao12}{row.ao12 !== '--' && 's'}</td>
                <td>{row.mean}{row.mean !== '--' && 's'}</td>
                <td>{row.date}</td>
                
                {/* 3-Dot Action Cell */}
                <td className="menu-cell" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="session-menu-btn"
                    onClick={(e) => handleToggleMenu(e, row.id || i)}
                    title="Session Options"
                    aria-label="Session Options"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {isMenuOpen && (
                    <div className="session-menu-dropdown">
                      <button
                        className="session-menu-item"
                        onClick={(e) => handleOpenRename(e, row)}
                      >
                        <Pencil size={13} />
                        <span>Rename Session</span>
                      </button>
                      <button
                        className="session-menu-item destructive"
                        onClick={(e) => handleOpenDelete(e, row)}
                      >
                        <Trash2 size={13} />
                        <span>Delete Session</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {effectiveSessions.length > 0 && (
        <div className="sessions-pagination-footer">
          <div className="pagination-info">
            Showing {startIndex + 1}–{endIndex} of {effectiveSessions.length} sessions
          </div>
          <div className="sessions-pagination-controls">
            <button
              type="button"
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              title="Previous Page"
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              title="Next Page"
              aria-label="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Session Details Modal */}
      {detailsSession && (
        <SessionDetailsModal
          isOpen={!!detailsSession}
          session={detailsSession}
          onClose={() => setDetailsSession(null)}
          onOpenInTimer={handleOpenInTimer}
        />
      )}

      {/* Rename Modal */}
      {renameSessionObj && (
        <div className="session-modal-overlay" onClick={() => setRenameSessionObj(null)}>
          <div className="session-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="session-modal-header">
              <h3>Rename Session</h3>
              <button
                className="session-modal-close-btn"
                onClick={() => setRenameSessionObj(null)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRenameSubmit} className="session-modal-form">
              {renameError && <div className="session-modal-error">{renameError}</div>}

              <div className="session-form-group">
                <label htmlFor="recent-rename-input">Session Name</label>
                <input
                  id="recent-rename-input"
                  type="text"
                  className="session-input"
                  value={renameName}
                  onChange={(e) => setRenameName(e.target.value)}
                  placeholder="Enter new name"
                  autoFocus
                />
              </div>

              <div className="session-modal-actions">
                <button
                  type="button"
                  className="session-modal-btn cancel"
                  onClick={() => setRenameSessionObj(null)}
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

      {/* Delete Confirmation Modal */}
      {deleteSessionObj && (
        <SessionDeleteModal
          isOpen={!!deleteSessionObj}
          session={deleteSessionObj}
          isOnlySession={allStoreSessions.length <= 1}
          onClose={() => setDeleteSessionObj(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default RecentSessions;
