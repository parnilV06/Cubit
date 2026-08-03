const { prisma } = require('../../config/database');
const { calculateSolveRating } = require('./solveRating');
const { evaluateSessionImprovement } = require('./improvementRating');
const { evaluateDailyActivityAndStreak } = require('./activityAndStreaks');
const { awardTrainerCompletion } = require('./trainerRating');

/**
 * Main Authoritative Gamification Engine for Cubit
 */

/**
 * Handles solve creation lifecycle: calculates solve points, records ledger entry, and evaluates daily activity & streaks.
 */
const processSolveCreation = async (userId, solve, tx = prisma) => {
    // 1. Fetch session to determine puzzle type
    const session = await tx.session.findUnique({
        where: { id: solve.sessionId },
        select: { puzzleType: true }
    });

    const puzzleType = session?.puzzleType || 'THREE_BY_THREE';

    // 2. Calculate Solve Rating
    const points = calculateSolveRating(puzzleType, solve.time, solve.penalty);

    // 3. Create Solve Rating Ledger Entry
    await tx.ratingLedger.create({
        data: {
            userId,
            category: 'SOLVE',
            amount: points,
            solveId: solve.id,
            sessionId: solve.sessionId,
            description: `Solve Rating for ${puzzleType} (${solve.time}ms, penalty: ${solve.penalty})`
        }
    });

    // 4. Update User Cached Total Rating
    await tx.user.update({
        where: { id: userId },
        data: {
            totalRating: { increment: points }
        }
    });

    // 5. Evaluate Daily Activity & Streak Progression
    const streakResult = await evaluateDailyActivityAndStreak(userId, solve.createdAt || new Date(), tx);

    return {
        solveRating: points,
        streakResult
    };
};

/**
 * Handles solve penalty mutation lifecycle: recalculates solve rating and reconciles difference.
 */
const processSolveMutation = async (userId, solveId, newPenalty, tx = prisma) => {
    const solve = await tx.solve.findUnique({
        where: { id: solveId },
        include: {
            session: true,
            ratingLedger: true
        }
    });

    if (!solve || solve.session.userId !== userId) {
        throw new Error("Solve not found or unauthorized");
    }

    const puzzleType = solve.session.puzzleType || 'THREE_BY_THREE';
    const newPoints = calculateSolveRating(puzzleType, solve.time, newPenalty);

    let oldPoints = 0;
    if (solve.ratingLedger) {
        oldPoints = Number(solve.ratingLedger.amount);
        await tx.ratingLedger.update({
            where: { id: solve.ratingLedger.id },
            data: {
                amount: newPoints,
                description: `Updated Solve Rating for ${puzzleType} (penalty: ${newPenalty})`
            }
        });
    } else {
        await tx.ratingLedger.create({
            data: {
                userId,
                category: 'SOLVE',
                amount: newPoints,
                solveId: solve.id,
                sessionId: solve.sessionId,
                description: `Solve Rating for ${puzzleType} (penalty: ${newPenalty})`
            }
        });
    }

    const diff = newPoints - oldPoints;
    if (diff !== 0) {
        await tx.user.update({
            where: { id: userId },
            data: {
                totalRating: { increment: Number(diff.toFixed(4)) }
            }
        });
    }

    return { oldPoints, newPoints, diff };
};

/**
 * Handles solve deletion lifecycle: reverses solve rating contribution.
 */
const processSolveDeletion = async (userId, solveId, tx = prisma) => {
    const solve = await tx.solve.findUnique({
        where: { id: solveId },
        include: {
            session: true,
            ratingLedger: true
        }
    });

    if (!solve || solve.session.userId !== userId) {
        return { removedRating: 0 };
    }

    let removedRating = 0;
    if (solve.ratingLedger) {
        removedRating = Number(solve.ratingLedger.amount);
        await tx.ratingLedger.delete({
            where: { id: solve.ratingLedger.id }
        });

        if (removedRating > 0) {
            await tx.user.update({
                where: { id: userId },
                data: {
                    totalRating: { decrement: Number(removedRating.toFixed(4)) }
                }
            });
        }
    }

    return { removedRating };
};

/**
 * Handles session closing/switching: evaluates session improvement.
 */
const processSessionCloseOrSwitch = async (userId, sessionId, tx = prisma) => {
    if (!sessionId) return 0;
    return await evaluateSessionImprovement(userId, sessionId, tx);
};

/**
 * Reconciles user cached totalRating against authoritative ledger entries.
 */
const reconcileUserRating = async (userId, tx = prisma) => {
    const aggregate = await tx.ratingLedger.aggregate({
        where: { userId },
        _sum: { amount: true }
    });

    const sum = aggregate._sum.amount ? Number(aggregate._sum.amount) : 0;
    const roundedSum = Number(sum.toFixed(4));

    await tx.user.update({
        where: { id: userId },
        data: { totalRating: roundedSum }
    });

    return {
        userId,
        reconciledTotal: roundedSum
    };
};

module.exports = {
    processSolveCreation,
    processSolveMutation,
    processSolveDeletion,
    processSessionCloseOrSwitch,
    awardTrainerCompletion,
    reconcileUserRating
};
