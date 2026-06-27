import React, { useState } from 'react';
import './community.css';
import { Heart, MessageSquare, PlusSquare, Users, Bell, X, Send } from 'lucide-react';

// SVGs and Images
import friendsIcon from '../../assets/friends.svg';
import bellIcon from '../../assets/bell.svg';
import plusIcon from '../../assets/square-plus.svg';
import globalIcon from '../../assets/global.svg';
import heartIcon from '../../assets/heart.svg';
import commentIcon from '../../assets/comment.svg';

import pbImage from '../../assets/cube-illustration-PB.png';
import catPost from '../../assets/cat-post.png';
import dedPost from '../../assets/ded-post.png';
import avatar1 from '../../assets/bruha-mock.png'
import cubeImg4 from '../../assets/cube-illustration-4.png'
const MOCK_POSTS = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    time: "5 mins ago",
    tag: "Solves",
    title: "New P.B on 3x3 ! Finally into sub'5",
    desc: "Scramble : R2 F2 U' L2 U F2 U2 R2 D' F' D R B L U B2 L' F' R2 U",
    pbTime: "5:04s",
    image: pbImage,
    likes: 5,
    comments: 5
  },
  {
    id: 2,
    name: "Bruhaa",
    avatar: avatar1,
    time: "2 days ago",
    tag: "Discussions",
    title: "These Forking algorithsm are so stoobid",
    desc: "Any help or tips on how to learn them easily ?",
    image: catPost,
    likes: 7,
    comments: 25
  },
  {
    id: 3,
    name: "Ded Cuber",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ded",
    time: "1 day ago",
    tag: "Random",
    title: "I am Officially Dead Goyzz",
    desc: "See ya'll in hell\nMay me and My Beloved Rubik's Cube Rest in Pieces ",
    image: dedPost,
    likes: 25,
    comments: 11
  }
];

const FEED_TAGS = ['All', 'Tips', 'Random', 'Discussions', 'News', 'Solves'];

const MOCK_NOTIFICATIONS = [
  { id: 1, text: "SpeedySolve commented on your post", time: "10m ago" },
  { id: 2, text: "Bruhaa liked your post", time: "1h ago" },
  { id: 3, text: "New weekly event started!", time: "1d ago" }
];

const MOCK_COMMENTS = [
  { id: 1, user: "Felix Z.", text: "Crazy scramble! Nice solve." },
  { id: 2, user: "Max P.", text: "Sub 5 incoming soon!" }
];

export default function Community() {
  const [activeTags, setActiveTags] = useState(['All']);
  const [activeFeedTab, setActiveFeedTab] = useState('Friends');
  const [activeLbTab, setActiveLbTab] = useState('Rating');
  const [activeLbFilter, setActiveLbFilter] = useState('Global');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  const toggleLike = (postId) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
  };

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

  return (
    <div className="community-container">
      {/* Header Area */}
      <div className="community-header-area">
        <div className="community-header-text">
          <h2>Cubit Community</h2>
          <p>Connect , Share and Grow with Cubers all around the World.</p>
        </div>
        <div className="community-header-actions">
          <button className="new-post-btn" onClick={() => setIsAddPostModalOpen(true)}>
            New Post
            <img src={plusIcon} alt="Add" className="btn-icon-right" />
          </button>
          <button className="icon-btn-header">
            <img src={friendsIcon} alt="Friends" />
          </button>
          <div className="notification-wrapper">
            <button className="icon-btn-header" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
              <img src={bellIcon} alt="Notifications" />
            </button>
            {isNotificationsOpen && (
              <div className="notifications-popover">
                <h4>Notifications</h4>
                <div className="notifications-list">
                  {MOCK_NOTIFICATIONS.map(n => (
                    <div key={n.id} className="notification-item">
                      <p>{n.text}</p>
                      <span>{n.time}</span>
                    </div>
                  ))}
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
            {MOCK_POSTS.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-card-content">
                  <div className="post-header-info">
                    <div className="post-user-info">
                      <img src={post.avatar} alt={post.name} className="post-avatar" />
                      <div className="post-meta">
                        <span className="post-author">{post.name}</span>
                        <span className="post-time">{post.time}</span>
                      </div>
                    </div>
                    <div className="post-tag-badge">{post.tag}</div>
                  </div>
                  
                  <div className="post-body">
                    <h4 className="post-title">{post.title}</h4>
                    {post.pbTime && <div className="post-pb-time">{post.pbTime}</div>}
                    <p className="post-desc">{post.desc}</p>
                  </div>
                </div>

                <div className="post-right-side">
                  <div className="post-image-container">
                    <img src={post.image} alt="Post Attachment" className="post-image" />
                    <div className="post-actions">
                      <button 
                        className={`post-action-btn ${likedPosts.has(post.id) ? 'liked' : ''}`}
                        onClick={() => toggleLike(post.id)}
                      >
                        <img src={heartIcon} alt="Like" className="action-icon-img" />
                        <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                      </button>
                      <button 
                        className="post-action-btn"
                        onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      >
                        <img src={commentIcon} alt="Comment" className="action-icon-img" />
                        <span>{post.comments}</span>
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
                    <div className="comments-list">
                      {MOCK_COMMENTS.map(c => (
                        <div key={c.id} className="comment-item">
                          <span className="comment-user">{c.user}</span>
                          <p className="comment-text">{c.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="comment-input-bar">
                      <input type="text" placeholder="Add a comment..." />
                      <button><Send size={16}/></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
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
            <form className="add-post-form" onSubmit={e => { e.preventDefault(); setIsAddPostModalOpen(false); }}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" placeholder="What's on your mind?" required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select required>
                  <option value="">Select Category</option>
                  <option value="tips">Tips</option>
                  <option value="discussions">Discussions</option>
                  <option value="news">News</option>
                  <option value="random">Random</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="4" placeholder="Add more details..." required></textarea>
              </div>
              <div className="form-group">
                <label>Add Image (Optional)</label>
                <input type="file" accept="image/*" className="file-input" />
              </div>
              <button type="submit" className="submit-post-btn">Post to Community</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
