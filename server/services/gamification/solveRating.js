const { SOLVE_RATING_TABLES } = require('./constants');

/**
 * Calculates Solve Rating based on puzzle type, solve time, and penalty.
 * 
 * @param {string} puzzleType - E.g. 'THREE_BY_THREE', 'TWO_BY_TWO', 'FOUR_BY_FOUR', 'FIVE_BY_FIVE'
 * @param {number} timeMs - Raw solve time in milliseconds
 * @param {string} penalty - 'NONE', 'PLUS_TWO', 'DNF'
 * @returns {number} Awarded Solve Rating points
 */
const calculateSolveRating = (puzzleType, timeMs, penalty = 'NONE') => {
    if (penalty === 'DNF') {
        return 0.00;
    }

    const effectiveTimeMs = penalty === 'PLUS_TWO' ? timeMs + 2000 : timeMs;

    const table = SOLVE_RATING_TABLES[puzzleType] || SOLVE_RATING_TABLES.THREE_BY_THREE;

    for (const tier of table) {
        if (effectiveTimeMs < tier.maxMs) {
            return tier.points;
        }
    }

    return 0.10; // Default base point for any valid solve
};

module.exports = {
    calculateSolveRating
};
