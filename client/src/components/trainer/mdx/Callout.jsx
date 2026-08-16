/**
 * Cubit Trainer — Reusable Callout Component
 * 
 * Renders stylized alerts / notices (note, tip, warning, important, success)
 * for use in MDX educational lessons.
 */

import React from 'react';
import {
  Info,
  Lightbulb,
  AlertTriangle,
  Flame,
  CheckCircle2,
} from 'lucide-react';

const ALERT_CONFIGS = {
  note: {
    icon: Info,
    title: 'Note',
    borderColor: 'rgba(87, 47, 247, 0.4)',
    bgColor: 'rgba(87, 47, 247, 0.08)',
    iconColor: '#a768d4',
  },
  tip: {
    icon: Lightbulb,
    title: 'Tip',
    borderColor: 'rgba(34, 197, 94, 0.4)',
    bgColor: 'rgba(34, 197, 94, 0.08)',
    iconColor: '#22c55e',
  },
  important: {
    icon: Flame,
    title: 'Important',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    bgColor: 'rgba(245, 158, 11, 0.08)',
    iconColor: '#f59e0b',
  },
  warning: {
    icon: AlertTriangle,
    title: 'Caution',
    borderColor: 'rgba(239, 68, 68, 0.4)',
    bgColor: 'rgba(239, 68, 68, 0.08)',
    iconColor: '#ef4444',
  },
  success: {
    icon: CheckCircle2,
    title: 'Success',
    borderColor: 'rgba(34, 197, 94, 0.4)',
    bgColor: 'rgba(34, 197, 94, 0.08)',
    iconColor: '#22c55e',
  },
};

export function Callout({
  type = 'note',
  title,
  children,
  text,
  className = '',
  style = {},
}) {
  const normType = String(type).toLowerCase();
  const config = ALERT_CONFIGS[normType] || ALERT_CONFIGS.note;
  const IconComponent = config.icon;
  const displayTitle = title || config.title;

  return (
    <div
      className={`cubit-trainer-callout cubit-callout-${normType} ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        padding: '14px 16px',
        borderRadius: '10px',
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        margin: '16px 0',
        textAlign: 'left',
        boxSizing: 'border-box',
        width: '100%',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '700',
          fontSize: '13px',
          color: config.iconColor,
          fontFamily: 'var(--font-heading, sans-serif)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        <IconComponent size={16} color={config.iconColor} />
        <span>{displayTitle}</span>
      </div>

      <div
        style={{
          color: 'var(--text-secondary, #a8a8b5)',
          fontSize: '14px',
          lineHeight: '1.6',
          fontFamily: 'var(--font-main, sans-serif)',
        }}
      >
        {children || text}
      </div>
    </div>
  );
}

export default Callout;
