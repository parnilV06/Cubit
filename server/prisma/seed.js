const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Helper: Generate realistic WCA-style scramble
const generateScramble = () => {
    const moves = ['U', 'D', 'R', 'L', 'F', 'B'];
    const modifiers = ['', "'", '2'];
    const scrambleLength = 20;
    
    let scramble = [];
    let lastMove = '';
    
    for (let i = 0; i < scrambleLength; i++) {
        let move;
        do {
            move = moves[Math.floor(Math.random() * moves.length)];
        } while (move === lastMove); // Prevent consecutive same face moves
        
        const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        scramble.push(move + modifier);
        lastMove = move;
    }
    
    return scramble.join(' ');
};

// Helper: Generate realistic penalty
const generatePenalty = () => {
    const rand = Math.random();
    if (rand < 0.92) return 'NONE';
    if (rand < 0.98) return 'PLUS_TWO';
    return 'DNF';
};

// Helper: Generate solve time with variance
const generateSolveTime = (baseTime, variance) => {
    // Uniform random around baseTime
    const variation = (Math.random() * variance * 2) - variance;
    return Math.floor(baseTime + variation);
};

// Main seed function
async function main() {
    console.log('🌱 Starting database seed...');

    const demoEmail = 'demo@cubit.dev';

    // 1. Cleanly recreate the user
    console.log('Checking for existing demo user...');
    const existingUser = await prisma.user.findUnique({
        where: { email: demoEmail }
    });

    if (existingUser) {
        console.log('Deleting existing demo user and related data...');
        // Due to onDelete: Cascade, this will remove sessions, solves, etc.
        await prisma.user.delete({
            where: { email: demoEmail }
        });
    }

    // 2. Create the Demo User
    console.log('Creating demo user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const demoUser = await prisma.user.create({
        data: {
            displayName: 'Cubit Demo',
            username: 'demo',
            email: demoEmail,
            password: hashedPassword,
            emailVerified: true,
            bio: 'Speedcuber in training. Always chasing that next PB!',
        }
    });

    console.log(`✅ Demo user created with ID: ${demoUser.id}`);

    // 3. Define the session configurations showing progressive improvement
    const sessionConfigs = [
        { name: 'Session 1', baseTime: 16000, variance: 2000, solveCount: 32, daysAgo: 25 },
        { name: 'Session 2', baseTime: 14000, variance: 1500, solveCount: 35, daysAgo: 20 },
        { name: 'Session 3', baseTime: 12000, variance: 1500, solveCount: 33, daysAgo: 15 },
        { name: 'Session 4', baseTime: 10000, variance: 1200, solveCount: 34, daysAgo: 10 },
        { name: 'Session 5', baseTime: 9000, variance: 1000, solveCount: 31, daysAgo: 5 },
        { name: 'Session 6', baseTime: 8000, variance: 800, solveCount: 35, daysAgo: 0 },
    ];

    // Get current time to calculate absolute timestamps
    const now = new Date();

    let totalSolvesCreated = 0;

    console.log('Generating sessions and solves...');

    // 4. Generate Sessions and Solves
    for (let i = 0; i < sessionConfigs.length; i++) {
        const config = sessionConfigs[i];
        const isFinalSession = i === sessionConfigs.length - 1;
        
        // Base timestamp for the session
        const sessionDate = new Date(now);
        sessionDate.setDate(sessionDate.getDate() - config.daysAgo);
        
        // Create session
        const session = await prisma.session.create({
            data: {
                userId: demoUser.id,
                name: config.name,
                puzzleType: 'THREE_BY_THREE',
                isArchived: false,
                isActive: isFinalSession,
                createdAt: sessionDate,
                updatedAt: sessionDate,
            }
        });

        // Generate solves for this session
        const solvesData = [];
        
        // Track current time within the session to simulate sequential solves
        let currentSolveTime = new Date(sessionDate);

        for (let j = 0; j < config.solveCount; j++) {
            const solveTimeMs = generateSolveTime(config.baseTime, config.variance);
            const penalty = generatePenalty();
            
            // Advance timestamp: Add solve time + 15 to 35 seconds of rest/scrambling
            const totalDurationMs = solveTimeMs + (15000 + Math.random() * 20000);
            currentSolveTime = new Date(currentSolveTime.getTime() + totalDurationMs);

            solvesData.push({
                sessionId: session.id,
                time: Math.max(1000, solveTimeMs), // ensure no negative times
                scramble: generateScramble(),
                penalty: penalty,
                createdAt: currentSolveTime,
                updatedAt: currentSolveTime,
            });
        }

        // Bulk insert solves
        await prisma.solve.createMany({
            data: solvesData
        });

        totalSolvesCreated += config.solveCount;
        
        console.log(`✅ Created ${config.name} (${config.solveCount} solves) | Avg: ~${config.baseTime / 1000}s`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`Created 1 User, 6 Sessions, and ${totalSolvesCreated} Solves.`);
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:');
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
