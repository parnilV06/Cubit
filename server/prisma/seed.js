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

// --- COMMUNITY SEED HELPERS ---

const createCommunityUsers = async () => {
    console.log('Creating community users...');
    const users = [];
    for (let i = 1; i <= 3; i++) {
        const email = `community${i}@cubit.dev`;
        let user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            await prisma.user.delete({ where: { email } });
        }
        const hashedPassword = await bcrypt.hash('password123', 10);
        user = await prisma.user.create({
            data: {
                displayName: `SpeedCuber${i}`,
                username: `speedcuber${i}`,
                email,
                password: hashedPassword,
                emailVerified: true
            }
        });
        users.push(user);
    }
    return users;
};

const createPosts = async (demoUser, communityUsers) => {
    console.log('Generating posts...');
    const allUsers = [demoUser, ...communityUsers];
    
    const pbSolves = await prisma.solve.findMany({
        where: { session: { userId: demoUser.id }, penalty: 'NONE' },
        orderBy: { time: 'asc' },
        take: 3
    });
    
    const recentSolves = await prisma.solve.findMany({
        where: { session: { userId: demoUser.id }, penalty: 'NONE', id: { notIn: pbSolves.map(s => s.id) } },
        orderBy: { createdAt: 'desc' },
        take: 3
    });

    const postTemplates = [
        { type: 'DISCUSSION', title: 'Favourite PLL?', content: "What's your favourite PLL algorithm?" },
        { type: 'DISCUSSION', title: 'Next WCA Comp', content: "Anyone attending the next WCA competition?" },
        { type: 'DISCUSSION', title: 'Main Mains', content: "What is everyone maining for 3x3 right now?" },
        { type: 'DISCUSSION', title: 'Magnet strength', content: "Do you prefer strong or weak magnets?" },
        { type: 'DISCUSSION', title: 'Lubrication', content: "How often do you clean and lube your cubes?" },
        { type: 'TIP', title: 'Lookahead', content: "One thing that improved my lookahead was slowing down." },
        { type: 'TIP', title: 'Inspection', content: "Practice inspection more deliberately." },
        { type: 'TIP', title: 'Cross planning', content: "Try to plan the entire cross blindfolded." },
        { type: 'TIP', title: 'F2L pairs', content: "Don't rotate before looking for the next pair." },
        { type: 'QUESTION', title: 'Learn full PLL?', content: "Should beginners learn full PLL?" },
        { type: 'QUESTION', title: 'Cross efficiency', content: "How do you improve cross efficiency?" },
        { type: 'QUESTION', title: 'Color neutral', content: "Is it worth becoming color neutral?" }
    ];

    const posts = [];
    const now = new Date();
    
    // Create non-solve posts
    for (let i = 0; i < postTemplates.length; i++) {
        const template = postTemplates[i];
        const author = allUsers[i % allUsers.length];
        const daysAgo = Math.floor(Math.random() * 30);
        const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        
        posts.push(await prisma.post.create({
            data: {
                authorId: author.id,
                type: template.type,
                title: template.title,
                content: template.content,
                imageUrl: i % 2 === 0 ? 'https://placehold.co/600x400/png?text=Post+Image' : null,
                createdAt
            }
        }));
    }
    
    // Create PB_SHARE posts
    const pbTitles = ["Finally broke the 8 second barrier!", "New PB today after weeks of practice.", "Unbelievable solve!"];
    for (let i = 0; i < pbSolves.length; i++) {
        const solve = pbSolves[i];
        const createdAt = new Date(solve.createdAt.getTime() + 1000 * 60 * 60); // 1 hour after solve
        posts.push(await prisma.post.create({
            data: {
                authorId: demoUser.id,
                type: 'PB_SHARE',
                title: pbTitles[i],
                content: `My new personal best: ${solve.time / 1000}s!`,
                solveId: solve.id,
                imageUrl: i % 2 === 0 ? 'https://placehold.co/600x400/png?text=PB+Solve' : null,
                createdAt
            }
        }));
    }

    // Create SOLVE_SHARE posts
    const shareTitles = ["This scramble felt amazing.", "I really enjoyed this solve.", "Crazy smooth F2L on this one."];
    for (let i = 0; i < recentSolves.length; i++) {
        const solve = recentSolves[i];
        const createdAt = new Date(solve.createdAt.getTime() + 1000 * 60 * 60);
        posts.push(await prisma.post.create({
            data: {
                authorId: demoUser.id,
                type: 'SOLVE_SHARE',
                title: shareTitles[i],
                content: "Check out this scramble!",
                solveId: solve.id,
                imageUrl: i % 2 !== 0 ? 'https://placehold.co/600x400/png?text=Solve+Share' : null,
                createdAt
            }
        }));
    }
    
    return posts;
};

const createComments = async (posts, allUsers) => {
    console.log('Generating comments...');
    const commentTexts = [
        "Nice solve!", "Congrats!", "Great improvement.", "That's really fast.", 
        "I should try this.", "Awesome tip.", "Thanks for sharing.", 
        "I completely agree.", "Not sure about that.", "Wow!", 
        "Keep it up!", "Amazing."
    ];
    
    let totalComments = 0;
    
    for (const post of posts) {
        // 1 to 3 comments per post
        const numComments = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numComments; i++) {
            if (totalComments >= 35) break;
            
            const author = allUsers[Math.floor(Math.random() * allUsers.length)];
            const content = commentTexts[Math.floor(Math.random() * commentTexts.length)];
            // Comment created after post
            const createdAt = new Date(post.createdAt.getTime() + (Math.random() * 24 * 60 * 60 * 1000) + 1000 * 60 * 60);
            
            await prisma.comment.create({
                data: {
                    postId: post.id,
                    authorId: author.id,
                    content,
                    createdAt
                }
            });
            totalComments++;
        }
        if (totalComments >= 35) break;
    }
    return totalComments;
};

const createLikes = async (posts, allUsers) => {
    console.log('Generating likes...');
    
    for (const post of posts) {
        // Randomly pick some users to like
        const likers = allUsers.filter(() => Math.random() > 0.4);
        for (const liker of likers) {
            const createdAt = new Date(post.createdAt.getTime() + Math.random() * 1000 * 60 * 60 * 24);
            await prisma.postLike.create({
                data: {
                    postId: post.id,
                    userId: liker.id,
                    createdAt
                }
            });
        }
    }
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

    // 5. Generate Community Data
    console.log('--- Generating Community Data ---');
    const communityUsers = await createCommunityUsers();
    const allUsers = [demoUser, ...communityUsers];
    
    const posts = await createPosts(demoUser, communityUsers);
    console.log(`✅ Created ${posts.length} posts`);
    
    const totalComments = await createComments(posts, allUsers);
    console.log(`✅ Created ${totalComments} comments`);
    
    await createLikes(posts, allUsers);
    console.log(`✅ Created post likes`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`Created 1 Demo User, 3 Community Users, 6 Sessions, ${totalSolvesCreated} Solves, ${posts.length} Posts, ${totalComments} Comments.`);
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
