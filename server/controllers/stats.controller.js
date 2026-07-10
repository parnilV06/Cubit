const statsService = require('../services/stats.service');

const getDashboard = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await statsService.getDashboardStats(userId);
        
        return res.status(200).json({
            success: true,
            message: "Statistics fetched successfully.",
            data
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboard
};
