
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { trainerAPI } from '../../services/api';
import './appStyles.css';

const stripFrontmatter = (mdText) => {
  if (mdText.startsWith('---')) {
    const parts = mdText.split('---');
    if (parts.length >= 3) {
      return parts.slice(2).join('---').trim();
    }
  }
  return mdText.trim();
};

const renderMarkdown = (text) => {
  if (!text) return null;
  const blocks = text.split(/\n\n+/);
  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('# ')) {
      return <h1 key={idx} style={{ color: '#fff', marginTop: '24px', marginBottom: '12px', fontFamily: 'Rajdhani, sans-serif', fontSize: '28px' }}>{trimmed.slice(2)}</h1>;
    }
    if (trimmed.startsWith('## ')) {
      return <h2 key={idx} style={{ color: '#fff', marginTop: '20px', marginBottom: '10px', fontFamily: 'Rajdhani, sans-serif', fontSize: '22px' }}>{trimmed.slice(3)}</h2>;
    }
    if (trimmed.startsWith('### ')) {
      return <h3 key={idx} style={{ color: '#fff', marginTop: '16px', marginBottom: '8px', fontFamily: 'Rajdhani, sans-serif', fontSize: '18px' }}>{trimmed.slice(4)}</h3>;
    }

    if (trimmed.startsWith('```')) {
      const code = trimmed.replace(/```[a-zA-Z]*/, '').replace(/```$/, '').trim();
      return (
        <pre key={idx} style={{ background: '#0D0D11', border: '1px solid #2B2B35', padding: '16px', borderRadius: '8px', overflowX: 'auto', margin: '15px 0' }}>
          <code style={{ fontFamily: 'monospace', color: '#572FF7', fontSize: '14px' }}>{code}</code>
        </pre>
      );
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split(/\n[-*]\s+/).map(item => item.replace(/^[-*]\s+/, '').trim());
      return (
        <ul key={idx} style={{ paddingLeft: '20px', margin: '10px 0', color: '#A8A8B5', fontFamily: 'Rubik, sans-serif' }}>
          {items.map((item, i) => <li key={i} style={{ marginBottom: '6px', lineHeight: '1.5' }}>{item}</li>)}
        </ul>
      );
    }

    return (
      <p key={idx} style={{ color: '#A8A8B5', lineHeight: '1.6', fontFamily: 'Rubik, sans-serif', marginBottom: '15px' }}>
        {trimmed}
      </p>
    );
  });
};

export default function Lesson() {
  const { id } = useParams(); // URL Param :id is the slug of the lesson
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await trainerAPI.getLesson(id);
        setLesson(response.data.lesson);
        setContent(stripFrontmatter(response.data.content));
      } catch (err) {
        console.error('Failed to load lesson details:', err);
        setError(err.message || 'Failed to load lesson.');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleComplete = async () => {
    if (!lesson) return;
    try {
      setCompleting(true);
      await trainerAPI.completeLesson(lesson.slug);
      setLesson(prev => prev ? { ...prev, completed: true } : null);
      alert('Congratulations! Lesson completed!');
    } catch (err) {
      console.error('Failed to mark lesson complete:', err);
      alert('Error marking lesson as complete.');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ color: '#fff', padding: '40px' }}>
        <p>Loading lesson...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container" style={{ alignItems: 'flex-start', padding: '40px' }}>
        <button onClick={() => navigate('/app/trainer')} style={{ color: '#572ff7', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
          <ChevronLeft size={20} /> Back to Trainer
        </button>
        <div className="feature-panel" style={{ width: '100%', maxWidth: '800px', padding: '40px', marginTop: '20px', border: '1px solid red' }}>
          <h2 style={{ color: '#fff' }}>Error</h2>
          <p style={{ color: '#ff4d4d' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ alignItems: 'flex-start', padding: '40px' }}>
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

      <div className="feature-panel" style={{ width: '100%', maxWidth: '800px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#572FF7', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {lesson?.category} &bull; {lesson?.difficulty}
            </span>
            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', color: 'white', margin: '5px 0 10px 0', fontSize: '32px' }}>
              {lesson?.title}
            </h1>
            <span style={{ fontSize: '13px', color: '#A8A8B5' }}>
              Estimated time: {lesson?.estimatedMinutes} mins
            </span>
          </div>
          
          <div>
            {lesson?.completed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34A853', fontWeight: 'bold', fontSize: '14px', background: '#34a85315', padding: '8px 16px', borderRadius: '20px' }}>
                <CheckCircle size={18} />
                Completed
              </div>
            ) : (
              <button
                onClick={handleComplete}
                disabled={completing}
                style={{
                  background: 'linear-gradient(135deg, #572FF7, #3b1cb3)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(87, 47, 247, 0.3)'
                }}
              >
                {completing ? 'Completing...' : 'Mark as Complete'}
              </button>
            )}
          </div>
        </div>

        <div className="lesson-body-content" style={{ borderTop: '1px solid #2B2B35', paddingTop: '20px' }}>
          {renderMarkdown(content)}
        </div>
      </div>
    </div>
  );
}
