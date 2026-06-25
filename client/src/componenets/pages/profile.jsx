import React from 'react'
import { Link } from 'react-router-dom'
import logoIcon from '../../assets/cubit-logo-icon-svg.svg'
import stopwatchIcon from '../../assets/stopwatch.svg'
import trainerIcon from '../../assets/trainer.svg'
import statsIcon from '../../assets/stats.svg'
import communityIcon from '../../assets/community.svg'
import userAddIcon from '../../assets/user-add.svg'
import heroBg from '../../assets/hero-bg-transparent.png'
import './profile.css'

export default function Profile() {
  // We can track completed steps to dynamically update the timeline
  const completedStepsCount = 0; // matching "0 / 4 Completed" from the Figma design

  return (
    <div className="profile-page">
      {/* ── Left Column: Main content ── */}
      <main className="profile-main-content">
        <header className="profile-header">
          <h1 className="profile-header-title">Profile</h1>
          <p className="profile-header-sub">Your home on Cubit</p>
        </header>

        {/* Profile Card (Hero) */}
        <section className="profile-hero-card">
          <div className="profile-hero-content">
            <div className="profile-avatar-container">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80" 
                alt="John Doe avatar" 
                className="profile-avatar-img"
              />
            </div>
            
            <div className="profile-hero-details">
              <h2 className="profile-display-name">John Doe</h2>
              
              <div className="profile-hero-stats-row">
                <div className="profile-hero-stat-badge">
                  <span className="profile-hero-stat-value">25</span>
                  <span className="profile-hero-stat-label">Followers</span>
                </div>
                <div className="profile-hero-stat-badge">
                  <span className="profile-hero-stat-value">30</span>
                  <span className="profile-hero-stat-label">Following</span>
                </div>
                <div className="profile-hero-stat-badge">
                  <span className="profile-hero-stat-value">16</span>
                  <span className="profile-hero-stat-label">Posts</span>
                </div>
              </div>
            </div>
          </div>
          
          <button className="profile-edit-btn" id="profile-edit-button">
            Edit Profile
          </button>
        </section>

        {/* Quick Actions */}
        <section className="profile-section-container">
          <h3 className="profile-section-title">Quick Actions</h3>
          
          <div className="profile-quick-actions-grid">
            <Link to="/dashboard" className="profile-action-card" id="quick-action-timer">
              <div className="profile-action-icon-wrapper">
                <img src={stopwatchIcon} alt="Timer Icon" className="profile-action-icon" />
              </div>
              <h4 className="profile-action-title">Timer</h4>
              <p className="profile-action-desc">Start Solving now</p>
              <span className="profile-action-arrow">→</span>
            </Link>

            <Link to="/trainer" className="profile-action-card" id="quick-action-trainer">
              <div className="profile-action-icon-wrapper">
                <img src={trainerIcon} alt="Trainer Icon" className="profile-action-icon" />
              </div>
              <h4 className="profile-action-title">Trainer</h4>
              <p className="profile-action-desc">Learn and Train</p>
              <span className="profile-action-arrow">→</span>
            </Link>

            <Link to="/stats" className="profile-action-card" id="quick-action-stats">
              <div className="profile-action-icon-wrapper">
                <img src={statsIcon} alt="Stats Icon" className="profile-action-icon" />
              </div>
              <h4 className="profile-action-title">Stats</h4>
              <p className="profile-action-desc">Analyze your Stats</p>
              <span className="profile-action-arrow">→</span>
            </Link>

            <Link to="/community" className="profile-action-card" id="quick-action-community">
              <div className="profile-action-icon-wrapper">
                <img src={communityIcon} alt="Community Icon" className="profile-action-icon" />
              </div>
              <h4 className="profile-action-title">Community</h4>
              <p className="profile-action-desc">Explore Cubit Community</p>
              <span className="profile-action-arrow">→</span>
            </Link>
          </div>
        </section>

        {/* Getting Started */}
        <section className="profile-section-container">
          <div className="profile-section-header">
            <h3 className="profile-section-title">Getting Started</h3>
            <span className="profile-getting-started-progress">
              {completedStepsCount} / 4 Completed
            </span>
          </div>
          <p className="profile-section-subtext">
            Complete these steps and become a part of Cubit
          </p>
          
          <div className="profile-timeline-container">
            <div className="profile-timeline-line"></div>
            <div 
              className="profile-timeline-progress-line" 
              style={{ width: `${(completedStepsCount / 4) * 100}%` }}
            ></div>
            
            <div className="profile-timeline-steps">
              {/* Step 1 */}
              <div className={`profile-timeline-step ${completedStepsCount >= 1 ? 'completed' : 'active'}`}>
                <div className="profile-timeline-number">1</div>
                <div className="profile-timeline-step-icon-wrapper">
                  <img src={userAddIcon} alt="User Add Icon" className="profile-timeline-step-icon" />
                </div>
                <h4 className="profile-timeline-step-title">Upload Profile Pic</h4>
                <p className="profile-timeline-step-desc">Add A profile picture</p>
              </div>

              {/* Step 2 */}
              <div className={`profile-timeline-step ${completedStepsCount >= 2 ? 'completed' : ''}`}>
                <div className="profile-timeline-number">2</div>
                <div className="profile-timeline-step-icon-wrapper">
                  <img src={trainerIcon} alt="Trainer Icon" className="profile-timeline-step-icon" />
                </div>
                <h4 className="profile-timeline-step-title">Learn the Basics</h4>
                <p className="profile-timeline-step-desc">Learn & Train</p>
              </div>

              {/* Step 3 */}
              <div className={`profile-timeline-step ${completedStepsCount >= 3 ? 'completed' : ''}`}>
                <div className="profile-timeline-number">3</div>
                <div className="profile-timeline-step-icon-wrapper">
                  {/* Inline Cube SVG */}
                  <svg className="profile-timeline-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <h4 className="profile-timeline-step-title">Start your First Solve</h4>
                <p className="profile-timeline-step-desc">Open Timer and Solve !</p>
              </div>

              {/* Step 4 */}
              <div className={`profile-timeline-step ${completedStepsCount >= 4 ? 'completed' : ''}`}>
                <div className="profile-timeline-number">4</div>
                <div className="profile-timeline-step-icon-wrapper">
                  <img src={communityIcon} alt="Community Icon" className="profile-timeline-step-icon" />
                </div>
                <h4 className="profile-timeline-step-title">Explore Community</h4>
                <p className="profile-timeline-step-desc">Connect and Grow !</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Right Column: Sidebar ── */}
      <aside className="profile-sidebar">
        {/* Logo */}
        <div className="profile-sidebar-logo">
          <img src={logoIcon} alt="Cubit Logo" className="profile-sidebar-logo-icon" />
          <h2 className="profile-sidebar-logo-wordmark">
            <span className="profile-sidebar-logo-c">C</span> U B I T
          </h2>
        </div>

        {/* Vertical stats stacking */}
        <div className="profile-sidebar-stats-stack">
          <div className="profile-sidebar-stat-card" id="sidebar-stat-solves">
            <span className="profile-sidebar-stat-number">125</span>
            <p className="profile-sidebar-stat-label">Total Solves</p>
          </div>

          <div className="profile-sidebar-stat-card" id="sidebar-stat-pb">
            <span className="profile-sidebar-stat-number">5.04s</span>
            <p className="profile-sidebar-stat-label">Personal Best</p>
          </div>

          <div className="profile-sidebar-stat-card" id="sidebar-stat-avg">
            <span className="profile-sidebar-stat-number">7.09s</span>
            <p className="profile-sidebar-stat-label">Avg Solve</p>
          </div>
        </div>

        {/* Explore Stats link */}
        <Link to="/stats" className="profile-sidebar-explore-link" id="profile-explore-stats-link">
          <span>Explore Stats</span>
          <span className="profile-sidebar-explore-arrow">&gt;</span>
        </Link>
      </aside>
    </div>
  )
}
