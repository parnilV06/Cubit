const { prisma } = require('../config/database');

const getNotes = async (userId, sessionId) => {
    // Verify session ownership
    const session = await prisma.session.findUnique({
        where: { id: sessionId }
    });

    if (!session || session.userId !== userId) {
        throw new Error("Session not found or unauthorized");
    }

    return await prisma.note.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'desc' } // Newest first
    });
};

const createNote = async (userId, data) => {
    const { sessionId, content } = data;

    if (!sessionId) {
        throw new Error("Session ID is required");
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
        throw new Error("Note content cannot be empty");
    }

    // Verify session ownership
    const session = await prisma.session.findUnique({
        where: { id: sessionId }
    });

    if (!session || session.userId !== userId) {
        throw new Error("Session not found or unauthorized");
    }

    if (session.isArchived) {
        throw new Error("Cannot add notes to an archived session");
    }

    return await prisma.note.create({
        data: {
            sessionId,
            content: content.trim()
        }
    });
};

const deleteNote = async (userId, noteId) => {
    const note = await prisma.note.findUnique({
        where: { id: noteId },
        include: { session: true }
    });

    if (!note || note.session.userId !== userId) {
        return false;
    }

    await prisma.note.delete({
        where: { id: noteId }
    });

    return true;
};

module.exports = {
    getNotes,
    createNote,
    deleteNote
};
