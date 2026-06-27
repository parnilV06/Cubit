import React, { useState, useMemo } from 'react';
import '../../components/stats/stats.css';
import { mockSessions } from '../../mock/statsData';
import { 
  getOverallKPIs, 
  getSolveTrendData, 
  getTimeDistribution, 
  getProgressData, 
  getRecentSessionsSummary 
} from '../../utils/statsHelpers';

import StatsCards from '../../components/stats/StatsCards';
import StatsFilters from '../../components/stats/StatsFilters';
import SolveTrendChart from '../../components/stats/SolveTrendChart';
import DistributionChart from '../../components/stats/DistributionChart';
import ProgressChart from '../../components/stats/ProgressChart';
import RecentSessions from '../../components/stats/RecentSessions';
import { LogOut } from 'lucide-react';

export default function StatsDashboard() {
  const [currentPuzzle, setCurrentPuzzle] = useState('All');
  const [dateRange, setDateRange] = useState('All Time');

  // Filter data (mocking the backend API response filtering)
  const filteredSessions = useMemo(() => {
    let filtered = mockSessions;
    
    // Filter by puzzle
    if (currentPuzzle !== 'All') {
      filtered = filtered.filter(session => session.puzzle === currentPuzzle);
    }
    
    // Mock date filtering behavior for the frontend UI demo
    if (dateRange === 'Last 7 Days') {
      filtered = filtered.slice(-2); // Show only last 2 sessions
    } else if (dateRange === 'Last 30 Days') {
      filtered = filtered.slice(-4); // Show only last 4 sessions
    }

    return filtered;
  }, [currentPuzzle, dateRange]);

  // Compute processed data
  const kpis = useMemo(() => getOverallKPIs(filteredSessions), [filteredSessions]);
  const solveTrendData = useMemo(() => getSolveTrendData(filteredSessions), [filteredSessions]);
  const distributionData = useMemo(() => getTimeDistribution(filteredSessions), [filteredSessions]);
  const progressData = useMemo(() => getProgressData(filteredSessions), [filteredSessions]);
  const recentSessionsData = useMemo(() => getRecentSessionsSummary(filteredSessions), [filteredSessions]);

  return (
    <div className="stats-dashboard-wrapper">
      {/* Header */}
      <div className="stats-header-section">
        <div className="stats-title-block">
          <h1>Statistics</h1>
          <p>Analyze your solves and improve everyday</p>
        </div>
        <button className="export-btn">
          Export <LogOut size={16} />
        </button>
      </div>

      {/* Filters */}
      <StatsFilters 
        currentPuzzle={currentPuzzle} 
        onPuzzleChange={setCurrentPuzzle}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* KPI Cards */}
      <StatsCards kpis={kpis} />

      {/* Main Trend Chart */}
      <SolveTrendChart data={solveTrendData} />

      {/* Secondary Charts Grid */}
      <div className="charts-grid-2">
        <DistributionChart data={distributionData} />
        <ProgressChart data={progressData} />
      </div>

      {/* Recent Sessions Table */}
      <RecentSessions sessions={recentSessionsData} />
    </div>
  );
}
