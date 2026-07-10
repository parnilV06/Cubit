const { prisma } = require('../config/database');
const calculations = require('./stats/calculations');

const getDashboardStats = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            sessions: {
                where: { isArchived: false },
                orderBy: { createdAt: 'asc' },
                include: {
                    solves: {
                        orderBy: { createdAt: 'asc' }
                    }
                }
            }
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    const sessions = user.sessions;
    const allSolves = sessions.flatMap(s => s.solves);

    if (sessions.length === 0 || allSolves.length === 0) {
        return {
            kpis: {
                pb: null,
                ao5: null,
                ao12: null,
                mean: null,
                totalSolves: 0,
                totalSessions: sessions.length
            },
            solveTrend: [],
            timeDistribution: [],
            bestProgress: [],
            recentSessions: []
        };
    }

    return {
        kpis: {
            pb: calculations.calculatePB(allSolves),
            ao5: calculations.calculateAO5(allSolves),
            ao12: calculations.calculateAO12(allSolves),
            mean: calculations.calculateMean(allSolves),
            totalSolves: allSolves.length,
            totalSessions: sessions.length
        },
        solveTrend: calculations.calculateSolveTrend(sessions),
        timeDistribution: calculations.calculateTimeDistribution(allSolves),
        bestProgress: calculations.calculateBestProgress(sessions),
        recentSessions: calculations.calculateRecentSessions(sessions)
    };
};

module.exports = {
    getDashboardStats
};