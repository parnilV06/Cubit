const { IMPROVEMENT_MULTIPLIERS } = require('./constants');
const { getValidTime, calculatePB, calculateMean, calculateAO5, calculateAO12 } = require('../stats/calculations/kpis');

/**
 * Calculates metrics (PB, Mean, Ao5, Ao12) for a given list of solve objects.
 * Solves are expected to have { time, penalty }.
 * Returns values in milliseconds or null if not eligible.
 */
const calculateSessionMetrics = (solves) => {
    const validTimes = solves
        .map(getValidTime)
        .filter(t => t !== null);

    if (validTimes.length === 0) {
        return { pb: null, mean: null, ao5: null, ao12: null };
    }

    const pb = Math.min(...validTimes);
    const mean = Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length);

    // Calculate Ao5 if at least 5 valid solves
    let ao5 = null;
    if (validTimes.length >= 5) {
        const window = validTimes.slice(-5).sort((a, b) => a - b);
        const middle = window.slice(1, -1);
        ao5 = Math.round(middle.reduce((a, b) => a + b, 0) / middle.length);
    }

    // Calculate Ao12 if at least 12 valid solves
    let ao12 = null;
    if (validTimes.length >= 12) {
        const window = validTimes.slice(-12).sort((a, b) => a - b);
        const middle = window.slice(1, -1);
        ao12 = Math.round(middle.reduce((a, b) => a + b, 0) / middle.length);
    }

    return { pb, mean, ao5, ao12 };
};

/**
 * Evaluates Improvement Rating for a session.
 * Compares current session metrics against historical same-puzzle session baselines.
 * 
 * @param {string} userId 
 * @param {string} sessionId 
 * @param {object} tx - Prisma transaction client
 * @returns {number} Awarded Improvement Rating
 */
const evaluateSessionImprovement = async (userId, sessionId, tx) => {
    const session = await tx.session.findUnique({
        where: { id: sessionId },
        include: { solves: true }
    });

    if (!session || session.userId !== userId || session.evaluatedForImprovement) {
        return 0;
    }

    const currentMetrics = calculateSessionMetrics(session.solves);

    // Fetch previous sessions for the same user and puzzle type
    const previousSessions = await tx.session.findMany({
        where: {
            userId,
            puzzleType: session.puzzleType,
            id: { not: sessionId },
            createdAt: { lt: session.createdAt }
        },
        include: { solves: true }
    });

    const historicalMetrics = {
        pb: [],
        mean: [],
        ao5: [],
        ao12: []
    };

    for (const prev of previousSessions) {
        const metrics = calculateSessionMetrics(prev.solves);
        if (metrics.pb !== null) historicalMetrics.pb.push(metrics.pb);
        if (metrics.mean !== null) historicalMetrics.mean.push(metrics.mean);
        if (metrics.ao5 !== null) historicalMetrics.ao5.push(metrics.ao5);
        if (metrics.ao12 !== null) historicalMetrics.ao12.push(metrics.ao12);
    }

    let totalImprovement = 0;

    // Metric 1: PB (Multiplier 0.50)
    if (currentMetrics.pb !== null && historicalMetrics.pb.length > 0) {
        const baseline = historicalMetrics.pb.reduce((a, b) => a + b, 0) / historicalMetrics.pb.length;
        const pct = ((baseline - currentMetrics.pb) / baseline) * 100;
        if (pct > 0) {
            totalImprovement += pct * IMPROVEMENT_MULTIPLIERS.PB;
        }
    }

    // Metric 2: Ao5 (Multiplier 0.75)
    if (currentMetrics.ao5 !== null && historicalMetrics.ao5.length > 0) {
        const baseline = historicalMetrics.ao5.reduce((a, b) => a + b, 0) / historicalMetrics.ao5.length;
        const pct = ((baseline - currentMetrics.ao5) / baseline) * 100;
        if (pct > 0) {
            totalImprovement += pct * IMPROVEMENT_MULTIPLIERS.Ao5;
        }
    }

    // Metric 3: Ao12 (Multiplier 1.00)
    if (currentMetrics.ao12 !== null && historicalMetrics.ao12.length > 0) {
        const baseline = historicalMetrics.ao12.reduce((a, b) => a + b, 0) / historicalMetrics.ao12.length;
        const pct = ((baseline - currentMetrics.ao12) / baseline) * 100;
        if (pct > 0) {
            totalImprovement += pct * IMPROVEMENT_MULTIPLIERS.Ao12;
        }
    }

    // Metric 4: Mean (Multiplier 1.00)
    if (currentMetrics.mean !== null && historicalMetrics.mean.length > 0) {
        const baseline = historicalMetrics.mean.reduce((a, b) => a + b, 0) / historicalMetrics.mean.length;
        const pct = ((baseline - currentMetrics.mean) / baseline) * 100;
        if (pct > 0) {
            totalImprovement += pct * IMPROVEMENT_MULTIPLIERS.Mean;
        }
    }

    // Mark session as evaluated
    await tx.session.update({
        where: { id: sessionId },
        data: {
            evaluatedForImprovement: true,
            evaluatedAt: new Date()
        }
    });

    if (totalImprovement > 0) {
        const roundedAmount = Number(totalImprovement.toFixed(4));
        await tx.ratingLedger.create({
            data: {
                userId,
                category: 'IMPROVEMENT',
                amount: roundedAmount,
                sessionId,
                description: `Improvement Rating for session "${session.name || 'Session'}"`
            }
        });

        await tx.user.update({
            where: { id: userId },
            data: {
                totalRating: { increment: roundedAmount }
            }
        });

        return roundedAmount;
    }

    return 0;
};

module.exports = {
    calculateSessionMetrics,
    evaluateSessionImprovement
};
