
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

const ProgressChart = ({ data }) => {
  return (
    <div className="stats-chart-card" style={{ flex: 1.5 }}>
      <h3>Best Time Progress</h3>
      <div className="chart-placeholder-box" style={{ height: '220px', background: 'transparent', border: 'none' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPurpleProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#572FF7" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#572FF7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2B2B35" vertical={false} />
            <XAxis dataKey="date" stroke="#A8A8B5" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis reversed={true} stroke="#A8A8B5" fontSize={12} tickLine={false} axisLine={false} dx={-10} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="bestTime" 
              stroke="#572FF7" 
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPurpleProgress)"
              baseValue="dataMax"
              activeDot={{ r: 6, fill: '#572FF7', stroke: '#fff', strokeWidth: 2 }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
