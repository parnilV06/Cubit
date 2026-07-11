const solveService = require('../services/solve.service');

const getSolves = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        
        if (!sessionId) {
            return res.status(400).json({ success: false, message: "Invalid session id" });
        }

        const solves = await solveService.getSolves(req.user.id, sessionId);
        
        return res.status(200).json({
            success: true,
            message: "Solves retrieved successfully",
            data: { solves }
        });
    } catch (error) {
        next(error);
    }
};

const addSolve = async (req, res, next) => {
    try {
        const { sessionId, time, scramble, penalty } = req.body;

        if (!sessionId) {
            return res.status(400).json({ success: false, message: "Invalid session id" });
        }

        if (time === undefined || time <= 0) {
            return res.status(400).json({ success: false, message: "Invalid time" });
        }

        if (!scramble || typeof scramble !== 'string' || scramble.trim() === '') {
            return res.status(400).json({ success: false, message: "Missing scramble" });
        }
        
        const validPenalties = ['NONE', 'PLUS_TWO', 'DNF'];
        if (penalty && !validPenalties.includes(penalty)) {
            return res.status(400).json({ success: false, message: "Invalid penalty" });
        }

        const solve = await solveService.addSolve(req.user.id, { sessionId, time, scramble, penalty });
        
        return res.status(201).json({
            success: true,
            message: "Solve created successfully",
            data: { solve }
        });
    } catch (error) {
        next(error);
    }
};

const updateSolve = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { time, scramble, sessionId, penalty } = req.body;
        
        if (!id) {
            return res.status(400).json({ success: false, message: "Invalid solve id" });
        }

        if (time !== undefined || scramble !== undefined || sessionId !== undefined) {
             return res.status(400).json({ success: false, message: "Only penalty can be updated" });
        }

        const validPenalties = ['NONE', 'PLUS_TWO', 'DNF'];
        if (penalty && !validPenalties.includes(penalty)) {
            return res.status(400).json({ success: false, message: "Invalid penalty" });
        }

        const solve = await solveService.updateSolve(req.user.id, id, { penalty });
        
        return res.status(200).json({
            success: true,
            message: "Solve updated successfully",
            data: { solve }
        });
    } catch (error) {
        next(error);
    }
};

const deleteSolve = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ success: false, message: "Invalid solve id" });
        }

        const success = await solveService.deleteSolve(req.user.id, id);
        
        if (!success) {
            return res.status(404).json({ success: false, message: "Solve not found or unauthorized" });
        }
        
        return res.status(200).json({
            success: true,
            message: "Solve deleted successfully",
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSolves,
    addSolve,
    updateSolve,
    deleteSolve
};
