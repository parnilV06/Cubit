import { useState, useEffect, useMemo } from 'react';
import '../../components/stats/stats.css';
import { statsAPI } from '../../services/api';

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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await statsAPI.getDashboard();
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Compute processed and mapped data from live API payload
  const mappedStats = useMemo(() => {
    if (!data) return null;

    // 1. Map KPIs
    const kpis = {
      pb: data.kpis.pb ? (data.kpis.pb / 1000).toFixed(2) : '0.00',
      mean: data.kpis.mean ? (data.kpis.mean / 1000).toFixed(2) : '0.00',
      ao5: data.kpis.ao5 ? (data.kpis.ao5 / 1000).toFixed(2) : '0.00',
      ao12: data.kpis.ao12 ? (data.kpis.ao12 / 1000).toFixed(2) : '0.00',
      totalSolves: data.kpis.totalSolves || 0
    };

    // 2. Map Solve Trend Data
    const solveTrendData = data.solveTrend.map((item, index) => ({
      session: item.sessionName || `S${index + 1}`,
      pb: item.pb ? Number((item.pb / 1000).toFixed(2)) : null,
      mean: item.mean ? Number((item.mean / 1000).toFixed(2)) : null,
      ao5: item.ao5 ? Number((item.ao5 / 1000).toFixed(2)) : null,
      ao12: item.ao12 ? Number((item.ao12 / 1000).toFixed(2)) : null,
    }));

    // 3. Map Time Distribution
    const distributionData = data.timeDistribution.map(item => ({
      name: item.range,
      value: item.count
    }));

    // 4. Map Best Time Progress
    const progressData = data.bestProgress.map(item => ({
      date: item.sessionName,
      bestTime: item.bestTime ? Number((item.bestTime / 1000).toFixed(2)) : null
    }));

    // 5. Map Recent Sessions
    const recentSessionsData = data.recentSessions.map(item => ({
      name: item.sessionName,
      best: item.best ? (item.best / 1000).toFixed(2) : '--',
      mean: item.average ? (item.average / 1000).toFixed(2) : '--',
      ao5: '--',
      ao12: '--',
      date: new Date(item.createdAt).toLocaleDateString()
    }));

    return {
      kpis,
      solveTrendData,
      distributionData,
      progressData,
      recentSessionsData
    };
  }, [data]);

  if (loading) {
    return (
      <div className="stats-dashboard-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <p style={{ color: '#fff', fontSize: '1.2rem' }}>Loading dashboard statistics...</p>
      </div>
    );
  }

  if (!mappedStats) {
    return (
      <div className="stats-dashboard-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <p style={{ color: '#ff4d4d', fontSize: '1.2rem' }}>Failed to load statistics.</p>
      </div>
    );
  }

  return (
    <div className="stats-dashboard-wrapper">
      {/* Header */}
      <div className="stats-header-section">
        <div className="stats-title-block">
          <h1>Statistics</h1>
          <p>Analyze your solves and improve everyday</p>
        </div>
        <button className="export-btn" onClick={() => window.print()}>
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
      <StatsCards kpis={mappedStats.kpis} />

      {/* Main Trend Chart */}
      <SolveTrendChart data={mappedStats.solveTrendData} />

      {/* Secondary Charts Grid */}
      <div className="charts-grid-2">
        <DistributionChart data={mappedStats.distributionData} />
        <ProgressChart data={mappedStats.progressData} />
      </div>

      {/* Recent Sessions Table */}
      <RecentSessions sessions={mappedStats.recentSessionsData} />
    </div>
  );
}
