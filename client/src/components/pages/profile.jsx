import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../../services/store';
import { profileAPI, friendAPI, statsAPI, trainerAPI } from '../../services/api';
import logoIcon from '../../assets/cubit-logo-icon-svg.svg';
import stopwatchIcon from '../../assets/stopwatch.svg';
import trainerIcon from '../../assets/trainer.svg';
import statsIcon from '../../assets/stats.svg';
import communityIcon from '../../assets/community.svg';
import userAddIcon from '../../assets/user-add.svg';

import './profile.css';

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
  const user = useStore((state) => state.user);
  const fetchMe = useStore((state) => state.fetchMe);
  const { username: paramUsername } = useParams();

  const targetUsername = paramUsername || user?.username;
  const isOwnProfile = !paramUsername || (user && paramUsername === user.username);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Edit Profile States
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals
  const [showFollowModal, setShowFollowModal] = useState(null); // 'friends' or null
  const [friendsList, setFriendsList] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  // Stats Dashboard KPIs
  const [statsData, setStatsData] = useState(null);

  // Trainer Progress
  const [trainerProgress, setTrainerProgress] = useState(null);

  // Fetch all necessary data on mount / user change
  useEffect(() => {
    if (!targetUsername) return;
    
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profileResponse = await profileAPI.getProfile(targetUsername);
        setProfileData(profileResponse.data);
        
        if (isOwnProfile) {
          setEditDisplayName(profileResponse.data.displayName || '');
          setEditBio(profileResponse.data.bio || '');

          // Fetch stats dashboard for own profile
          const statsResponse = await statsAPI.getDashboard();
          setStatsData(statsResponse.data);

          // Fetch trainer progress for own profile
          const trainerResponse = await trainerAPI.getProgress();
          setTrainerProgress(trainerResponse.data);
        }
      } catch (err) {
        console.error('Failed to load profile details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [targetUsername, isOwnProfile]);

  // Load friends if the modal opens
  useEffect(() => {
    if (showFollowModal === 'friends') {
      const fetchFriends = async () => {
        try {
          setLoadingFriends(true);
          const response = await friendAPI.getFriends();
          setFriendsList(response.data);
        } catch (err) {
          console.error('Failed to load friends list:', err);
        } finally {
          setLoadingFriends(false);
        }
      };
      fetchFriends();
    }
  }, [showFollowModal]);

  // Handle saving profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      
      await profileAPI.updateProfile({ displayName: editDisplayName, bio: editBio });

      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        await profileAPI.uploadAvatar(formData);
      }

      await fetchMe();
      const updatedProfile = await profileAPI.getProfile(user.username);
      setProfileData(updatedProfile.data);
      setShowEditProfile(false);
      setAvatarFile(null);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Error updating profile: ' + (err.message || 'Check logs'));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      setActionLoading(true);
      await friendAPI.sendRequest(profileData.username);
      setProfileData(prev => ({ ...prev, relationshipStatus: 'OUTGOING_PENDING' }));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to send friend request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptFriendRequest = async () => {
    try {
      setActionLoading(true);
      await friendAPI.acceptRequest(profileData.requestId);
      setProfileData(prev => ({ ...prev, relationshipStatus: 'ACCEPTED', totalFriends: (prev.totalFriends || 0) + 1 }));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to accept friend request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (window.confirm('Are you sure you want to remove this friend?')) {
      try {
        await friendAPI.deleteFriendship(friendId);
        const response = await friendAPI.getFriends();
        setFriendsList(response.data);
        const profileResponse = await profileAPI.getProfile(targetUsername);
        setProfileData(profileResponse.data);
      } catch (err) {
        console.error('Failed to delete friendship:', err);
      }
    }
  };

  // Determine Getting Started timeline progress dynamically
  const isStep1Completed = useMemo(() => {
    return !!profileData?.avatarUrl && !profileData.avatarUrl.includes('dicebear.com/7.x/avataaars');
  }, [profileData]);

  const isStep2Completed = useMemo(() => {
    return !!trainerProgress && trainerProgress.completedLessons > 0;
  }, [trainerProgress]);

  const isStep3Completed = useMemo(() => {
    return !!statsData && statsData.kpis?.totalSolves > 0;
  }, [statsData]);

  const isStep4Completed = useMemo(() => {
    return !!profileData && (profileData.totalFriends > 0 || profileData.totalPosts > 0);
  }, [profileData]);

  const completedStepsCount = useMemo(() => {
    return [isStep1Completed, isStep2Completed, isStep3Completed, isStep4Completed].filter(Boolean).length;
  }, [isStep1Completed, isStep2Completed, isStep3Completed, isStep4Completed]);

  if (loading || !profileData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0D0D11', color: '#fff' }}>
        <p>Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* ── Left Column: Main content ── */}
      <main className="profile-main-content">
        <header className="profile-header">
          <h1 className="profile-header-title">{isOwnProfile ? 'Profile' : `${profileData.displayName || profileData.username}'s Profile`}</h1>
          <p className="profile-header-sub">{isOwnProfile ? 'Your home on Cubit' : `@${profileData.username}`}</p>
        </header>

        {/* Profile Card (Hero) */}
        <section className="profile-hero-card">
          <div className="profile-hero-content">
            <div className="profile-avatar-container">
              <img 
                src={profileData?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"} 
                alt={`${profileData?.displayName || profileData?.username}'s avatar`} 
                className="profile-avatar-img"
              />
            </div>
            
            <div className="profile-hero-details">
              <h2 className="profile-display-name">{profileData?.displayName || profileData?.username}</h2>
              <p className="profile-bio" style={{ color: '#A8A8B5', fontSize: '0.9rem', marginTop: '4px', maxWidth: '400px' }}>
                {profileData?.bio || "No bio yet."}
              </p>
              
              <div className="profile-hero-stats-row" style={{ marginTop: '15px' }}>
                <div className="profile-hero-stat-badge" onClick={() => isOwnProfile && setShowFollowModal('friends')} style={{ cursor: isOwnProfile ? 'pointer' : 'default' }}>
                  <span className="profile-hero-stat-value">{profileData?.totalFriends || 0}</span>
                  <span className="profile-hero-stat-label">Friends</span>
                </div>
                <div className="profile-hero-stat-badge">
                  <span className="profile-hero-stat-value">{profileData?.totalPosts || 0}</span>
                  <span className="profile-hero-stat-label">Posts</span>
                </div>
              </div>
            </div>
          </div>
          
          {isOwnProfile ? (
            <button className="profile-edit-btn" id="profile-edit-button" onClick={() => setShowEditProfile(true)}>
              Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              {profileData?.relationshipStatus === 'NONE' && (
                <button 
                  className="profile-edit-btn" 
                  style={{ backgroundColor: '#572FF7', color: '#fff', border: 'none' }} 
                  disabled={actionLoading}
                  onClick={handleSendFriendRequest}
                >
                  {actionLoading ? '...' : 'Add Friend +'}
                </button>
              )}
              {profileData?.relationshipStatus === 'OUTGOING_PENDING' && (
                <button className="profile-edit-btn" style={{ backgroundColor: '#2B2B35', color: '#A8A8B5', border: 'none' }} disabled>
                  Requested
                </button>
              )}
              {profileData?.relationshipStatus === 'INCOMING_PENDING' && (
                <button 
                  className="profile-edit-btn" 
                  style={{ backgroundColor: '#34A853', color: '#fff', border: 'none' }} 
                  disabled={actionLoading}
                  onClick={handleAcceptFriendRequest}
                >
                  {actionLoading ? '...' : 'Accept Request'}
                </button>
              )}
              {profileData?.relationshipStatus === 'ACCEPTED' && (
                <button className="profile-edit-btn" style={{ backgroundColor: '#1E3A8A', color: '#60A5FA', border: 'none' }} disabled>
                  Friends ✓
                </button>
              )}
            </div>
          )}
        </section>

        {/* Quick Actions (For Own Profile) */}
        {isOwnProfile && (
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
        )}

        {/* Getting Started (For Own Profile) */}
        {isOwnProfile && (
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
                <div className={`profile-timeline-step ${isStep1Completed ? 'completed' : 'active'}`}>
                  <div className="profile-timeline-number">1</div>
                  <div className="profile-timeline-step-icon-wrapper">
                    <img src={userAddIcon} alt="User Add Icon" className="profile-timeline-step-icon" />
                  </div>
                  <h4 className="profile-timeline-step-title">Upload Profile Pic</h4>
                  <p className="profile-timeline-step-desc">Add a profile picture</p>
                </div>

                {/* Step 2 */}
                <div className={`profile-timeline-step ${isStep2Completed ? 'completed' : ''}`}>
                  <div className="profile-timeline-number">2</div>
                  <div className="profile-timeline-step-icon-wrapper">
                    <img src={trainerIcon} alt="Trainer Icon" className="profile-timeline-step-icon" />
                  </div>
                  <h4 className="profile-timeline-step-title">Learn the Basics</h4>
                  <p className="profile-timeline-step-desc">Learn & Train</p>
                </div>

                {/* Step 3 */}
                <div className={`profile-timeline-step ${isStep3Completed ? 'completed' : ''}`}>
                  <div className="profile-timeline-number">3</div>
                  <div className="profile-timeline-step-icon-wrapper">
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
                <div className={`profile-timeline-step ${isStep4Completed ? 'completed' : ''}`}>
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
        )}
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
            <span className="profile-sidebar-stat-number">
              {isOwnProfile ? (statsData?.kpis?.totalSolves ?? profileData?.totalSolves ?? 0) : (profileData?.totalSolves ?? 0)}
            </span>
            <p className="profile-sidebar-stat-label">Total Solves</p>
          </div>

          <div className="profile-sidebar-stat-card" id="sidebar-stat-pb">
            <span className="profile-sidebar-stat-number">
              {isOwnProfile ? (
                statsData?.kpis?.pb ? `${Number(statsData.kpis.pb).toFixed(2)}s` : '-- : --'
              ) : (
                profileData?.pb ? `${(Number(profileData.pb) / 1000).toFixed(2)}s` : '-- : --'
              )}
            </span>
            <p className="profile-sidebar-stat-label">Personal Best</p>
          </div>

          <div className="profile-sidebar-stat-card" id="sidebar-stat-avg">
            <span className="profile-sidebar-stat-number">
              {isOwnProfile ? (
                statsData?.kpis?.mean ? `${Number(statsData.kpis.mean).toFixed(2)}s` : '-- : --'
              ) : (
                profileData?.avgSolve ? `${(Number(profileData.avgSolve) / 1000).toFixed(2)}s` : '-- : --'
              )}
            </span>
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
      {showEditProfile && isOwnProfile && (
        <ModalOverlay title="Edit Profile" onClose={() => setShowEditProfile(false)}>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#A8A8B5', fontSize: '12px' }}>Upload Profile Picture</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setAvatarFile(e.target.files[0])}
                style={{ color: '#fff', fontSize: '14px' }} 
              />
              {avatarFile && <span style={{ color: '#34a853', fontSize: '11px' }}>Selected: {avatarFile.name}</span>}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#A8A8B5', fontSize: '12px' }}>Display Name</label>
              <input 
                type="text" 
                value={editDisplayName} 
                onChange={(e) => setEditDisplayName(e.target.value)}
                style={{ background: '#0D0D11', border: '1px solid #2B2B35', color: '#fff', padding: '10px', borderRadius: '6px' }} 
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#A8A8B5', fontSize: '12px' }}>Bio</label>
              <textarea 
                value={editBio} 
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Write something about your speedcubing journey..."
                style={{ background: '#0D0D11', border: '1px solid #2B2B35', color: '#fff', padding: '10px', borderRadius: '6px', minHeight: '80px', fontFamily: 'inherit' }} 
              />
            </div>

            <button 
              type="submit" 
              disabled={savingProfile} 
              style={{ background: '#572FF7', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
            >
              {savingProfile ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </ModalOverlay>
      )}

      {/* Friends Modal */}
      {showFollowModal === 'friends' && isOwnProfile && (
        <ModalOverlay 
          title="Friends List" 
          onClose={() => setShowFollowModal(null)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {loadingFriends ? (
              <p style={{ color: '#A8A8B5', textAlign: 'center' }}>Loading friends list...</p>
            ) : friendsList.length === 0 ? (
              <p style={{ color: '#A8A8B5', textAlign: 'center' }}>No friends yet. Head to Community to find friends!</p>
            ) : (
              friendsList.map(friend => (
                <div key={friend.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#0D0D11', borderRadius: '8px', border: '1px solid #2B2B35' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                      src={friend.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=572ff7"} 
                      style={{ width: '30px', height: '30px', borderRadius: '50%' }} 
                      alt={friend.displayName || friend.username} 
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{friend.displayName || friend.username}</span>
                      <span style={{ color: '#A8A8B5', fontSize: '11px' }}>@{friend.username}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveFriend(friend.id)}
                    style={{ background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                  >
                    Unfriend
                  </button>
                </div>
              ))
            )}
          </div>
        </ModalOverlay>
      )}

    </div>
  );
}
