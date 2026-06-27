import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#17171C', border: '1px solid #2B2B35', padding: '10px 15px', borderRadius: '8px' }}>
        <p style={{ color: '#A8A8B5', margin: '0 0 5px 0', fontSize: '12px' }}>{label}</p>
        <p style={{ color: '#fff', margin: 0, fontWeight: 'bold' }}>{payload[0].value}s</p>
      </div>
    );
  }
  return null;
};

const SolveTrendChart = ({ data }) => {
  const [metric, setMetric] = useState('ao5'); // default to AO5
  const [showDropdown, setShowDropdown] = useState(false);

  const metrics = [
    { key: 'ao5', label: 'AO5' },
    { key: 'ao12', label: 'AO12' },
    { key: 'mean', label: 'Mean' },
    { key: 'pb', label: 'PB' }
  ];

  const currentMetric = metrics.find(m => m.key === metric);

  return (
    <div className="stats-chart-card trend-card">
      <div className="trend-header">
        <h3>Solve Time Trends</h3>
        <div style={{ position: 'relative' }}>
          <div 
            className="trend-dropdown" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {currentMetric.label} <ChevronDown size={14} />
          </div>
          {showDropdown && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '5px',
              backgroundColor: '#17171C', border: '1px solid #2B2B35',
              borderRadius: '8px', zIndex: 10, minWidth: '100px', overflow: 'hidden'
            }}>
              {metrics.map(m => (
                <div 
                  key={m.key} 
                  onClick={() => { setMetric(m.key); setShowDropdown(false); }}
                  style={{
                    padding: '8px 15px', color: '#A8A8B5', fontSize: '12px',
                    cursor: 'pointer', background: metric === m.key ? '#2B2B35' : 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#A8A8B5'}
                >
                  {m.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="chart-placeholder-box" style={{ height: '260px', background: 'transparent', border: 'none' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPurpleTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#572FF7" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#572FF7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2B2B35" vertical={false} />
            <XAxis dataKey="session" stroke="#A8A8B5" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis reversed={true} stroke="#A8A8B5" fontSize={12} tickLine={false} axisLine={false} dx={-10} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey={metric} 
              stroke="#572FF7" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPurpleTrend)" 
              baseValue="dataMax"
              activeDot={{ r: 6, fill: '#572FF7', stroke: '#fff', strokeWidth: 2 }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SolveTrendChart;
