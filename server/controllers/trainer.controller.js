const trainerService = require('../services/trainer.service');

const getLessons = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const lessons = await trainerService.getLessons(userId);

        return res.status(200).json({
            success: true,
            message: "Lessons retrieved successfully",
            data: lessons
        });
    } catch (error) {
        next(error);
    }
};

const getLesson = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { slug } = req.params;

        const data = await trainerService.getLesson(slug, userId);

        return res.status(200).json({
            success: true,
            message: "Lesson retrieved successfully",
            data
        });
    } catch (error) {
        next(error);
    }
};

const completeLesson = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { slug } = req.params;

        await trainerService.completeLesson(slug, userId);

        return res.status(200).json({
            success: true,
            message: "Lesson marked as completed",
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

const getProgress = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const progressData = await trainerService.getProgress(userId);

        return res.status(200).json({
            success: true,
            message: "Progress retrieved successfully",
            data: progressData
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getLessons,
    getLesson,
    completeLesson,
    getProgress
};
