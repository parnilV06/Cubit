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
          <div className="stats-list-item">
            <span>25 . &nbsp;&nbsp; 11:23</span>
          </div>
          <div className="stats-list-item">
            <span>24 . &nbsp;&nbsp; 12:13</span>
            <span className="badge dnf">DNF</span>
          </div>
          <div className="stats-list-item">
            <span>23 . &nbsp;&nbsp; 10:22</span>
          </div>
          <div className="stats-list-item">
            <span>22 . &nbsp;&nbsp; 7:98</span>
          </div>
          <div className="stats-list-item">
            <span>21 . &nbsp;&nbsp; 8:87</span>
            <span className="badge pb">P.B</span>
          </div>
          <div className="stats-list-item">
            <span>20 . &nbsp;&nbsp; 12:09</span>
            <span className="badge plus2">+2</span>
          </div>
          <div className="stats-list-item">
            <span>19 . &nbsp;&nbsp; 9:89</span>
          </div>
          <div className="stats-list-item">
            <span>18 . &nbsp;&nbsp; 6:98</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
