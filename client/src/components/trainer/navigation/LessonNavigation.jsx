/**
 * Cubit Trainer — Lesson Navigation Bottom Bar
 * 
 * Provides consistent Previous / Complete / Next lesson controls.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export function LessonNavigation({
  prevLesson,
  nextLesson,
  completed = false,
  completing = false,
  onComplete,
  className = '',
  style = {},
}) {
  const navigate = useNavigate();

  const handleNavigate = (slug) => {
    if (slug) {
      navigate(`/app/trainer/lesson/${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`cubit-trainer-lesson-nav ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 0',
        marginTop: '30px',
        borderTop: '1px solid var(--border-primary, #2b2b35)',
        gap: '12px',
        flexWrap: 'wrap',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Previous Lesson */}
      <div>
        {prevLesson ? (
          <button
            onClick={() => handleNavigate(prevLesson.slug || prevLesson)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-primary, #2b2b35)',
              color: 'var(--text-primary, #fafafa)',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(87, 47, 247, 0.4)';
              e.currentTarget.style.backgroundColor = 'rgba(87, 47, 247, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-primary, #2b2b35)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
            }}
          >
            <ChevronLeft size={16} />
            <span>Previous Lesson</span>
          </button>
        ) : <div />}
      </div>

      {/* Center Complete Button */}
      <div>
        {completed ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '20px',
              backgroundColor: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#22c55e',
              fontSize: '13px',
              fontWeight: '700',
            }}
          >
            <CheckCircle2 size={16} />
            <span>Completed</span>
          </div>
        ) : (
          <button
            onClick={onComplete}
            disabled={completing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--brand-primary, #572ff7), #3b1cb3)',
              border: 'none',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: completing ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(87, 47, 247, 0.35)',
              opacity: completing ? 0.7 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {completing ? 'Completing...' : 'Mark as Complete'}
          </button>
        )}
      </div>

      {/* Next Lesson */}
      <div>
        {nextLesson ? (
          <button
            onClick={() => handleNavigate(nextLesson.slug || nextLesson)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--brand-primary, #572ff7)',
              border: 'none',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(87, 47, 247, 0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Next Lesson</span>
            <ChevronRight size={16} />
          </button>
        ) : <div />}
      </div>
    </div>
  );
}

export default LessonNavigation;
