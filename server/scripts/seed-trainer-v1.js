/**
 * Seeds Trainer V1 Lessons in PostgreSQL database
 */
const { prisma } = require('../config/database');

const LESSONS = [
  {
    slug: 'basic-face-notation',
    title: 'Basic Face Notation',
    description: 'Learn the six fundamental face moves (U, D, L, R, F, B) that form the universal language of the Rubik\'s Cube.',
    difficulty: 'BEGINNER',
    category: 'Cube Notation',
    estimatedMinutes: 6,
    order: 1,
    published: true,
  },
  {
    slug: 'prime-double-turns',
    title: 'Prime & Double Turns',
    description: 'Master counter-clockwise (prime) and 180-degree (double) moves.',
    difficulty: 'BEGINNER',
    category: 'Cube Notation',
    estimatedMinutes: 5,
    order: 2,
    published: true,
  },
  {
    slug: 'cube-notation',
    title: 'Basic Face Notation (Legacy Slug)',
    description: 'Learn the six fundamental face moves (U, D, L, R, F, B) that form the universal language of the Rubik\'s Cube.',
    difficulty: 'BEGINNER',
    category: 'Cube Notation',
    estimatedMinutes: 6,
    order: 100,
    published: false,
  }
];

async function seed() {
  console.log('Seeding Trainer V1 Lessons...');
  for (const lesson of LESSONS) {
    const existing = await prisma.lesson.findUnique({ where: { slug: lesson.slug } });
    if (existing) {
      await prisma.lesson.update({
        where: { slug: lesson.slug },
        data: lesson,
      });
      console.log(`Updated lesson: ${lesson.slug}`);
    } else {
      await prisma.lesson.create({
        data: lesson,
      });
      console.log(`Created lesson: ${lesson.slug}`);
    }
  }
  console.log('Trainer V1 lessons seeded successfully!');
}

seed()
  .catch((e) => {
    console.error('Error seeding trainer lessons:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
