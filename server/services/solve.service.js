const { prisma } = require('../config/database');

const getSolves = async (userId, sessionId) => {
    // verify session ownership
    const session = await prisma.session.findUnique({
        where: { id: sessionId }
    });

    if (!session || session.userId !== userId) {
        throw new Error("Session not found or unauthorized");
    }

    return await prisma.solve.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' }
    });
};

const addSolve = async (userId, data) => {
    const { sessionId, time, scramble, penalty = "NONE" } = data;

    const session = await prisma.session.findUnique({
        where: { id: sessionId }
    });

    if (!session || session.userId !== userId) {
        throw new Error("Session not found or unauthorized");
    }

    if (session.isArchived) {
        throw new Error("Cannot add solves to an archived session");
    }

    return await prisma.solve.create({
        data: {
            sessionId,
            time,
            scramble,
            penalty
        }
    });
};

const updateSolve = async (userId, solveId, data) => {
    const solve = await prisma.solve.findUnique({
        where: { id: solveId },
        include: { session: true }
    });

    if (!solve || solve.session.userId !== userId) {
        throw new Error("Solve not found or unauthorized");
    }
    
    // Check if there are attempts to update restricted fields
    if ('time' in data || 'scramble' in data || 'sessionId' in data) {
        throw new Error("Only penalty can be updated");
    }
    
    const { penalty } = data;
    
    return await prisma.solve.update({
        where: { id: solveId },
        data: {
            penalty
        }
    });
};

const deleteSolve = async (userId, solveId) => {
    const solve = await prisma.solve.findUnique({
        where: { id: solveId },
        include: { session: true }
    });

    if (!solve || solve.session.userId !== userId) {
        return false;
    }

    await prisma.solve.delete({
        where: { id: solveId }
    });

    return true;
};

module.exports = {
    getSolves,
    addSolve,
    updateSolve,
    deleteSolve
};
