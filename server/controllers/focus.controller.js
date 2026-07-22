const focusTracks = require('../config/focusTracks');

const getFocusTracks = async (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Focus tracks retrieved successfully.",
            data: { tracks: focusTracks },
            tracks: focusTracks
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFocusTracks
};
