const noteService = require('../services/note.service');

const getNotes = async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({ success: false, message: "Invalid session id" });
        }

        const notes = await noteService.getNotes(req.user.id, sessionId);

        return res.status(200).json({
            success: true,
            message: "Notes retrieved successfully",
            data: { notes }
        });
    } catch (error) {
        next(error);
    }
};

const createNote = async (req, res, next) => {
    try {
        const { sessionId, content } = req.body;

        if (!sessionId) {
            return res.status(400).json({ success: false, message: "Invalid session id" });
        }

        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({ success: false, message: "Note content cannot be empty" });
        }

        const note = await noteService.createNote(req.user.id, { sessionId, content });

        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: { note }
        });
    } catch (error) {
        next(error);
    }
};

const deleteNote = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Invalid note id" });
        }

        const success = await noteService.deleteNote(req.user.id, id);

        if (!success) {
            return res.status(404).json({ success: false, message: "Note not found or unauthorized" });
        }

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully",
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotes,
    createNote,
    deleteNote
};
