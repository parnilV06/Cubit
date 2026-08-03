import { useState } from 'react';
import { X } from 'lucide-react';

export default function SessionDeleteModal({
  isOpen,
  session,
  isOnlySession,
  onClose,
  onConfirm,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !session) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      await onConfirm(session.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete session:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete session');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="session-modal-overlay" onClick={onClose}>
      <div className="session-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="session-modal-header">
          <h3>{isOnlySession ? 'Delete Only Session?' : 'Delete Session?'}</h3>
          <button
            className="session-modal-close-btn"
            onClick={onClose}
            type="button"
            disabled={isSubmitting}
          >
            <X size={18} />
          </button>
        </div>

        {error && <div className="session-modal-error">{error}</div>}

        <div className="session-modal-body" style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.5' }}>
          {isOnlySession ? (
            <p style={{ margin: 0 }}>
              This is your only session. Deleting it will permanently remove this session and all solves associated with it. Cubit will automatically create a new empty session for you.
            </p>
          ) : (
            <p style={{ margin: 0 }}>
              Are you sure you want to delete <strong style={{ color: '#fff' }}>{session.name}</strong>? This session and all associated solves will be permanently deleted.
            </p>
          )}
        </div>

        <div className="session-modal-actions">
          <button
            type="button"
            className="session-modal-btn cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="session-modal-btn destructive"
            onClick={handleConfirm}
            disabled={isSubmitting}
            style={{
              backgroundColor: '#ea4335',
              color: 'white',
            }}
          >
            {isSubmitting
              ? 'Deleting...'
              : isOnlySession
              ? 'Delete & Create New Session'
              : 'Delete Session'}
          </button>
        </div>
      </div>
    </div>
  );
}
