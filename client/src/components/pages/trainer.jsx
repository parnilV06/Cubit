
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { trainerAPI } from '../../services/api';
import './appStyles.css';

import cube1 from '../../assets/cube-illustration-1.png';
import cube2 from '../../assets/cube-illustration-2.png';
import cube3 from '../../assets/cube-illustration-3.png';
import cube4 from '../../assets/cube-illustration-4.png';
import cube5 from '../../assets/cube-illustration-5.png';

const illustrations = [cube2, cube3, cube1, cube4, cube5];

const LessonCard = ({ number, title, slug, image, completed }) => {
  const navigate = useNavigate();
  return (
    <div className="trainer-lesson-card" style={{ position: 'relative' }}>
      <div className="lesson-img-wrapper">
        <div className="lesson-badge">{number}.</div>
        {completed && (
          <div style={{
            position: 'absolute', top: '10px', right: '10px',
            backgroundColor: '#34A853', color: '#fff', fontSize: '10px',
            padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold', zIndex: 5
          }}>
            Done
          </div>
        )}
        <img src={image} alt={`Lesson ${number}`} className="lesson-img" />
      </div>
      <div className="lesson-info">
        <h3 className="lesson-title">{title}</h3>
        <button 
          className="lesson-start-btn"
          onClick={() => navigate(`/app/trainer/lesson/${slug}`)}
        >
          <span>{completed ? 'Review' : 'Start'}</span>
          <ChevronRight size={18} color="#ffffff" />
        </button>
      </div>
    </div>
  );
};

export default function Trainer() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await trainerAPI.getLessons();
        setLessons(response.data || []);
      } catch (err) {
        console.error('Failed to fetch trainer lessons:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  const groupedLessons = useMemo(() => {
    const groups = {};
    lessons.forEach(lesson => {
      const cat = lesson.category || 'General';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(lesson);
    });
    // Sort by order inside each category
    Object.keys(groups).forEach(cat => {
      groups[cat].sort((a, b) => a.order - b.order);
    });
    return groups;
  }, [lessons]);

  if (loading) {
    return (
      <div className="dashboard-container trainer-dashboard" style={{ color: '#fff', padding: '40px' }}>
        <p>Loading trainer dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container trainer-dashboard">
      <div className="trainer-header">
        <h1 className="trainer-main-title">Learn and Train</h1>
        <p className="trainer-subtitle">Start your cubing journey, right here!</p>
      </div>

      {lessons.length === 0 ? (
        <div className="trainer-section-card" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#A8A8B5' }}>No lessons are currently published.</p>
        </div>
      ) : (
        Object.entries(groupedLessons).map(([category, items]) => (
          <div key={category} className="trainer-section-card">
            <div className="trainer-section-header">
              <h2 className="trainer-section-title">{category}</h2>
            </div>
            <div className="trainer-scroll-container">
              {items.map((item, idx) => {
                const image = illustrations[idx % illustrations.length];
                return (
                  <LessonCard 
                    key={item.id}
                    number={item.order} 
                    title={item.title} 
                    slug={item.slug}
                    image={image} 
                    completed={item.completed}
                  />
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
