import React from 'react';
import './appStyles.css';

export default function StatsDashboard() {
  return (
    <div className="playground-container">
      {/* Top Main Container - Detailed Statistics */}
      <div className="playground-main-top stats-detailed-top">
        <h2>Detailed Statistics</h2>
        <div className="stats-grid">
          <div className="stat-box">
            <h4>Total Solves</h4>
            <p>1,234</p>
          </div>
          <div className="stat-box">
            <h4>Best Time</h4>
            <p>8.45s</p>
          </div>
          <div className="stat-box">
            <h4>Global Ao5</h4>
            <p>12.30s</p>
          </div>
          <div className="stat-box">
            <h4>Global Ao12</h4>
            <p>12.85s</p>
          </div>
        </div>
        
        {/* Placeholder for Chart */}
        <div className="chart-container">
          <p>Progression Chart (Time over Session)</p>
        </div>
      </div>

      {/* Bottom Container - Secondary Stats/Filters */}
      <div className="playground-secondary-bottom">
        <div className="feature-card">
          <h3>Session History</h3>
          <ul className="session-list">
            <li>Session 1 - 12.34 (Ao5)</li>
            <li>Session 2 - 13.01 (Ao5)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
