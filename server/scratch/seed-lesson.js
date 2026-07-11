const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
    await prisma.lesson.upsert({
        where: { slug: 'cube-notation' },
        update: {
            published: true
        },
        create: {
            title: 'Cube Notation',
            slug: 'cube-notation',
            description: 'Learn the basic notation used in speedcubing.',
            difficulty: 'BEGINNER',
            category: 'Basics',
            estimatedMinutes: 10,
            order: 1,
            published: true
        }
    });
    console.log("✅ Inserted 'cube-notation' metadata into PostgreSQL!");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
