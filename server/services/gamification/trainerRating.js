const { TRAINER_REWARDS } = require('./constants');

/**
 * Awards Trainer Rating for first-time completion of a lesson.
 * Idempotent: Subsequent completion or reopening awards 0 points.
 * 
 * @param {string} userId 
 * @param {string} lessonId 
 * @param {string} difficulty 
 * @param {object} tx - Prisma transaction client
 * @returns {number} Awarded Trainer Rating
 */
const awardTrainerCompletion = async (userId, lessonId, difficulty = 'easy', tx) => {
    if (!lessonId) return 0;

    // Check if user has already received a trainer completion reward for this lesson
    const existingLedger = await tx.ratingLedger.findUnique({
        where: {
            userId_lessonId: {
                userId,
                lessonId
            }
        }
    });

    if (existingLedger) {
        return 0; // Already awarded!
    }

    const diffKey = String(difficulty).toLowerCase();
    const points = TRAINER_REWARDS[diffKey] || 1.00;

    await tx.ratingLedger.create({
        data: {
            userId,
            category: 'TRAINER',
            amount: points,
            lessonId,
            description: `Trainer Lesson Completion Reward (${difficulty}) (+${points.toFixed(2)})`
        }
    });

    await tx.user.update({
        where: { id: userId },
        data: {
            totalRating: { increment: points }
        }
    });

    return points;
};

module.exports = {
    awardTrainerCompletion
};
