const notImplemented = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Not implemented yet"
    });
};

module.exports = {
    getDashboard: notImplemented,
    getTrend: notImplemented,
    getDistribution: notImplemented,
    getProgress: notImplemented,
    getRecentSessions: notImplemented
};
