import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../services/store';
import { getSocket } from '../../services/socket';
import { communityAPI, friendAPI, notificationAPI } from '../../services/api';
import './community.css';
import { X, Send, UserCheck, UserPlus, Clock } from 'lucide-react';

// SVGs and Images
import friendsIcon from '../../assets/friends.svg';
import bellIcon from '../../assets/bell.svg';
import plusIcon from '../../assets/square-plus.svg';
import globalIcon from '../../assets/global.svg';
import heartIcon from '../../assets/heart.svg';
import commentIcon from '../../assets/comment.svg';
import cubeImg4 from '../../assets/cube-illustration-4.png';

const FEED_TAGS = ['All', 'Tips', 'Random', 'Discussions', 'News', 'Solves'];

export default function Community() {
  const user = useStore(state => state.user);

  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [activeTags, setActiveTags] = useState(['All']);
  const [activeFeedTab, setActiveFeedTab] = useState('Global');
  const [activeLbTab, setActiveLbTab] = useState('Rating');
  const [activeLbFilter, setActiveLbFilter] = useState('Global');
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [activeUserPopover, setActiveUserPopover] = useState(null);

  // New Post form states
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('DISCUSSION');
  const [newContent, setNewContent] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [submittingPost, setSubmittingPost] = useState(false);

  // Comments state
  const [postComments, setPostComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // Notifications state
  const [notifications, setNotifications] = useState([]);

  // Friends search and request states
  const [isFriendsPopoverOpen, setIsFriendsPopoverOpen] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);

  // Fetch initial posts & friends
  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const response = await communityAPI.getPosts();
      setPosts(response.data || []);
    } catch (err) {
      console.error('Failed to fetch community posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await friendAPI.getFriends();
      setFriends(response.data || []);
    } catch (err) {
      console.error('Failed to fetch friends list:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await friendAPI.getRequests();
      setFriendRequests(response.data.incoming || []);
    } catch (err) {
      console.error('Failed to fetch friend requests:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchFriends();
    fetchNotifications();
  }, []);

  // Listen to incoming real-time notifications via Socket.io
  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      const handleNewNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
      };
      socket.on('notification:new', handleNewNotification);
      return () => {
        socket.off('notification:new', handleNewNotification);
      };
    }
  }, []);

  // Sync friend requests when popover opens
  useEffect(() => {
    if (isFriendsPopoverOpen) {
      fetchFriendRequests();
    }
  }, [isFriendsPopoverOpen]);

  const toggleLike = async (postId, currentLiked) => {
    try {
      if (currentLiked) {
        await communityAPI.unlikePost(postId);
      } else {
        await communityAPI.likePost(postId);
      }
      // Reload posts to reflect new like counts/status from backend
      const response = await communityAPI.getPosts();
      setPosts(response.data || []);
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleCommentsToggle = async (postId) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);
    } else {
      setActiveCommentPostId(postId);
      try {
        const response = await communityAPI.getPost(postId);
        setPostComments(prev => ({
          ...prev,
          [postId]: response.data.comments || []
        }));
      } catch (err) {
        console.error('Failed to load post comments:', err);
      }
    }
  };

  const handleAddComment = async (postId) => {
    const content = commentInputs[postId] || '';
    if (!content.trim()) return;

    try {
      const response = await communityAPI.addComment(postId, content);
      setPostComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), response.data]
      }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      // Increment comment count locally
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p));
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleCreatePostSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingPost(true);
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('type', newType);
      formData.append('content', newContent);
      if (newFile) {
        formData.append('image', newFile);
      }

      await communityAPI.createPost(formData);
      await fetchPosts();
      
      // Reset form
      setNewTitle('');
      setNewType('DISCUSSION');
      setNewContent('');
      setNewFile(null);
      setIsAddPostModalOpen(false);
    } catch (err) {
      console.error('Failed to create community post:', err);
      alert(err.response?.data?.message || 'Error creating post.');
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleSendFriendRequest = async (targetUsername) => {
    try {
      await friendAPI.sendRequest(targetUsername);
      alert(`Friend request sent to @${targetUsername}!`);
      setActiveUserPopover(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send friend request');
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await friendAPI.acceptRequest(requestId);
      alert('Friend request accepted!');
      fetchFriendRequests();
      fetchFriends();
    } catch (err) {
      console.error('Failed to accept request:', err);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await friendAPI.rejectRequest(requestId);
      alert('Friend request rejected.');
      fetchFriendRequests();
    } catch (err) {
      console.error('Failed to reject request:', err);
    }
  };

  const handleManualFriendSearch = async (e) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;
    try {
      setSendingRequest(true);
      await friendAPI.sendRequest(searchUsername.trim());
      alert(`Friend request sent to @${searchUsername}!`);
      setSearchUsername('');
    } catch (err) {
      alert(err.response?.data?.message || 'User not found or request already exists');
    } finally {
      setSendingRequest(false);
    }
  };

  const handleMarkNotificationsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
  };

  // Tag & Feed selection filtering logic
  const toggleTag = (tag) => {
    if (tag === 'All') {
      setActiveTags(['All']);
    } else {
      let newTags = activeTags.filter(t => t !== 'All');
      if (newTags.includes(tag)) {
        newTags = newTags.filter(t => t !== tag);
      } else {
        newTags.push(tag);
      }
      if (newTags.length === 0) {
        setActiveTags(['All']);
      } else {
        setActiveTags(newTags);
      }
    }
  };

  const filteredPosts = useMemo(() => {
    let result = posts;

    // Filter by Tab (Global vs Friends)
    if (activeFeedTab === 'Friends' && user) {
      const friendIds = new Set(friends.map(f => f.id));
      result = result.filter(post => friendIds.has(post.author.id) || post.author.id === user.id);
    }

    // Filter by selected tag filters
    if (!activeTags.includes('All')) {
      result = result.filter(post => {
        return activeTags.some(t => {
          if (t === 'Solves') return post.type === 'SOLVE_SHARE' || post.type === 'PB_SHARE';
          if (t === 'Discussions') return post.type === 'DISCUSSION';
          if (t === 'Tips') return post.type === 'TIP';
          if (t === 'News') return post.type === 'NEWS';
          if (t === 'Random') return post.type === 'QUESTION' || post.type === 'RANDOM';
          return post.type && post.type.toLowerCase().includes(t.toLowerCase());
        });
      });
    }

    return result;
  }, [posts, activeFeedTab, activeTags, friends, user]);

  return (
    <div className="community-container">
      {/* Header Area */}
      <div className="community-header-area">
        <div className="community-header-text">
          <h2>Cubit Community</h2>
          <p>Connect, Share and Grow with Cubers all around the World.</p>
        </div>
        
        <div className="community-header-actions" style={{ position: 'relative' }}>
          <button className="new-post-btn" onClick={() => setIsAddPostModalOpen(true)}>
            New Post
            <img src={plusIcon} alt="Add" className="btn-icon-right" />
          </button>
          
          {/* Friends Management Popover Button */}
          <div className="friends-btn-wrapper" style={{ position: 'relative' }}>
            <button className="icon-btn-header" onClick={() => setIsFriendsPopoverOpen(!isFriendsPopoverOpen)}>
              <img src={friendsIcon} alt="Friends Management" />
              {friendRequests.length > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#572ff7', color: '#fff', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {friendRequests.length}
                </span>
              )}
            </button>

            {isFriendsPopoverOpen && (
              <div className="notifications-popover" style={{ width: '300px', right: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2B2B35', paddingBottom: '10px', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0 }}>Social & Friend Requests</h4>
                  <button onClick={() => setIsFriendsPopoverOpen(false)} style={{ background: 'none', border: 'none', color: '#A8A8B5', cursor: 'pointer' }}><X size={16} /></button>
                </div>

                <form onSubmit={handleManualFriendSearch} style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter username..." 
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    style={{ flex: 1, background: '#0D0D11', border: '1px solid #2B2B35', color: '#fff', padding: '6px 10px', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <button 
                    type="submit" 
                    disabled={sendingRequest}
                    style={{ background: '#572ff7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                  >
                    Add
                  </button>
                </form>

                <h5 style={{ color: '#A8A8B5', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px' }}>Pending Requests ({friendRequests.length})</h5>
                <div className="notifications-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {friendRequests.length === 0 ? (
                    <p style={{ color: '#A8A8B5', fontSize: '11px', textAlign: 'center', padding: '10px 0' }}>No pending requests.</p>
                  ) : (
                    friendRequests.map(req => (
                      <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1c1c24' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img src={req.sender.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"} style={{ width: '24px', height: '24px', borderRadius: '50%' }} alt="avatar" />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>{req.sender.displayName || req.sender.username}</span>
                            <span style={{ color: '#A8A8B5', fontSize: '10px' }}>@{req.sender.username}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button onClick={() => handleAcceptRequest(req.id)} style={{ background: '#34a853', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', padding: '4px' }}><UserCheck size={12} /></button>
                          <button onClick={() => handleRejectRequest(req.id)} style={{ background: '#ff4d4d', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', padding: '4px' }}><X size={12} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Trigger */}
          <div className="notification-wrapper">
            <button className="icon-btn-header" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
              <img src={bellIcon} alt="Notifications" />
              {notifications.some(n => !n.isRead) && (
                <span className="notification-dot" style={{ position: 'absolute', top: '5px', right: '5px', width: '8px', height: '8px', backgroundColor: '#ff4d4d', borderRadius: '50%' }} />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="notifications-popover">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4>Notifications</h4>
                  {notifications.some(n => !n.isRead) && (
                    <button onClick={handleMarkNotificationsRead} style={{ background: 'none', border: 'none', color: '#572FF7', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Mark all read
                    </button>
                  )}
                </div>
                
                <div className="notifications-list" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <p style={{ color: '#A8A8B5', textAlign: 'center', fontSize: '12px', padding: '20px' }}>All caught up!</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`notification-item ${n.isRead ? 'read' : 'unread'}`} style={{ opacity: n.isRead ? 0.6 : 1, padding: '10px 0', borderBottom: '1px solid #2B2B35' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#fff' }}>{n.message}</p>
                        <span style={{ fontSize: '10px', color: '#A8A8B5', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                          <Clock size={10} /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="community-main-layout">
        
        {/* Left Column: Feed */}
        <div className="community-feed-column">
          <div className="feed-header-top">
            <h3 className="section-title">Community Feed</h3>
            
            <div className="feed-filters">
              <button 
                className={`feed-filter-btn ${activeFeedTab === 'Global' ? 'active' : ''}`}
                onClick={() => setActiveFeedTab('Global')}
              >
                <span>Global</span>
                <img src={globalIcon} alt="Global" />
              </button>
              
              <button 
                className={`feed-filter-btn ${activeFeedTab === 'Friends' ? 'active' : ''}`}
                onClick={() => setActiveFeedTab('Friends')}
              >
                <span>Friends</span>
                <img src={friendsIcon} alt="Friends" />
              </button>
            </div>
          </div>
          
          <div className="feed-tags-menu">
            {FEED_TAGS.map(tag => (
              <button 
                key={tag} 
                className={`feed-tag-btn ${activeTags.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="feed-posts-scroll">
            {loadingPosts ? (
              <p style={{ color: '#fff', textAlign: 'center', padding: '40px' }}>Loading posts...</p>
            ) : filteredPosts.length === 0 ? (
              <p style={{ color: '#A8A8B5', textAlign: 'center', padding: '40px' }}>No posts found in this feed category.</p>
            ) : (
              filteredPosts.map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-card-content">
                    <div className="post-header-info">
                      <div className="post-user-info">
                        <img 
                          src={post.author.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=John"} 
                          alt={post.author.displayName || post.author.username} 
                          className="post-avatar" 
                        />
                        <div className="post-meta" style={{ position: 'relative' }}>
                          <span 
                            className="post-author" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => setActiveUserPopover(activeUserPopover === post.id ? null : post.id)}
                          >
                            {post.author.displayName || post.author.username}
                          </span>
                          
                          {activeUserPopover === post.id && (
                            <div style={{
                              position: 'absolute', top: '20px', left: 0, marginTop: '5px',
                              backgroundColor: '#17171C', border: '1px solid #2B2B35',
                              borderRadius: '8px', zIndex: 20, minWidth: '120px', overflow: 'hidden',
                              display: 'flex', flexDirection: 'column'
                            }}>
                              <Link to="/profile" style={{
                                padding: '10px 15px', color: '#A8A8B5', fontSize: '12px', textDecoration: 'none',
                                borderBottom: '1px solid #2B2B35'
                              }} onClick={() => setActiveUserPopover(null)}>
                                View Profile
                              </Link>
                              
                              {user && post.author.id !== user.id && (
                                <button 
                                  style={{
                                    padding: '10px 15px', color: '#572FF7', fontSize: '12px', background: 'transparent',
                                    border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold'
                                  }} 
                                  onClick={() => handleSendFriendRequest(post.author.username)}
                                >
                                  Add Friend +
                                </button>
                              )}
                            </div>
                          )}

                          <span className="post-time">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="post-tag-badge">{post.type}</div>
                    </div>
                    
                    <div className="post-body">
                      <h4 className="post-title">{post.title}</h4>
                      {post.solve && (
                        <div className="post-pb-time">
                          {(post.solve.time / 1000).toFixed(2)}s {post.solve.penalty && `(${post.solve.penalty})`}
                        </div>
                      )}
                      <p className="post-desc" style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                    </div>
                  </div>

                  <div className="post-right-side">
                    <div className="post-image-container">
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt="Post Attachment" className="post-image" />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: '#17171c', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                          <span style={{ color: '#2B2B35', fontSize: '11px' }}>Cubit Feed</span>
                        </div>
                      )}
                      
                      <div className="post-actions">
                        <button 
                          className={`post-action-btn ${post.isLiked ? 'liked' : ''}`}
                          onClick={() => toggleLike(post.id, post.isLiked)}
                        >
                          <img src={heartIcon} alt="Like" className="action-icon-img" />
                          <span>{post.likeCount}</span>
                        </button>
                        
                        <button 
                          className="post-action-btn"
                          onClick={() => handleCommentsToggle(post.id)}
                        >
                          <img src={commentIcon} alt="Comment" className="action-icon-img" />
                          <span>{post.commentCount}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Comments Popover inside post */}
                  {activeCommentPostId === post.id && (
                    <div className="comments-popover">
                      <div className="comments-header">
                        <h4>Comments</h4>
                        <button onClick={() => setActiveCommentPostId(null)} className="close-btn"><X size={16}/></button>
                      </div>
                      
                      <div className="comments-list" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {!postComments[post.id] || postComments[post.id].length === 0 ? (
                          <p style={{ color: '#A8A8B5', fontSize: '11px', textAlign: 'center', padding: '10px' }}>No comments yet.</p>
                        ) : (
                          postComments[post.id].map(c => (
                            <div key={c.id} className="comment-item">
                              <span className="comment-user">{c.author.displayName || c.author.username}</span>
                              <p className="comment-text">{c.content}</p>
                            </div>
                          ))
                        )}
                      </div>
                      
                      <div className="comment-input-bar">
                        <input 
                          type="text" 
                          placeholder="Add a comment..." 
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                        />
                        <button onClick={() => handleAddComment(post.id)}><Send size={16}/></button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="community-sidebar-column">
          {/* Leaderboard Card */}
          <div className="sidebar-card leaderboard-card">
            <div className="sidebar-card-header">
              <h3 className="section-title">Leaderboard</h3>
              <div className="header-icons">
                <img 
                  src={friendsIcon} 
                  alt="Friends" 
                  className={`small-icon filter-icon ${activeLbFilter === 'Friends' ? 'active' : ''}`}
                  onClick={() => setActiveLbFilter('Friends')}
                />
                <img 
                  src={globalIcon} 
                  alt="Global" 
                  className={`small-icon filter-icon ${activeLbFilter === 'Global' ? 'active' : ''}`}
                  onClick={() => setActiveLbFilter('Global')}
                />
              </div>
            </div>
            
            <div className="leaderboard-headers">
              <div 
                className={`lb-col-title ${activeLbTab === 'Rating' ? 'active' : ''}`}
                onClick={() => setActiveLbTab('Rating')}
                style={{ cursor: 'pointer' }}
              >
                Top Cuber ( Rating )
              </div>
              <div 
                className={`lb-col-title ${activeLbTab === 'Fastest' ? 'active' : ''}`}
                onClick={() => setActiveLbTab('Fastest')}
                style={{ cursor: 'pointer' }}
              >
                Fastest ( P.B )
              </div>
            </div>

            <div className="leaderboard-list">
              {[
                { rank: 1, name: "John Doe", score: "999", color: "#F5BE0B" },
                { rank: 2, name: "Speed Master", score: "950", color: "#8F8E8A" },
                { rank: 3, name: "Tony Stark", score: "899", color: "#A65A09" },
                { rank: 4, name: "Bruhaa", score: "888", color: "#A768D4" },
                { rank: 5, name: "Ded Cuber", score: "845", color: "#A768D4" }
              ].map(user => (
                <div key={user.rank} className="leaderboard-item">
                  <div className="lb-user-info">
                    <div className="lb-rank" style={{ backgroundColor: user.color }}>{user.rank}.</div>
                    <span className="lb-name">{user.name}</span>
                  </div>
                  <span className="lb-score">{user.score}</span>
                </div>
              ))}
              <button className="view-all-btn">View All</button>
            </div>
          </div>

          {/* Events Card */}
          <div className="sidebar-card events-card">
            <h3 className="section-title">Events</h3>
            <div className="events-content">
              <div className="events-img-container">
                <img src={cubeImg4} alt="Events Coming Soon" />
              </div>
              <h4 className="events-title">Coming Soon !</h4>
              <p className="events-desc">Exciting Events are coming soon to Cubit ! Stay Tuned !</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Post Modal */}
      {isAddPostModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddPostModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Post</h3>
              <button onClick={() => setIsAddPostModalOpen(false)} className="close-btn"><X size={20}/></button>
            </div>
            
            <form className="add-post-form" onSubmit={handleCreatePostSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  placeholder="What's on your mind?" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={newType} 
                  onChange={(e) => setNewType(e.target.value)}
                  required
                >
                  <option value="DISCUSSION">Discussions</option>
                  <option value="QUESTION">Question</option>
                  <option value="TIP">Tips</option>
                  <option value="NEWS">News</option>
                  <option value="RANDOM">Random</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows="4" 
                  placeholder="Add more details..." 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Add Image (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="file-input" 
                  onChange={(e) => setNewFile(e.target.files[0])}
                />
              </div>
              
              <button type="submit" disabled={submittingPost} className="submit-post-btn">
                {submittingPost ? 'Posting...' : 'Post to Community'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
