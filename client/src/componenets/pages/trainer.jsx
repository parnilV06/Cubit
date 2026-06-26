import React from 'react';
import './appStyles.css';

export default function Trainer() {
  return (
    <div className="playground-container no-stats-bar">
      <div className="playground-full-content">
        <div className="trainer-header">
          <h2>Trainer Modules</h2>
          <p>Master algorithms and patterns with structured lessons.</p>
        </div>
        
        <div className="modules-grid">
          <div className="module-card">
            <h3>Beginner CFOP</h3>
            <p>Learn the basics of Cross, F2L, OLL, and PLL.</p>
            <button className="start-btn">Start Lesson</button>
          </div>
          
          <div className="module-card">
            <h3>Advanced F2L</h3>
            <p>Optimize your F2L pairs and look-ahead.</p>
            <button className="start-btn">Start Lesson</button>
          </div>
          
          <div className="module-card">
            <h3>Full OLL</h3>
            <p>Master all 57 OLL cases.</p>
            <button className="start-btn">Start Lesson</button>
          </div>

          <div className="module-card">
            <h3>Full PLL</h3>
            <p>Master all 21 PLL cases.</p>
            <button className="start-btn">Start Lesson</button>
          </div>
        </div>
      </div>
    </div>
  );
}
