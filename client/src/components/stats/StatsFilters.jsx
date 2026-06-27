import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const StatsFilters = ({ currentPuzzle, onPuzzleChange, dateRange, onDateRangeChange }) => {
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const puzzles = ['All', '3 x 3', '2 x 2', '4 x 4'];
  const dateOptions = ['All Time', 'Last 7 Days', 'Last 30 Days', 'This Year'];

  return (
    <div className="stats-filters-row">
      <div className="puzzle-pills">
        {puzzles.map(p => (
          <div 
            key={p} 
            className={`filter-pill ${currentPuzzle === p ? 'active' : ''}`}
            onClick={() => onPuzzleChange && onPuzzleChange(p)}
          >
            {p}
          </div>
        ))}
      </div>
      <div style={{ position: 'relative' }}>
        <div 
          className="date-selector-pill"
          onClick={() => setShowDateDropdown(!showDateDropdown)}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {dateRange} <ChevronDown size={14} />
        </div>
        {showDateDropdown && (
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: '8px',
            backgroundColor: '#17171C', border: '1px solid #2B2B35',
            borderRadius: '8px', zIndex: 10, minWidth: '150px', overflow: 'hidden'
          }}>
            {dateOptions.map(option => (
              <div 
                key={option} 
                onClick={() => { 
                  if(onDateRangeChange) onDateRangeChange(option); 
                  setShowDateDropdown(false); 
                }}
                style={{
                  padding: '10px 15px', color: '#A8A8B5', fontSize: '14px',
                  cursor: 'pointer', background: dateRange === option ? '#2B2B35' : 'transparent'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#A8A8B5'}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsFilters;
