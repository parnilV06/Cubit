const { prisma, connectDB, disconnectDB } = require('../config/database');
const GamificationEngine = require('../services/gamification');
const { calculateSolveRating } = require('../services/gamification/solveRating');
const { getCalendarDateString, getDayDifference } = require('../services/gamification/activityAndStreaks');
const { IMPROVEMENT_MULTIPLIERS, STREAK_MILESTONES, DAILY_ACTIVITY_REWARD, TRAINER_REWARDS } = require('../services/gamification/constants');
const { calculateSessionMetrics } = require('../services/gamification/improvementRating');

const isDryRun = process.argv.includes('--dry-run');

async function backfillUser(userId) {
    console.log(`\n========================================`);
    console.log(`Starting backfill for user: ${userId} ${isDryRun ? '(DRY RUN)' : ''}`);
    console.log(`========================================`);

    // 1. Fetch user solves ordered by createdAt ASC
    const solves = await prisma.solve.findMany({
        where: { session: { userId } },
        orderBy: { createdAt: 'asc' },
        include: { session: true }
    });

    console.log(`Found ${solves.length} historical solves.`);

    let solvePointsCount = 0;
    let activityDaysCount = 0;
    let streakBonusCount = 0;

    // Track active calendar dates and streaks in chronological order
    const activeDates = new Set();
    let currentStreak = 0;
    let longestStreak = 0;
    let lastDateStr = null;

    for (const solve of solves) {
        const puzzleType = solve.session.puzzleType || 'THREE_BY_THREE';
        const points = calculateSolveRating(puzzleType, solve.time, solve.penalty);

        if (!isDryRun) {
            await prisma.ratingLedger.upsert({
                where: { solveId: solve.id },
                update: {
                    amount: points,
                    description: `Backfilled Solve Rating for ${puzzleType} (${solve.time}ms, penalty: ${solve.penalty})`
                },
                create: {
                    userId,
                    category: 'SOLVE',
                    amount: points,
                    solveId: solve.id,
                    sessionId: solve.sessionId,
                    createdAt: solve.createdAt,
                    description: `Backfilled Solve Rating for ${puzzleType} (${solve.time}ms, penalty: ${solve.penalty})`
                }
            });
        }
        solvePointsCount++;

        // Activity & Streak evaluation
        const activityDate = getCalendarDateString(solve.createdAt);
        if (!activeDates.has(activityDate)) {
            activeDates.add(activityDate);

            if (!isDryRun) {
                await prisma.ratingLedger.upsert({
                    where: {
                        userId_activityDate_category: {
                            userId,
                            activityDate,
                            category: 'DAILY_ACTIVITY'
                        }
                    },
                    update: {},
                    create: {
                        userId,
                        category: 'DAILY_ACTIVITY',
                        amount: DAILY_ACTIVITY_REWARD,
                        activityDate,
                        createdAt: solve.createdAt,
                        description: `Backfilled Daily Cubing Activity Reward for ${activityDate} (+1.00)`
                    }
                });
            }
            activityDaysCount++;

            // Streak tracking
            if (!lastDateStr) {
                currentStreak = 1;
            } else {
                const diffDays = getDayDifference(activityDate, lastDateStr);
                if (diffDays === 1) {
                    currentStreak += 1;
                } else if (diffDays > 1) {
                    currentStreak = 1;
                }
            }
            lastDateStr = activityDate;
            longestStreak = Math.max(longestStreak, currentStreak);

            // Streak Milestone check
            const bonusAmount = STREAK_MILESTONES[currentStreak];
            if (bonusAmount) {
                if (!isDryRun) {
                    const existingBonus = await prisma.ratingLedger.findFirst({
                        where: {
                            userId,
                            category: 'STREAK_BONUS',
                            streakMilestone: currentStreak,
                            activityDate
                        }
                    });

                    if (!existingBonus) {
                        await prisma.ratingLedger.create({
                            data: {
                                userId,
                                category: 'STREAK_BONUS',
                                amount: bonusAmount,
                                activityDate,
                                streakMilestone: currentStreak,
                                createdAt: solve.createdAt,
                                description: `Backfilled ${currentStreak}-Day Streak Milestone Bonus (+${bonusAmount.toFixed(2)})`
                            }
                        });
                    }
                }
                streakBonusCount++;
            }
        }
    }

    // 2. Process Completed Lessons
    const lessonProgresses = await prisma.lessonProgress.findMany({
        where: { userId, completed: true },
        include: { lesson: true }
    });

    console.log(`Found ${lessonProgresses.length} completed lessons.`);
    let trainerPointsCount = 0;

    for (const prog of lessonProgresses) {
        if (!prog.lesson) continue;
        const diffKey = String(prog.lesson.difficulty).toLowerCase();
        const points = TRAINER_REWARDS[diffKey] || 1.00;

        if (!isDryRun) {
            await prisma.ratingLedger.upsert({
                where: {
                    userId_lessonId: {
                        userId,
                        lessonId: prog.lessonId
                    }
                },
                update: {},
                create: {
                    userId,
                    category: 'TRAINER',
                    amount: points,
                    lessonId: prog.lessonId,
                    createdAt: prog.completedAt || new Date(),
                    description: `Backfilled Trainer Lesson Completion Reward (${prog.lesson.difficulty}) (+${points.toFixed(2)})`
                }
            });
        }
        trainerPointsCount++;
    }

    // 3. Process Sessions for Improvement
    const sessions = await prisma.session.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        include: { solves: true }
    });

    console.log(`Found ${sessions.length} sessions for improvement evaluation.`);
    let improvementCount = 0;

    for (let i = 0; i < sessions.length; i++) {
        const sess = sessions[i];
        const currentMetrics = calculateSessionMetrics(sess.solves);

        // Fetch prior sessions for baseline
        const priorSessions = sessions.slice(0, i).filter(s => s.puzzleType === sess.puzzleType);

        const historicalMetrics = { pb: [], mean: [], ao5: [], ao12: [] };
        for (const p of priorSessions) {
            const m = calculateSessionMetrics(p.solves);
            if (m.pb !== null) historicalMetrics.pb.push(m.pb);
            if (m.mean !== null) historicalMetrics.mean.push(m.mean);
            if (m.ao5 !== null) historicalMetrics.ao5.push(m.ao5);
            if (m.ao12 !== null) historicalMetrics.ao12.push(m.ao12);
        }

        let totalImp = 0;
        if (currentMetrics.pb !== null && historicalMetrics.pb.length > 0) {
            const baseline = historicalMetrics.pb.reduce((a, b) => a + b, 0) / historicalMetrics.pb.length;
            const pct = ((baseline - currentMetrics.pb) / baseline) * 100;
            if (pct > 0) totalImp += pct * IMPROVEMENT_MULTIPLIERS.PB;
        }

        if (currentMetrics.ao5 !== null && historicalMetrics.ao5.length > 0) {
            const baseline = historicalMetrics.ao5.reduce((a, b) => a + b, 0) / historicalMetrics.ao5.length;
            const pct = ((baseline - currentMetrics.ao5) / baseline) * 100;
            if (pct > 0) totalImp += pct * IMPROVEMENT_MULTIPLIERS.Ao5;
        }

        if (currentMetrics.ao12 !== null && historicalMetrics.ao12.length > 0) {
            const baseline = historicalMetrics.ao12.reduce((a, b) => a + b, 0) / historicalMetrics.ao12.length;
            const pct = ((baseline - currentMetrics.ao12) / baseline) * 100;
            if (pct > 0) totalImp += pct * IMPROVEMENT_MULTIPLIERS.Ao12;
        }

        if (currentMetrics.mean !== null && historicalMetrics.mean.length > 0) {
            const baseline = historicalMetrics.mean.reduce((a, b) => a + b, 0) / historicalMetrics.mean.length;
            const pct = ((baseline - currentMetrics.mean) / baseline) * 100;
            if (pct > 0) totalImp += pct * IMPROVEMENT_MULTIPLIERS.Mean;
        }

        if (!isDryRun) {
            await prisma.session.update({
                where: { id: sess.id },
                data: {
                    evaluatedForImprovement: true,
                    evaluatedAt: new Date()
                }
            });

            if (totalImp > 0) {
                const rounded = Number(totalImp.toFixed(4));
                const existingImpLedger = await prisma.ratingLedger.findFirst({
                    where: { userId, sessionId: sess.id, category: 'IMPROVEMENT' }
                });

                if (!existingImpLedger) {
                    await prisma.ratingLedger.create({
                        data: {
                            userId,
                            category: 'IMPROVEMENT',
                            amount: rounded,
                            sessionId: sess.id,
                            createdAt: sess.createdAt,
                            description: `Backfilled Improvement Rating for session "${sess.name || 'Session'}"`
                        }
                    });
                }
                improvementCount++;
            }
        }
    }

    // 4. Reconcile Total Rating and Streaks for User
    if (!isDryRun) {
        const agg = await prisma.ratingLedger.aggregate({
            where: { userId },
            _sum: { amount: true }
        });
        const totalSum = agg._sum.amount ? Number(agg._sum.amount) : 0;

        await prisma.user.update({
            where: { id: userId },
            data: {
                totalRating: Number(totalSum.toFixed(4)),
                currentStreak,
                longestStreak,
                lastActiveDate: lastDateStr
            }
        });

        console.log(`✓ Backfill complete for ${userId}. Total Rating: ${totalSum.toFixed(2)}, Streak: ${currentStreak}`);
    } else {
        console.log(`✓ Dry run complete for ${userId}.`);
    }
}

async function main() {
    await connectDB();

    try {
        const users = await prisma.user.findMany({ select: { id: true, username: true } });
        console.log(`Starting Gamification Engine Backfill for ${users.length} users...`);

        for (const u of users) {
            await backfillUser(u.id);
        }

        console.log("\n🎉 ALL USER BACKFILLS COMPLETED SUCCESSFULLY!");
    } catch (err) {
        console.error("❌ Backfill failed:", err);
    } finally {
        await disconnectDB();
    }
}

main();
