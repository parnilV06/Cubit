import React from 'react';
import './appStyles.css';

export default function Community() {
  return (
    <div className="playground-container no-stats-bar">
      <div className="community-layout">
        
        {/* Main Feed */}
        <div className="community-feed">
          <div className="create-post">
            <input type="text" placeholder="Share your latest PB or ask a question..." />
            <button>Post</button>
          </div>

          <div className="post-card">
            <div className="post-header">
              <div className="avatar"></div>
              <h4>CubingMaster99</h4>
            </div>
            <p>Just broke my PB! 7.42s on a crazy lucky scramble.</p>
          </div>

          <div className="post-card">
            <div className="post-header">
              <div className="avatar"></div>
              <h4>SpeedySolve</h4>
            </div>
            <p>Anyone have tips for learning ZBLL? It feels overwhelming.</p>
          </div>
        </div>

        {/* Right Sidebar for Community (Leaderboard & Events) */}
        <div className="community-sidebar">
          <div className="community-widget leaderboard-widget">
            <h3>Top Cubers</h3>
            <ul>
              <li>1. Felix Z. - 4.22s</li>
              <li>2. Max P. - 4.31s</li>
              <li>3. Yiheng W. - 4.48s</li>
            </ul>
          </div>
          
          <div className="community-widget events-widget">
            <h3>Upcoming Events</h3>
            <div className="event-item">
              <h4>Weekly Comp #42</h4>
              <p>Starts in 2 days</p>
            </div>
            <div className="event-item">
              <h4>F2L Masterclass</h4>
              <p>Live Stream - Tomorrow 8PM</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
