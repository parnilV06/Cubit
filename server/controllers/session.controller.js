const sessionService = require('../services/session.service');

const getSessions = async (req, res, next) => {
    try {
        const sessions = await sessionService.getSessions(req.user.id);
        return res.status(200).json({
            success: true,
            message: "Sessions retrieved successfully",
            data: { sessions }
        });
    } catch (error) {
        next(error);
    }
};

const getCurrentSession = async (req, res, next) => {
    try {
        const session = await sessionService.getCurrentSession(req.user.id);
        return res.status(200).json({
            success: true,
            message: "Current session retrieved successfully",
            data: { session }
        });
    } catch (error) {
        next(error);
    }
};

const createSession = async (req, res, next) => {
    try {
        const session = await sessionService.createSession(req.user.id, req.body);
        return res.status(201).json({
            success: true,
            message: "Session created successfully",
            data: { session }
        });
    } catch (error) {
        next(error);
    }
};

const renameSession = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Name cannot be empty"
            });
        }
        
        const session = await sessionService.renameSession(req.user.id, id, name);
        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found or unauthorized"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Session renamed successfully",
            data: { session }
        });
    } catch (error) {
        next(error);
    }
};

const archiveSession = async (req, res, next) => {
    try {
        const { id } = req.params;
        const session = await sessionService.archiveSession(req.user.id, id);
        
        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found or unauthorized"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Session archived successfully",
            data: { session }
        });
    } catch (error) {
        next(error);
    }
};

const deleteSession = async (req, res, next) => {
    try {
        const { id } = req.params;
        const success = await sessionService.deleteSession(req.user.id, id);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: "Session not found or unauthorized"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Session deleted successfully",
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSessions,
    getCurrentSession,
    createSession,
    renameSession,
    archiveSession,
    deleteSession
};
