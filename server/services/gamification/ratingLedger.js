const { prisma } = require('../../config/database');

/**
 * Retrieves auditable rating breakdown and streak statistics for a user.
 * 
 * @param {string} userId 
 * @param {object} tx - Prisma transaction client (optional)
 * @returns {object} { totalRating, breakdown, streak }
 */
const getUserRatingSummary = async (userId, tx = prisma) => {
    const user = await tx.user.findUnique({
        where: { id: userId },
        select: {
            totalRating: true,
            currentStreak: true,
            longestStreak: true
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const ledgerGroups = await tx.ratingLedger.groupBy({
        by: ['category'],
        where: { userId },
        _sum: { amount: true }
    });

    const categorySums = {
        SOLVE: 0,
        IMPROVEMENT: 0,
        TRAINER: 0,
        DAILY_ACTIVITY: 0,
        STREAK_BONUS: 0
    };

    ledgerGroups.forEach(group => {
        if (group.category in categorySums) {
            categorySums[group.category] = group._sum.amount ? Number(group._sum.amount) : 0;
        }
    });

    const solve = Number(categorySums.SOLVE.toFixed(2));
    const improvement = Number(categorySums.IMPROVEMENT.toFixed(2));
    const trainer = Number(categorySums.TRAINER.toFixed(2));
    const activity = Number((categorySums.DAILY_ACTIVITY + categorySums.STREAK_BONUS).toFixed(2));

    const total = Number((user.totalRating ? Number(user.totalRating) : (solve + improvement + trainer + activity)).toFixed(2));

    return {
        totalRating: total,
        breakdown: {
            solve,
            improvement,
            trainer,
            activity
        },
        streak: {
            current: user.currentStreak || 0,
            longest: user.longestStreak || 0
        }
    };
};

module.exports = {
    getUserRatingSummary
};
