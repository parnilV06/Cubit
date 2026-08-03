const { prisma } = require('../config/database');
const GamificationEngine = require('./gamification');

const createDefaultActiveSession = async (userId, tx = prisma) => {
    return await tx.session.create({
        data: {
            userId,
            name: "Default Session",
            puzzleType: "THREE_BY_THREE",
            isActive: true,
            isArchived: false
        }
    });
};

const getSessions = async (userId) => {
    return await prisma.session.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            puzzleType: true,
            createdAt: true,
            updatedAt: true,
            isActive: true,
            isArchived: true,
            evaluatedForImprovement: true
        }
    });
};

const getCurrentSession = async (userId) => {
    let activeSession = await prisma.session.findFirst({
        where: { userId, isActive: true }
    });

    if (!activeSession) {
        activeSession = await createDefaultActiveSession(userId);
    }

    return activeSession;
};

const createSession = async (userId, data) => {
    const { name = "New Session", puzzleType = "THREE_BY_THREE" } = data;

    const result = await prisma.$transaction(async (tx) => {
        // Find current active session to evaluate improvement
        const previousActive = await tx.session.findFirst({
            where: { userId, isActive: true }
        });

        if (previousActive) {
            await GamificationEngine.processSessionCloseOrSwitch(userId, previousActive.id, tx);
        }

        await tx.session.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false }
        });

        const newSession = await tx.session.create({
            data: {
                userId,
                name,
                puzzleType,
                isActive: true,
                isArchived: false
            }
        });

        return newSession;
    });

    return result;
};

const renameSession = async (userId, sessionId, newName) => {
    const session = await prisma.session.findUnique({
        where: { id: sessionId }
    });

    if (!session || session.userId !== userId) return null;

    const updatedSession = await prisma.session.update({
        where: { id: sessionId },
        data: { name: newName }
    });

    return updatedSession;
};

const archiveSession = async (userId, sessionId) => {
    const session = await prisma.session.findUnique({
        where: { id: sessionId }
    });

    if (!session || session.userId !== userId) return null;

    const result = await prisma.$transaction(async (tx) => {
        // Evaluate improvement on session being archived
        await GamificationEngine.processSessionCloseOrSwitch(userId, sessionId, tx);

        const archivedSession = await tx.session.update({
            where: { id: sessionId },
            data: {
                isArchived: true,
                isActive: false
            }
        });

        if (session.isActive) {
            await createDefaultActiveSession(userId, tx);
        }

        return archivedSession;
    });

    return result;
};

const deleteSession = async (userId, sessionId) => {
    const session = await prisma.session.findUnique({
        where: { id: sessionId }
    });

    if (!session || session.userId !== userId) return false;

    await prisma.$transaction(async (tx) => {
        await tx.session.delete({
            where: { id: sessionId }
        });

        // Check if user has any remaining sessions
        const remainingSession = await tx.session.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        if (!remainingSession) {
            await createDefaultActiveSession(userId, tx);
        } else if (session.isActive) {
            await tx.session.update({
                where: { id: remainingSession.id },
                data: { isActive: true }
            });
        }
    });

    return true;
};

module.exports = {
    getSessions,
    getCurrentSession,
    createSession,
    renameSession,
    archiveSession,
    deleteSession
};
