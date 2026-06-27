import { useState } from 'react';
import './appStyles.css';
import cube2dNet from '../../assets/cube-2d-net-scramble.png';
import playPauseIcon from '../../assets/play-pause.svg';
import volumeIcon from '../../assets/volume.svg';

export default function TimerDashboard() {
  // State for the 4 bottom features. Max 2 can be true.
  const [selectedFeatures, setSelectedFeatures] = useState({
    visualizer: true,
    notes: false,
    session: false,
    focus: false
  });

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev => {
      const isCurrentlySelected = prev[feature];
      
      if (isCurrentlySelected) {
        // Deselect it
        return { ...prev, [feature]: false };
      } else {
        // Count how many are currently selected
        const selectedCount = Object.values(prev).filter(Boolean).length;
        if (selectedCount >= 2) {
          // If 2 are already selected, we can't select more (or we could replace one).
          // For now, let's just ignore the click or perhaps unselect the first one.
          // Let's implement replacing the first selected one for better UX.
          const firstSelected = Object.keys(prev).find(key => prev[key]);
          return { ...prev, [firstSelected]: false, [feature]: true };
        } else {
          return { ...prev, [feature]: true };
        }
      }
    });
  };

  return (
    <div className="dashboard-container">
      {/* Top Main Timer Area */}
      <div className="timer-main-area">
        <div className="scramble-box">
          <div className="scramble-title">Scramble</div>
          <div className="scramble-text-container">
            <div className="scramble-text">
              R2 F2 U' L2 U F2 U2 R2 D' F' D R B L U B2 L' F' R2 U
            </div>
          </div>
        </div>

        <div className="timer-display-box">
          <div className="timer-digits">0 : 00</div>
          <div className="timer-instruction">Hold 'SPACE' and release to start</div>
        </div>

        <div className="timer-actions">
          <button className="timer-btn">Reset</button>
          <button className="timer-btn primary">New Scramble</button>
        </div>
      </div>

      {/* Bottom Features Area */}
      <div className="features-bottom-area">
        <div className="features-tabs">
          <button 
            className={`feature-tab ${selectedFeatures.visualizer ? 'active' : ''}`}
            onClick={() => handleFeatureToggle('visualizer')}
          >
            Visualizer
          </button>
          <button 
            className={`feature-tab ${selectedFeatures.notes ? 'active' : ''}`}
            onClick={() => handleFeatureToggle('notes')}
          >
            Notes
          </button>
          <button 
            className={`feature-tab ${selectedFeatures.session ? 'active' : ''}`}
            onClick={() => handleFeatureToggle('session')}
          >
            Session
          </button>
          <button 
            className={`feature-tab ${selectedFeatures.focus ? 'active' : ''}`}
            onClick={() => handleFeatureToggle('focus')}
          >
            Focus Mode
          </button>
        </div>

        <div className="features-content">
          {selectedFeatures.visualizer && (
            <div className="feature-panel visualizer-panel">
              <div className="feature-panel-title">Scrambled State</div>
              <img src={cube2dNet} alt="Cube 2D Net" className="cube-net-img" />
            </div>
          )}

          {selectedFeatures.notes && (
            <div className="feature-panel notes-panel">
              <div className="feature-panel-title">Session Notes</div>
              <textarea placeholder="Type your notes here..." className="notes-textarea"></textarea>
            </div>
          )}

          {selectedFeatures.session && (
            <div className="feature-panel session-panel">
              <div className="feature-panel-title">Session Details</div>
              <div className="session-details-content">
                <p>Current Session: 3x3 WCA</p>
                <p>Solves: 25</p>
                <p>Mean: 8.65</p>
              </div>
            </div>
          )}

          {selectedFeatures.focus && (
            <div className="feature-panel focus-panel">
              <div className="focus-title">Deep Focus Synth Music</div>
              <div className="focus-progress-container">
                <div className="focus-progress-bar">
                  <div className="focus-progress-fill" style={{width: '50%'}}></div>
                </div>
                <div className="focus-time">2:00 / 4:00</div>
              </div>
              <div className="focus-controls">
                <select className="track-select">
                  <option>choose track...</option>
                </select>
                <button className="icon-btn"><img src={playPauseIcon} alt="Play" /></button>
                <button className="icon-btn"><img src={volumeIcon} alt="Volume" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
