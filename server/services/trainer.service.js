const { prisma } = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '../../content/trainer');

const getLessons = async (userId) => {
    const lessons = await prisma.lesson.findMany({
        where: {
            published: true
        },
        orderBy: [
            { category: 'asc' },
            { order: 'asc' }
        ],
        include: {
            progress: userId ? {
                where: { userId }
            } : false
        }
    });

    return lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        difficulty: lesson.difficulty,
        category: lesson.category,
        estimatedMinutes: lesson.estimatedMinutes,
        order: lesson.order,
        thumbnail: lesson.thumbnail,
        published: lesson.published,
        completed: lesson.progress && lesson.progress.length > 0 ? lesson.progress[0].completed : false,
        completedAt: lesson.progress && lesson.progress.length > 0 ? lesson.progress[0].completedAt : null
    }));
};

const getLesson = async (slug, userId) => {
    const lesson = await prisma.lesson.findUnique({
        where: { slug, published: true },
        include: {
            progress: userId ? {
                where: { userId }
            } : false
        }
    });

    if (!lesson) {
        throw new Error('Lesson metadata not found');
    }

    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
    let content;
    try {
        content = await fs.readFile(filePath, 'utf8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error('Lesson content not found');
        }
        throw error;
    }

    const lessonData = {
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        difficulty: lesson.difficulty,
        category: lesson.category,
        estimatedMinutes: lesson.estimatedMinutes,
        order: lesson.order,
        thumbnail: lesson.thumbnail,
        published: lesson.published,
        completed: lesson.progress && lesson.progress.length > 0 ? lesson.progress[0].completed : false,
        completedAt: lesson.progress && lesson.progress.length > 0 ? lesson.progress[0].completedAt : null
    };

    return {
        lesson: lessonData,
        content
    };
};

const completeLesson = async (slug, userId) => {
    const lesson = await prisma.lesson.findUnique({
        where: { slug }
    });

    if (!lesson) {
        throw new Error("Lesson not found");
    }

    const GamificationEngine = require('./gamification');

    return await prisma.$transaction(async (tx) => {
        const existingProgress = await tx.lessonProgress.findUnique({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId: lesson.id
                }
            }
        });

        if (existingProgress && existingProgress.completed) {
            return { success: true, message: "Already completed" };
        }

        if (existingProgress) {
            await tx.lessonProgress.update({
                where: { id: existingProgress.id },
                data: {
                    completed: true,
                    completedAt: new Date()
                }
            });
        } else {
            await tx.lessonProgress.create({
                data: {
                    userId,
                    lessonId: lesson.id,
                    completed: true,
                    completedAt: new Date()
                }
            });
        }

        // Award Trainer Rating (First time completion only)
        const awardedPoints = await GamificationEngine.awardTrainerCompletion(userId, lesson.id, lesson.difficulty, tx);

        return { success: true, message: "Lesson marked as completed", awardedRating: awardedPoints };
    });
};

const getProgress = async (userId) => {
    const publishedLessons = await prisma.lesson.findMany({
        where: { published: true }
    });

    const userProgress = await prisma.lessonProgress.findMany({
        where: {
            userId,
            completed: true
        }
    });

    const completedLessonIds = new Set(userProgress.map(p => p.lessonId));

    const totalLessons = publishedLessons.length;
    let completedLessons = 0;

    const categoryMap = {};

    for (const lesson of publishedLessons) {
        if (!categoryMap[lesson.category]) {
            categoryMap[lesson.category] = {
                name: lesson.category,
                completed: 0,
                total: 0
            };
        }

        categoryMap[lesson.category].total += 1;

        if (completedLessonIds.has(lesson.id)) {
            completedLessons += 1;
            categoryMap[lesson.category].completed += 1;
        }
    }

    const categories = Object.values(categoryMap).map(cat => ({
        ...cat,
        percentage: cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0
    }));

    return {
        completedLessons,
        totalLessons,
        completionPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        categories
    };
};

module.exports = {
    getLessons,
    getLesson,
    completeLesson,
    getProgress
};
