import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoIcon from '../../assets/cubit-logo-icon-svg.svg'
import stopwatchIcon from '../../assets/stopwatch.svg'
import trainerIcon from '../../assets/trainer.svg'
import statsIcon from '../../assets/stats.svg'
import communityIcon from '../../assets/community.svg'
import userAddIcon from '../../assets/user-add.svg'

import './profile.css'

// Simple reusable modal overlay
const ModalOverlay = ({ onClose, title, children }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  }} onClick={onClose}>
    <div style={{
      backgroundColor: '#17171C', border: '1px solid #2B2B35',
      borderRadius: '12px', padding: '24px', width: '400px', maxWidth: '90%',
      position: 'relative', maxHeight: '80vh', overflowY: 'auto'
    }} onClick={e => e.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#A8A8B5', cursor: 'pointer', fontSize: '24px', lineHeight: '20px' }}>&times;</button>
      </div>
      {children}
    </div>
  </div>
);

export default function Profile() {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(null); // 'followers' or 'following' or null
  const [showPostsModal, setShowPostsModal] = useState(false);
  
  // We can track completed steps to dynamically update the timeline
  const completedStepsCount = 0; // matching "0 / 4 Completed" from the Figma design

  const dummyUsers = [
    { id: 1, name: 'Alice Smith', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop' },
    { id: 2, name: 'Bob Jones', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop' },
    { id: 3, name: 'Charlie Brown', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop' }
  ];

  const dummyPosts = [
    { id: 1, title: 'New 3x3 PB!', likes: 12, comments: 4, date: '2 days ago' },
    { id: 2, title: 'Learning OLL algs', likes: 8, comments: 1, date: '1 week ago' },
    { id: 3, title: 'Which lube is best?', likes: 15, comments: 22, date: '2 weeks ago' }
  ];

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
                <div className="profile-hero-stat-badge" onClick={() => setShowFollowModal('followers')} style={{ cursor: 'pointer' }}>
                  <span className="profile-hero-stat-value">25</span>
                  <span className="profile-hero-stat-label">Followers</span>
                </div>
                <div className="profile-hero-stat-badge" onClick={() => setShowFollowModal('following')} style={{ cursor: 'pointer' }}>
                  <span className="profile-hero-stat-value">30</span>
                  <span className="profile-hero-stat-label">Following</span>
                </div>
                <div className="profile-hero-stat-badge" onClick={() => setShowPostsModal(true)} style={{ cursor: 'pointer' }}>
                  <span className="profile-hero-stat-value">16</span>
                  <span className="profile-hero-stat-label">Posts</span>
                </div>
              </div>
            </div>
          </div>
          
          <button className="profile-edit-btn" id="profile-edit-button" onClick={() => setShowEditProfile(true)}>
            Edit Profile
          </button>
        </section>

        {/* Quick Actions */}
        <section className="profile-section-container">
          <h3 className="profile-section-title">Quick Actions</h3>
          
          <div className="profile-quick-actions-grid">
            <Link to="/app" className="profile-action-card" id="quick-action-timer">
              <div className="profile-action-icon-wrapper">
                <img src={stopwatchIcon} alt="Timer Icon" className="profile-action-icon" />
              </div>
              <h4 className="profile-action-title">Timer</h4>
              <p className="profile-action-desc">Start Solving now</p>
              <span className="profile-action-arrow">→</span>
            </Link>

            <Link to="/app/trainer" className="profile-action-card" id="quick-action-trainer">
              <div className="profile-action-icon-wrapper">
                <img src={trainerIcon} alt="Trainer Icon" className="profile-action-icon" />
              </div>
              <h4 className="profile-action-title">Trainer</h4>
              <p className="profile-action-desc">Learn and Train</p>
              <span className="profile-action-arrow">→</span>
            </Link>

            <Link to="/app/stats" className="profile-action-card" id="quick-action-stats">
              <div className="profile-action-icon-wrapper">
                <img src={statsIcon} alt="Stats Icon" className="profile-action-icon" />
              </div>
              <h4 className="profile-action-title">Stats</h4>
              <p className="profile-action-desc">Analyze your Stats</p>
              <span className="profile-action-arrow">→</span>
            </Link>

            <Link to="/app/community" className="profile-action-card" id="quick-action-community">
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
        <Link to="/app/stats" className="profile-sidebar-explore-link" id="profile-explore-stats-link">
          <span>Explore Stats</span>
          <span className="profile-sidebar-explore-arrow">&gt;</span>
        </Link>
      </aside>

      {/* MODALS */}
      
      {/* Edit Profile Modal */}
      {showEditProfile && (
        <ModalOverlay title="Edit Profile" onClose={() => setShowEditProfile(false)}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#A8A8B5', fontSize: '12px' }}>Profile Picture URL</label>
              <input type="text" defaultValue="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80" style={{ background: '#0D0D11', border: '1px solid #2B2B35', color: '#fff', padding: '10px', borderRadius: '6px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#A8A8B5', fontSize: '12px' }}>Name</label>
              <input type="text" defaultValue="John Doe" style={{ background: '#0D0D11', border: '1px solid #2B2B35', color: '#fff', padding: '10px', borderRadius: '6px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#A8A8B5', fontSize: '12px' }}>Email Address</label>
              <input type="email" defaultValue="john@example.com" style={{ background: '#0D0D11', border: '1px solid #2B2B35', color: '#fff', padding: '10px', borderRadius: '6px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#A8A8B5', fontSize: '12px' }}>Default Puzzle</label>
              <select style={{ background: '#0D0D11', border: '1px solid #2B2B35', color: '#fff', padding: '10px', borderRadius: '6px' }}>
                <option>3x3</option>
                <option>2x2</option>
                <option>4x4</option>
              </select>
            </div>
            <button type="button" onClick={() => setShowEditProfile(false)} style={{ background: '#572FF7', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>Save Changes</button>
          </form>
        </ModalOverlay>
      )}

      {/* Followers / Following Modal */}
      {showFollowModal && (
        <ModalOverlay 
          title={showFollowModal === 'followers' ? 'Followers' : 'Following'} 
          onClose={() => setShowFollowModal(null)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {dummyUsers.map(user => (
              <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#0D0D11', borderRadius: '8px', border: '1px solid #2B2B35' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={user.avatar} style={{ width: '30px', height: '30px', borderRadius: '50%' }} alt={user.name} />
                  <Link to="/profile" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>{user.name}</Link>
                </div>
                <button style={{ background: 'transparent', border: '1px solid #2B2B35', color: '#A8A8B5', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                  {showFollowModal === 'followers' ? 'Remove' : 'Unfollow'}
                </button>
              </div>
            ))}
          </div>
        </ModalOverlay>
      )}

      {/* Posts Modal */}
      {showPostsModal && (
        <ModalOverlay title="Your Posts" onClose={() => setShowPostsModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {dummyPosts.map(post => (
              <div key={post.id} style={{ padding: '12px', background: '#0D0D11', borderRadius: '8px', border: '1px solid #2B2B35' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '14px' }}>{post.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#A8A8B5', fontSize: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    {post.likes}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    {post.comments}
                  </span>
                  <span style={{ marginLeft: 'auto' }}>{post.date}</span>
                </div>
              </div>
            ))}
          </div>
        </ModalOverlay>
      )}

    </div>
  )
}
