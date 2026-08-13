/**
 * Cubit Trainer — Reusable WhatNext Component
 * 
 * Renders the structured "What's Next?" section at the end of lessons,
 * displaying recommended progression, related concepts, and optional exploration paths.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const LESSON_CATALOG_FALLBACKS = {
  'prime-double-turns': {
    title: 'Prime & Double Turns',
    description: 'Learn counter-clockwise turns (R\') and 180-degree double turns (R2).',
    category: 'Cube Notation',
    estimatedMinutes: 5,
  },
  'whole-cube-rotations': {
    title: 'Whole-Cube Rotations',
    description: 'Master x, y, and z whole-cube spatial reorientations.',
    category: 'Cube Notation',
    estimatedMinutes: 5,
  },
  'fun-cube-patterns': {
    title: 'Fun Cube Patterns',
    description: 'Create aesthetic patterns like Checkerboard and Cube-in-a-Cube.',
    category: 'Getting Started',
    estimatedMinutes: 8,
  },
  'what-is-speedcubing': {
    title: 'What is Speedcubing?',
    description: 'Explore the global sport, official WCA events, and solving methods.',
    category: 'Getting Started',
    estimatedMinutes: 5,
  },
};

export function WhatNext({
  next,
  related = [],
  explore = [],
  className = '',
  style = {},
}) {
  const navigate = useNavigate();

  // Helper to resolve card info from string slug or object
  const resolveLesson = (item) => {
    if (!item) return null;
    if (typeof item === 'object') {
      return {
        slug: item.slug || item.id,
        title: item.title,
        description: item.description,
        estimatedMinutes: item.estimatedMinutes || item.time,
        category: item.category,
      };
    }
    const cleanSlug = String(item).replace(/^notation-|^getting-started-/, '');
    const fallback = LESSON_CATALOG_FALLBACKS[cleanSlug] || {};
    return {
      slug: cleanSlug,
      title: fallback.title || cleanSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      description: fallback.description || 'Continue your cubing journey.',
      estimatedMinutes: fallback.estimatedMinutes || 5,
      category: fallback.category || 'Trainer',
    };
  };

  const nextLesson = resolveLesson(next);
  const relatedList = (Array.isArray(related) ? related : [related])
    .map(resolveLesson)
    .filter(Boolean);
  const exploreList = (Array.isArray(explore) ? explore : [explore])
    .map(resolveLesson)
    .filter(Boolean);

  const handleCardClick = (slug) => {
    if (slug) {
      navigate(`/app/trainer/lesson/${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`cubit-trainer-what-next ${className}`}
      style={{
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '1px solid var(--border-primary, #2b2b35)',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-heading, sans-serif)',
          fontSize: '22px',
          fontWeight: '700',
          color: 'var(--text-primary, #fafafa)',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Compass size={20} color="var(--brand-primary, #572ff7)" />
        What&apos;s Next?
      </h2>

      {/* Primary Next Lesson Hero Card */}
      {nextLesson && (
        <div
          onClick={() => handleCardClick(nextLesson.slug)}
          style={{
            padding: '20px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(87, 47, 247, 0.18), rgba(23, 23, 28, 0.95))',
            border: '1.5px solid rgba(87, 47, 247, 0.4)',
            boxShadow: '0 8px 24px rgba(87, 47, 247, 0.12)',
            cursor: 'pointer',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--brand-primary, #572ff7)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(87, 47, 247, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(87, 47, 247, 0.4)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(87, 47, 247, 0.12)';
          }}
        >
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--brand-ter, #bc8be0)',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={13} color="var(--brand-ter, #bc8be0)" />
              Next Recommended Lesson
            </div>
            <div
              style={{
                fontSize: '17px',
                fontWeight: '700',
                color: '#ffffff',
                fontFamily: 'var(--font-heading, sans-serif)',
                marginBottom: '4px',
              }}
            >
              {nextLesson.title}
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary, #a8a8b5)',
                lineHeight: '1.4',
              }}
            >
              {nextLesson.description}
            </div>
          </div>

          <button
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--brand-primary, #572ff7)',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(87, 47, 247, 0.35)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <span>Start Lesson</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Secondary Related / Explore Columns */}
      {(relatedList.length > 0 || exploreList.length > 0) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px',
            marginTop: '12px',
          }}
        >
          {relatedList.map((item) => (
            <div
              key={item.slug}
              onClick={() => handleCardClick(item.slug)}
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-primary, #2b2b35)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(87, 47, 247, 0.4)';
                e.currentTarget.style.backgroundColor = 'rgba(87, 47, 247, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-primary, #2b2b35)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--text-muted, #7a7a88)',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <BookOpen size={12} />
                Related Topic
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary, #fafafa)',
                  marginBottom: '2px',
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary, #a8a8b5)',
                  lineHeight: '1.3',
                }}
              >
                {item.description}
              </div>
            </div>
          ))}

          {exploreList.map((item) => (
            <div
              key={item.slug}
              onClick={() => handleCardClick(item.slug)}
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-primary, #2b2b35)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(167, 104, 212, 0.4)';
                e.currentTarget.style.backgroundColor = 'rgba(167, 104, 212, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-primary, #2b2b35)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--text-muted, #7a7a88)',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Compass size={12} />
                Explore
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary, #fafafa)',
                  marginBottom: '2px',
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary, #a8a8b5)',
                  lineHeight: '1.3',
                }}
              >
                {item.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WhatNext;
