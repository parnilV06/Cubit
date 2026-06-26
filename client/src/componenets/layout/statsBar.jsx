import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import './layout.css';

const StatsBar = ({ isExpanded, setIsExpanded }) => {
  return (
    <div className={`app-stats-bar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button 
        className={`stats-toggle-btn ${!isExpanded ? 'collapsed' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      <div className="stats-content">
        <div className="stats-dropdowns">
          <select className="stats-dropdown">
            <option>Session 101001</option>
          </select>
          <select className="stats-dropdown">
            <option>3 x 3 WCA</option>
          </select>
        </div>

        <div className="stats-grid">
          <div className="stats-box">
            <div className="stats-box-title">P.B</div>
            <div className="stats-box-value">5 : 04</div>
          </div>
          <div className="stats-box">
            <div className="stats-box-title">MEAN</div>
            <div className="stats-box-value">8 : 65</div>
          </div>
          <div className="stats-box">
            <div className="stats-box-title">A012</div>
            <div className="stats-box-value">11 : 31</div>
          </div>
          <div className="stats-box">
            <div className="stats-box-title">A05</div>
            <div className="stats-box-value">10 : 09</div>
          </div>
        </div>

        <div className="stats-solves-title">Total Solves : 25</div>
        <div className="stats-divider"></div>

        <div className="stats-list">
          {Array.from({ length: 25 }, (_, index) => {
            const num = 25 - index;
            // Dummy data generation to match previous styling
            let time = '11:23';
            if (num === 24) time = '12:13';
            if (num === 23) time = '10:22';
            if (num === 22) time = '7:98';
            if (num === 21) time = '8:87';
            if (num === 20) time = '12:09';
            if (num === 19) time = '9:89';
            if (num === 18) time = '6:98';
            if (num < 18) time = `${Math.floor(Math.random() * 4 + 7)}:${Math.floor(Math.random() * 90 + 10)}`;

            return (
              <div className="stats-list-item" key={num}>
                <span>{num} . &nbsp;&nbsp; {time}</span>
                {num === 24 && <span className="badge dnf">DNF</span>}
                {num === 21 && <span className="badge pb">P.B</span>}
                {num === 20 && <span className="badge plus2">+2</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
