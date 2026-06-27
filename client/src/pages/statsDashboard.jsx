import React, { useState, useMemo } from 'react';
import { mockSessions } from '../mock/statsData';
import { 
  getOverallKPIs, 
  getSessionTrendData, 
  getTimeDistribution, 
  getProgressData, 
  getRecentSessionsSummary 
} from '../utils/statsHelpers';

import StatsCards from '../components/stats/StatsCards';
import StatsFilters from '../components/stats/StatsFilters';
import SolveTrendChart from '../components/stats/SolveTrendChart';
import DistributionChart from '../components/stats/DistributionChart';
import ProgressChart from '../components/stats/ProgressChart';
import RecentSessions from '../components/stats/RecentSessions';

const StatsDashboard = () => {
  // State
  const [currentPuzzle, setCurrentPuzzle] = useState('3x3');
  const [dateRange, setDateRange] = useState('all');

  // Filter data (mocking the backend API response filtering)
  const filteredSessions = useMemo(() => {
    return mockSessions.filter(session => session.puzzle === currentPuzzle);
  }, [currentPuzzle, dateRange]); // In a real app, dateRange would filter dates here

  // Compute processed data
  const kpis = useMemo(() => getOverallKPIs(filteredSessions), [filteredSessions]);
  const distributionData = useMemo(() => getTimeDistribution(filteredSessions), [filteredSessions]);
  const progressData = useMemo(() => getProgressData(filteredSessions), [filteredSessions]);
  const recentSessionsData = useMemo(() => getRecentSessionsSummary(filteredSessions), [filteredSessions]);
  
  // For the trend chart, we can show the most recent session's trend as an example
  const latestSessionTrend = useMemo(() => {
    if (filteredSessions.length === 0) return [];
    const latest = filteredSessions[filteredSessions.length - 1];
    return getSessionTrendData(latest);
  }, [filteredSessions]);

  return (
    <div className="stats-dashboard-container">
      <div className="stats-header">
        <h2>Statistics Dashboard</h2>
        <StatsFilters 
          currentPuzzle={currentPuzzle} 
          onPuzzleChange={setCurrentPuzzle}
          onDateRangeChange={setDateRange}
        />
      </div>

      <StatsCards kpis={kpis} />

      <div className="stats-charts-grid">
        <SolveTrendChart data={latestSessionTrend} />
        <DistributionChart data={distributionData} />
        <ProgressChart data={progressData} />
      </div>

      <RecentSessions sessions={recentSessionsData} />
    </div>
  );
};

export default StatsDashboard;
