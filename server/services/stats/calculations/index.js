const { calculatePB, calculateMean, calculateAO5, calculateAO12 } = require('./kpis');
const { calculateSolveTrend } = require('./trends');
const { calculateTimeDistribution } = require('./distribution');
const { calculateBestProgress } = require('./progress');
const { calculateRecentSessions } = require('./recentSessions');

module.exports = {
    calculatePB,
    calculateMean,
    calculateAO5,
    calculateAO12,
    calculateSolveTrend,
    calculateTimeDistribution,
    calculateBestProgress,
    calculateRecentSessions
};
