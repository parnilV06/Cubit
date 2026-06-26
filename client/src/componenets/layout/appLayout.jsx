import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Nav from './nav';
import StatsBar from './statsBar';
import './layout.css';

// Pages for the App Layout
import TimerDashboard from '../pages/timerDashboard.jsx';
import StatsDashboard from '../pages/statsDashboard.jsx';
import Trainer from '../pages/trainer.jsx';
import Community from '../pages/community.jsx';

const AppLayout = () => {
  const location = useLocation();
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const [isStatsExpanded, setIsStatsExpanded] = useState(true);

  // Determine if the current route should have the stats bar (Timer and Stats screens)
  const path = location.pathname;
  const showStatsBar = path === '/app' || path === '/app/' || path === '/app/stats' || path === '/app/stats/';

  return (
    <div className="app-layout">
      {/* Left Column: Stats Bar (Conditionally Rendered) */}
      {showStatsBar && (
        <StatsBar 
          isExpanded={isStatsExpanded} 
          setIsExpanded={setIsStatsExpanded} 
        />
      )}

      {/* Center Column: Main Playground */}
      <main className="app-main-content">
        <Routes>
          <Route index element={<TimerDashboard />} />
          <Route path="stats" element={<StatsDashboard />} />
          <Route path="trainer" element={<Trainer />} />
          <Route path="community" element={<Community />} />
        </Routes>
      </main>

      {/* Right Column: Navigation Bar */}
      <Nav 
        isExpanded={isNavExpanded} 
        setIsExpanded={setIsNavExpanded} 
      />
    </div>
  );
};

export default AppLayout;
