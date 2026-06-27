/**
 * Helper functions for Statistics calculations
 */

// Basic math helpers
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const mean = (arr) => arr.length ? sum(arr) / arr.length : 0;
const min = (arr) => arr.length ? Math.min(...arr) : 0;

// Calculate WCA average of N (remove best and worst)
export const calculateAverageOfN = (solves, n) => {
  if (!solves || solves.length < n) return null;
  // Calculate rolling averages and find the best one
  let bestAvg = Infinity;
  
  for (let i = 0; i <= solves.length - n; i++) {
    const window = solves.slice(i, i + n);
    const sorted = [...window].sort((a, b) => a - b);
    sorted.pop(); // remove worst
    sorted.shift(); // remove best
    const currentAvg = mean(sorted);
    if (currentAvg < bestAvg) {
      bestAvg = currentAvg;
    }
  }
  return bestAvg === Infinity ? null : Number(bestAvg.toFixed(2));
};

// KPI Generators
export const getOverallKPIs = (sessions) => {
  if (!sessions || sessions.length === 0) return { pb: 0, mean: 0, ao5: 0, ao12: 0 };
  
  const allSolves = sessions.flatMap(s => s.solves);
  
  return {
    pb: min(allSolves).toFixed(2),
    mean: mean(allSolves).toFixed(2),
    ao5: calculateAverageOfN(allSolves, 5),
    ao12: calculateAverageOfN(allSolves, 12),
    totalSolves: allSolves.length
  };
};

export const getSessionKPIs = (session) => {
  if (!session || !session.solves) return null;
  return {
    pb: min(session.solves).toFixed(2),
    mean: mean(session.solves).toFixed(2),
    ao5: calculateAverageOfN(session.solves, 5)
  };
};

// Data formatters for charts

// 1. Solve Trend Data (AreaChart)
export const getSolveTrendData = (sessions) => {
  if (!sessions || sessions.length === 0) return [];
  return sessions.map((session, index) => {
    return {
      session: `S${index + 1}`,
      ao5: calculateAverageOfN(session.solves, 5),
      ao12: calculateAverageOfN(session.solves, 12),
      mean: Number(mean(session.solves).toFixed(2)),
      pb: Number(min(session.solves).toFixed(2))
    };
  });
};

// 2. Time Distribution (Donut Chart)
export const getTimeDistribution = (sessions) => {
  if (!sessions || sessions.length === 0) return [];
  const allSolves = sessions.flatMap(s => s.solves);
  
  const bins = {
    '<6s': 0,
    '6–8s': 0,
    '8–10s': 0,
    '10–12s': 0,
    '> 12s': 0
  };
  
  allSolves.forEach(time => {
    if (time < 6) bins['<6s']++;
    else if (time < 8) bins['6–8s']++;
    else if (time < 10) bins['8–10s']++;
    else if (time < 12) bins['10–12s']++;
    else bins['> 12s']++;
  });

  return Object.keys(bins).map(key => ({
    name: key,
    value: bins[key]
  }));
};

// 3. Best Time Progress over Sessions (LineChart)
export const getProgressData = (sessions) => {
  if (!sessions || sessions.length === 0) return [];
  
  return sessions.map((session, index) => ({
    sessionName: `Session ${index + 1}`, // Ensure standard X-axis names or use session.sessionName
    date: new Date(session.date).toLocaleDateString(),
    bestTime: Number(min(session.solves).toFixed(2)),
  }));
};

// 4. Recent Sessions Summary
export const getRecentSessionsSummary = (sessions) => {
  if (!sessions) return [];
  
  // Sort descending by date
  const sorted = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return sorted.map(session => ({
    id: session.id,
    date: new Date(session.date).toLocaleDateString(),
    name: session.sessionName,
    solveCount: session.solves.length,
    mean: Number(mean(session.solves).toFixed(2)),
    best: min(session.solves).toFixed(2),
    ao5: calculateAverageOfN(session.solves, 5) || '--',
    ao12: calculateAverageOfN(session.solves, 12) || '--'
  }));
};
