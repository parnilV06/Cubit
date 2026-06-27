
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './appStyles.css';

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="dashboard-container" style={{ alignItems: 'flex-start' }}>
      <button 
        onClick={() => navigate('/app/trainer')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: 'var(--brand-primary, #572ff7)',
          fontFamily: 'Rubik, sans-serif',
          fontSize: '16px',
          cursor: 'pointer',
          padding: '10px 0',
          marginBottom: '20px'
        }}
      >
        <ChevronLeft size={20} /> Back to Trainer
      </button>

      <div className="feature-panel" style={{ width: '100%', maxWidth: '800px', padding: '40px' }}>
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', color: 'white', margin: '0 0 20px 0' }}>
          Lesson {id} Placeholder
        </h1>
        <p style={{ fontFamily: 'Rubik, sans-serif', color: 'var(--text-secondary, #a8a8b5)', lineHeight: '1.6' }}>
          This is the placeholder screen for Lesson {id}. 
          <br /><br />
          The complete lesson content, interactive 3D visualizers, algorithms, and backend logic will be integrated here shortly.
        </p>
      </div>
    </div>
  );
}
