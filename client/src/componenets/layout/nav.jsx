import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, User, LogOut } from 'lucide-react';
import './layout.css';

// SVGs
import timerIcon from '../../assets/stopwatch.svg';
import statsIcon from '../../assets/stats.svg';
import trainerIcon from '../../assets/trainer.svg';
import communityIcon from '../../assets/community.svg';
import logoIcon from '../../assets/cubit-logo-icon-svg.svg'; // Or whichever matches best

const Nav = ({ isExpanded, setIsExpanded }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Basic logout flow simulation
    navigate('/login');
  };

  return (
    <nav className={`app-nav ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button 
        className="nav-toggle-btn"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronRight size={24} color="#ffffff" /> : <ChevronLeft size={24} color="#ffffff" />}
      </button>

      <div className="nav-header">
        <img src={logoIcon} alt="CUBIT Logo" className="nav-logo" />
        <h2 className={`nav-brand-text nav-transition ${isExpanded ? 'show' : 'hide'}`}>
          <span className="nav-brand-c">C</span> U B I T
        </h2>
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
          <span className={`nav-link-text nav-transition ${isExpanded ? 'show' : 'hide'}`}>Timer</span>
        </NavLink>
        
        <NavLink 
          to="/app/stats" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <div className="nav-icon-container">
             <img src={statsIcon} alt="Stats" />
          </div>
          <span className={`nav-link-text nav-transition ${isExpanded ? 'show' : 'hide'}`}>Stats</span>
        </NavLink>
        
        <NavLink 
          to="/app/trainer" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <div className="nav-icon-container">
            <img src={trainerIcon} alt="Trainer" />
          </div>
          <span className={`nav-link-text nav-transition ${isExpanded ? 'show' : 'hide'}`}>Trainer</span>
        </NavLink>
        
        <NavLink 
          to="/app/community" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <div className="nav-icon-container">
            <img src={communityIcon} alt="Community" />
          </div>
          <span className={`nav-link-text nav-transition ${isExpanded ? 'show' : 'hide'}`}>Community</span>
        </NavLink>
      </div>

      <div className="nav-footer" ref={menuRef}>
        <div 
          className="user-profile" 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=572ff7" 
            alt="User Profile" 
            className="avatar-placeholder" 
          />
          <span className={`profile-name nav-transition ${isExpanded ? 'show' : 'hide'}`}>John Doe</span>
          
          {showProfileMenu && (
            <div className="profile-popover">
              <button className="popover-item" onClick={() => navigate('/profile')}>
                <User size={16} />
                <span>View Profile</span>
              </button>
              <button className="popover-item logout" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
