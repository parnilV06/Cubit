
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCards = ({ kpis }) => {
  const cards = [
    { label: 'Best Time', value: kpis?.pb || '5 : 04', trend: 'up', percentage: '%3' },
    { label: 'AO5', value: kpis?.ao5 || '7 : 23', trend: 'up', percentage: '%3' },
    { label: 'AO12', value: kpis?.ao12 || '8 : 11', trend: 'down', percentage: '%1' },
    { label: 'Mean', value: kpis?.mean || '7 : 09', trend: 'up', percentage: '%3' }
  ];

  return (
    <div className="kpi-cards-container">
      {cards.map((card, idx) => (
        <div className="kpi-card" key={idx}>
          <div className="kpi-label">{card.label}</div>
          <div className="kpi-value-row">
            <span className="kpi-value">{card.value}</span>
            <span className={`kpi-trend ${card.trend}`}>
              {card.trend === 'up' ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />} 
              {card.percentage}
            </span>
          </div>
          <div className="kpi-subtext">vs last 7 days</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
