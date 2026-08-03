/**
 * Cubit Gamification Engine Constants & Point Tables
 * Authoritative source of truth matching docs/CubitRatingSystem.md
 */

const SOLVE_RATING_TABLES = {
    THREE_BY_THREE: [
        { maxMs: 3000, points: 6.50 },
        { maxMs: 4000, points: 5.00 },
        { maxMs: 5000, points: 4.00 },
        { maxMs: 6000, points: 3.25 },
        { maxMs: 8000, points: 2.50 },
        { maxMs: 10000, points: 2.00 },
        { maxMs: 12000, points: 1.60 },
        { maxMs: 15000, points: 1.35 },
        { maxMs: 20000, points: 1.10 },
        { maxMs: 25000, points: 0.90 },
        { maxMs: 30000, points: 0.75 },
        { maxMs: 45000, points: 0.60 },
        { maxMs: 60000, points: 0.50 },
        { maxMs: 75000, points: 0.40 },
        { maxMs: 90000, points: 0.30 },
        { maxMs: 120000, points: 0.20 },
        { maxMs: Infinity, points: 0.10 }
    ],

    TWO_BY_TWO: [
        { maxMs: 3000, points: 2.50 },
        { maxMs: 4000, points: 1.60 },
        { maxMs: 5000, points: 1.45 },
        { maxMs: 6000, points: 1.30 },
        { maxMs: 8000, points: 1.15 },
        { maxMs: 10000, points: 1.00 },
        { maxMs: 15000, points: 0.90 },
        { maxMs: 20000, points: 0.75 },
        { maxMs: 30000, points: 0.60 },
        { maxMs: 45000, points: 0.50 },
        { maxMs: 60000, points: 0.40 },
        { maxMs: 75000, points: 0.30 },
        { maxMs: 90000, points: 0.15 },
        { maxMs: Infinity, points: 0.10 }
    ],

    FOUR_BY_FOUR: [
        { maxMs: 40000, points: 6.50 },
        { maxMs: 50000, points: 5.00 },
        { maxMs: 60000, points: 4.00 },
        { maxMs: 75000, points: 3.25 },
        { maxMs: 90000, points: 2.50 },
        { maxMs: 105000, points: 2.25 },
        { maxMs: 120000, points: 2.00 },
        { maxMs: 150000, points: 1.25 },
        { maxMs: 180000, points: 0.75 },
        { maxMs: 210000, points: 0.50 },
        { maxMs: 240000, points: 0.40 },
        { maxMs: 270000, points: 0.30 },
        { maxMs: 300000, points: 0.20 },
        { maxMs: Infinity, points: 0.10 }
    ],

    FIVE_BY_FIVE: [
        { maxMs: 60000, points: 6.50 },
        { maxMs: 75000, points: 5.00 },
        { maxMs: 90000, points: 4.00 },
        { maxMs: 105000, points: 3.00 },
        { maxMs: 120000, points: 2.50 },
        { maxMs: 150000, points: 1.75 },
        { maxMs: 180000, points: 1.25 },
        { maxMs: 210000, points: 1.00 },
        { maxMs: 240000, points: 0.75 },
        { maxMs: 270000, points: 0.50 },
        { maxMs: 300000, points: 0.40 },
        { maxMs: 360000, points: 0.30 },
        { maxMs: 420000, points: 0.20 },
        { maxMs: Infinity, points: 0.10 }
    ]
};

// Aliases for puzzle enums
SOLVE_RATING_TABLES['2x2'] = SOLVE_RATING_TABLES.TWO_BY_TWO;
SOLVE_RATING_TABLES['3x3'] = SOLVE_RATING_TABLES.THREE_BY_THREE;
SOLVE_RATING_TABLES['4x4'] = SOLVE_RATING_TABLES.FOUR_BY_FOUR;
SOLVE_RATING_TABLES['5x5'] = SOLVE_RATING_TABLES.FIVE_BY_FIVE;

const IMPROVEMENT_MULTIPLIERS = {
    PB: 0.50,
    Ao5: 0.75,
    Ao12: 1.00,
    Mean: 1.00
};

const STREAK_MILESTONES = {
    7: 0.25,
    14: 0.50,
    30: 2.00,
    60: 4.00,
    100: 8.00,
    365: 20.00
};

const TRAINER_REWARDS = {
    beginner: 1.00,
    easy: 1.00,
    intermediate: 2.00,
    medium: 2.00,
    advanced: 3.00
};

const DAILY_ACTIVITY_REWARD = 1.00;

module.exports = {
    SOLVE_RATING_TABLES,
    IMPROVEMENT_MULTIPLIERS,
    STREAK_MILESTONES,
    TRAINER_REWARDS,
    DAILY_ACTIVITY_REWARD
};
