const { DAILY_ACTIVITY_REWARD, STREAK_MILESTONES } = require('./constants');

/**
 * Formats a Date object or timestamp into YYYY-MM-DD calendar date string.
 */
const getCalendarDateString = (dateObj = new Date()) => {
    const d = new Date(dateObj);
    return d.toISOString().split('T')[0];
};

/**
 * Calculates calendar day difference between two YYYY-MM-DD strings.
 */
const getDayDifference = (dateStr1, dateStr2) => {
    if (!dateStr1 || !dateStr2) return null;
    const d1 = new Date(dateStr1 + 'T00:00:00Z');
    const d2 = new Date(dateStr2 + 'T00:00:00Z');
    const diffTime = d1.getTime() - d2.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Evaluates Daily Activity and Streak Progression for a user when a solve is completed.
 * 
 * @param {string} userId 
 * @param {Date|string} solveTimestamp 
 * @param {object} tx - Prisma transaction client
 * @returns {object} { dailyRatingAwarded, milestoneBonusAwarded, currentStreak }
 */
const evaluateDailyActivityAndStreak = async (userId, solveTimestamp = new Date(), tx) => {
    const activityDate = getCalendarDateString(solveTimestamp);

    // Check if daily activity reward was already awarded for this calendar date
    const existingDailyLedger = await tx.ratingLedger.findUnique({
        where: {
            userId_activityDate_category: {
                userId,
                activityDate,
                category: 'DAILY_ACTIVITY'
            }
        }
    });

    if (existingDailyLedger) {
        const user = await tx.user.findUnique({
            where: { id: userId },
            select: { currentStreak: true, longestStreak: true }
        });
        return {
            dailyRatingAwarded: 0,
            milestoneBonusAwarded: 0,
            currentStreak: user?.currentStreak || 0
        };
    }

    let dailyRatingAwarded = DAILY_ACTIVITY_REWARD;
    let milestoneBonusAwarded = 0;

    // 1. Award Daily Activity Point (+1.00)
    await tx.ratingLedger.create({
        data: {
            userId,
            category: 'DAILY_ACTIVITY',
            amount: dailyRatingAwarded,
            activityDate,
            description: `Daily Cubing Activity Reward for ${activityDate} (+1.00)`
        }
    });

    // 2. Fetch current streak data for user
    const user = await tx.user.findUnique({
        where: { id: userId },
        select: { lastActiveDate: true, currentStreak: true, longestStreak: true }
    });

    let newStreak = 1;
    if (user && user.lastActiveDate) {
        const diffDays = getDayDifference(activityDate, user.lastActiveDate);
        if (diffDays === 1) {
            // Consecutive day!
            newStreak = (user.currentStreak || 0) + 1;
        } else if (diffDays === 0) {
            // Same day (fallback)
            newStreak = user.currentStreak || 1;
        } else {
            // Missed one or more calendar days: broken streak resets to 1
            newStreak = 1;
        }
    }

    const newLongest = Math.max(user?.longestStreak || 0, newStreak);

    // 3. Check for Streak Milestone Bonus
    const bonusAmount = STREAK_MILESTONES[newStreak];
    if (bonusAmount) {
        // Award streak milestone bonus
        await tx.ratingLedger.create({
            data: {
                userId,
                category: 'STREAK_BONUS',
                amount: bonusAmount,
                activityDate,
                streakMilestone: newStreak,
                description: `${newStreak}-Day Streak Milestone Bonus (+${bonusAmount.toFixed(2)})`
            }
        });
        milestoneBonusAwarded = bonusAmount;
    }

    // 4. Update User Model
    const totalAddition = dailyRatingAwarded + milestoneBonusAwarded;
    await tx.user.update({
        where: { id: userId },
        data: {
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastActiveDate: activityDate,
            totalRating: { increment: totalAddition }
        }
    });

    return {
        dailyRatingAwarded,
        milestoneBonusAwarded,
        currentStreak: newStreak
    };
};

module.exports = {
    getCalendarDateString,
    getDayDifference,
    evaluateDailyActivityAndStreak
};
