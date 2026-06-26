import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './appStyles.css';

import cube1 from '../../assets/cube-illustration-1.png';
import cube2 from '../../assets/cube-illustration-2.png';
import cube3 from '../../assets/cube-illustration-3.png';
import cube4 from '../../assets/cube-illustration-4.png';
import cube5 from '../../assets/cube-illustration-5.png';

const LessonCard = ({ number, title, image }) => {
  const navigate = useNavigate();
  return (
    <div className="trainer-lesson-card">
      <div className="lesson-img-wrapper">
        <div className="lesson-badge">{number}.</div>
        <img src={image} alt={`Lesson ${number}`} className="lesson-img" />
      </div>
      <div className="lesson-info">
        <h3 className="lesson-title">{title}</h3>
        <button 
          className="lesson-start-btn"
          onClick={() => navigate(`/app/trainer/lesson/${number}`)}
        >
          <span>Start</span>
          <ChevronRight size={18} color="#ffffff" />
        </button>
      </div>
    </div>
  );
};

export default function Trainer() {
  return (
    <div className="dashboard-container trainer-dashboard">
      <div className="trainer-header">
        <h1 className="trainer-main-title">Learn and Train</h1>
        <p className="trainer-subtitle">Start your cubing journey , RIght here !</p>
      </div>

      <div className="trainer-section-card">
        <div className="trainer-section-header">
          <h2 className="trainer-section-title">Learn</h2>
          <p className="trainer-section-subtitle">New to Cubing ? Let's get you started...</p>
        </div>
        <div className="trainer-scroll-container">
          <LessonCard number={1} title="Getting Known to the Rubik's Cube" image={cube2} />
          <LessonCard number={2} title="Cube Notation 101" image={cube3} />
          <LessonCard number={3} title="What is SpeedCubing ?" image={cube1} />
          <LessonCard number={4} title="Advanced Finger Tricks" image={cube4} />
          <LessonCard number={5} title="Cross Optimization" image={cube5} />
        </div>
      </div>
      
      <div className="trainer-section-card">
        <div className="trainer-section-header">
          <h2 className="trainer-section-title">Algorithms</h2>
        </div>
        <div className="trainer-scroll-container">
          <LessonCard number={1} title="F2L" image={cube2} />
          <LessonCard number={2} title="OLL" image={cube3} />
          <LessonCard number={3} title="PLL" image={cube1} />
          <LessonCard number={4} title="Winter Variation" image={cube4} />
          <LessonCard number={5} title="COLL Cases" image={cube5} />
        </div>
      </div>
    </div>
  );
}
