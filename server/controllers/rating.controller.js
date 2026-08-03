const GamificationEngine = require('../services/gamification');

const getUserRatingSummary = async (req, res, next) => {
    try {
        const summary = await GamificationEngine.getUserRatingSummary(req.user.id);
        return res.status(200).json({
            success: true,
            message: "User rating summary fetched successfully",
            data: summary
        });
    } catch (error) {
        next(error);
    }
};

const reconcileUserRating = async (req, res, next) => {
    try {
        const result = await GamificationEngine.reconcileUserRating(req.user.id);
        return res.status(200).json({
            success: true,
            message: "User rating successfully reconciled",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserRatingSummary,
    reconcileUserRating
};
