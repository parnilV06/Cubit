import { useEffect } from 'react';
import { X, Mail, MessageSquare } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          color: 'var(--text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px',
            color: 'var(--text-primary)',
          }}
        >
          Get in touch
        </h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            lineHeight: '1.6',
            marginBottom: '24px',
          }}
        >
          Have feedback, found a bug, want to contribute, or just want to talk Cubit? We&apos;d love to hear from you.
        </p>

        {/* Channels List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Email Channel */}
          <a
            href="mailto:06v.parnil@gmail.com"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '12px',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              transition: 'border-color 0.2s, transform 0.15s',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-primary)',
              }}
            >
              <Mail size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '15px' }}>Official Email</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>06v.parnil@gmail.com</div>
            </div>
          </a>

          {/* GitHub Channel */}
          <a
            href="https://github.com/parnilV06/Cubit"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '12px',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              transition: 'border-color 0.2s, transform 0.15s',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(167, 104, 212, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A768D4',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                <path d="M9 18c-4.51 2-5-2-7-2"/>
              </svg>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '15px' }}>GitHub Issues &amp; Code</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Report bugs or contribute code</div>
            </div>
          </a>

          {/* Discord Channel */}
          <a
            href="https://discord.gg/8mt7Ee9zv"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '12px',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              transition: 'border-color 0.2s, transform 0.15s',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(88, 101, 242, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5865F2',
              }}
            >
              <MessageSquare size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '15px' }}>Discord Community</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Join speedcubing chat &amp; discussions</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
