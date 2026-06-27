
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#17171C', border: '1px solid #2B2B35', padding: '10px 15px', borderRadius: '8px' }}>
        <p style={{ color: '#fff', margin: 0, fontSize: '12px', fontWeight: 'bold' }}>
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const DistributionChart = ({ data }) => {
  // Use shades of purple based on Cubit primary #572FF7
  const COLORS = ['#3a1d9e', '#4825cc', '#572FF7', '#7758fa', '#9881fc'];

  // Filter out 0 value bins to make the donut look cleaner, unless they all are 0
  const chartData = data?.filter(d => d.value > 0) || [];

  return (
    <div className="stats-chart-card">
      <h3>Time Distribution</h3>
      <div className="chart-placeholder-box" style={{ height: '220px', background: 'transparent', border: 'none', flexDirection: 'row' }}>
        
        <div style={{ flex: 1, minWidth: '120px', height: '100%', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '10px', minWidth: '100px' }}>
          {data?.map((entry, index) => (
            <div key={entry.name} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length], marginRight: '15px' }}></div>
              <span style={{ color: '#A8A8B5', fontSize: '12px', width: '45px' }}>{entry.name}</span>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginLeft: 'auto' }}>
                {entry.value}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default DistributionChart;
