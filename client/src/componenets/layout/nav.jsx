import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import './layout.css';

// SVGs
import timerIcon from '../../assets/stopwatch.svg';
import statsIcon from '../../assets/stats.svg';
import trainerIcon from '../../assets/trainer.svg';
import communityIcon from '../../assets/community.svg';
import logoIcon from '../../assets/cubit-main-logo-mono.svg'; // Or whichever matches best

const Nav = ({ isExpanded, setIsExpanded }) => {
  return (
    <nav className={`app-nav ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button 
        className="nav-toggle-btn"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronRight size={24} color="#572FF7" /> : <ChevronLeft size={24} color="#572FF7" />}
      </button>

      <div className="nav-header">
        <img src={logoIcon} alt="CUBIT Logo" className="nav-logo" />
        {isExpanded && <h2 className="nav-brand-text">CUBIT</h2>}
      </div>

      <div className="nav-links">
        <NavLink 
          to="/app" 
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <div className="nav-icon-container">
             <img src={timerIcon} alt="Timer" />
          </div>
          {isExpanded && <span className="nav-link-text">Timer</span>}
        </NavLink>
        
        <NavLink 
          to="/app/stats" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <div className="nav-icon-container">
             <img src={statsIcon} alt="Stats" />
          </div>
          {isExpanded && <span className="nav-link-text">Stats</span>}
        </NavLink>
        
        <NavLink 
          to="/app/trainer" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <div className="nav-icon-container">
            <img src={trainerIcon} alt="Trainer" />
          </div>
          {isExpanded && <span className="nav-link-text">Trainer</span>}
        </NavLink>
        
        <NavLink 
          to="/app/community" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <div className="nav-icon-container">
            <img src={communityIcon} alt="Community" />
          </div>
          {isExpanded && <span className="nav-link-text">Community</span>}
        </NavLink>
      </div>

      <div className="nav-footer">
        <div className="user-profile">
          <div className="avatar-placeholder"></div>
          {isExpanded && <span className="user-name">John Doe</span>}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
