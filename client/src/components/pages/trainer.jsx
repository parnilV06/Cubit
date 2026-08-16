import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { trainerAPI } from '../../services/api';
import './appStyles.css';

import cube1 from '../../assets/cube-illustration-1.png';
import cube2 from '../../assets/cube-illustration-2.png';
import cube3 from '../../assets/cube-illustration-3.png';
import cube4 from '../../assets/cube-illustration-4.png';
import cube5 from '../../assets/cube-illustration-5.png';

const illustrations = [cube2, cube3, cube1, cube4, cube5];

// Canonical Curriculum Module Specifications
const CURRICULUM_MODULES = [
  {
    number: 1,
    id: 'getting-started',
    title: '1. Getting Started',
    categoryMatch: ['Getting Started', '1. Getting Started', '01. Getting Started'],
    description: 'Cube anatomy, twisty puzzle types, history, and aesthetic patterns.',
  },
  {
    number: 2,
    id: 'cube-notation',
    title: '2. Cube Notation',
    categoryMatch: ['Cube Notation', '2. Cube Notation', '02. Cube Notation'],
    description: 'The universal language of moves, triggers, rotations, and slice turns.',
  },
  {
    number: 3,
    id: 'solve-your-first-cube',
    title: '3. Solve Your First Cube',
    categoryMatch: ['Solve Your First Cube', '3. Solve Your First Cube', '03. Solve Your First Cube'],
    description: 'Layer-by-layer beginner method from white cross to full solve.',
  },
  {
    number: 4,
    id: 'speedcubing-fundamentals',
    title: '4. Speedcubing Fundamentals',
    categoryMatch: ['Speedcubing Fundamentals', '4. Speedcubing Fundamentals', '04. Speedcubing Fundamentals'],
    description: 'Fingertricks, hardware setup, inspection planning, and timing habits.',
  },
  {
    number: 5,
    id: 'cfop',
    title: '5. CFOP',
    categoryMatch: ['CFOP', '5. CFOP', '05. CFOP'],
    description: 'Cross, F2L, OLL, and PLL for advanced speedsolving.',
  },
  {
    number: 6,
    id: 'solving-other-cubes',
    title: '6. Solving Other Cubes',
    categoryMatch: ['Solving Other Cubes', '6. Solving Other Cubes', '06. Solving Other Cubes'],
    description: '2x2, 4x4, 5x5, Pyraminx, Megaminx, and Skewb.',
  },
  {
    number: 7,
    id: 'algorithms-patterns',
    title: '7. Algorithms & Patterns',
    categoryMatch: ['Algorithms & Patterns', '7. Algorithms & Patterns', '07. Algorithms & Patterns', '6. Algorithms & Patterns', '06. Algorithms & Patterns'],
    description: 'Deep algorithm library and aesthetic cube patterns.',
  },
  {
    number: 8,
    id: 'cubing-guides-resources',
    title: '8. Cubing Guides & Resources',
    categoryMatch: ['Cubing Guides & Resources', '8. Cubing Guides & Resources', '08. Cubing Guides & Resources'],
    description: 'Cube maintenance, competitions, community, and hardware buying guides.',
  },
];

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
            padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold', zIndex: 5,
            display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            <CheckCircle2 size={11} />
            <span>Done</span>
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
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await trainerAPI.getLessons();
        const data = response.data || [];
        setLessons(data);
        
        // Initialize all active modules as open by default
        const initialOpen = {};
        CURRICULUM_MODULES.forEach(mod => {
          initialOpen[mod.id] = true;
        });
        setOpenSections(initialOpen);
      } catch (err) {
        console.error('Failed to fetch trainer lessons:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  const toggleSection = (moduleId) => {
    setOpenSections(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Group and sort lessons strictly by canonical curriculum order
  const moduleSections = useMemo(() => {
    const sections = [];
    const matchedLessonSlugs = new Set();

    CURRICULUM_MODULES.forEach(mod => {
      const items = lessons.filter(l => {
        const cat = (l.category || '').trim();
        return mod.categoryMatch.some(m => m.toLowerCase() === cat.toLowerCase());
      });

      if (items.length > 0) {
        items.sort((a, b) => a.order - b.order);
        items.forEach(i => matchedLessonSlugs.add(i.slug));
        
        const completedCount = items.filter(i => i.completed).length;
        sections.push({
          ...mod,
          lessons: items,
          completedCount,
          totalCount: items.length,
          allCompleted: completedCount === items.length && items.length > 0
        });
      }
    });

    // Handle any lessons that don't match standard curriculum categories
    const remainingLessons = lessons.filter(l => !matchedLessonSlugs.has(l.slug));
    if (remainingLessons.length > 0) {
      remainingLessons.sort((a, b) => a.order - b.order);
      sections.push({
        number: sections.length + 1,
        id: 'additional-lessons',
        title: 'Additional Lessons',
        lessons: remainingLessons,
        completedCount: remainingLessons.filter(i => i.completed).length,
        totalCount: remainingLessons.length,
        allCompleted: false
      });
    }

    return sections;
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

      {moduleSections.length === 0 ? (
        <div className="trainer-section-card" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#A8A8B5' }}>No lessons are currently published.</p>
        </div>
      ) : (
        moduleSections.map((section) => {
          const isOpen = openSections[section.id] ?? true;

          return (
            <div key={section.id} className="trainer-section-card">
              {/* Accordion Header */}
              <button
                type="button"
                className="trainer-section-header"
                onClick={() => toggleSection(section.id)}
                aria-expanded={isOpen}
              >
                <div className="trainer-section-header-left">
                  <h2 className="trainer-section-title">{section.title}</h2>
                  <span className={`trainer-module-badge ${section.allCompleted ? 'completed' : ''}`}>
                    {section.completedCount > 0
                      ? `${section.completedCount}/${section.totalCount} Done`
                      : `${section.totalCount} Lessons`}
                  </span>
                </div>
                <div className="trainer-accordion-toggle">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {/* Accordion Body */}
              {isOpen && (
                <div className="trainer-accordion-body">
                  <div className="trainer-scroll-container">
                    {section.lessons.map((item, idx) => {
                      const image = illustrations[idx % illustrations.length];
                      return (
                        <LessonCard 
                          key={item.id || item.slug}
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
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
