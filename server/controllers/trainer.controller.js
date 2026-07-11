const trainerService = require('../services/trainer.service');

const getLessons = async (req, res) => {
    try {
        const userId = req.user.id;
        const lessons = await trainerService.getLessons(userId);

        return res.status(200).json({
            success: true,
            message: "Lessons retrieved successfully",
            data: lessons
        });
    } catch (error) {
        console.error('Error fetching lessons:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching lessons'
        });
    }
};

const getLesson = async (req, res) => {
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
        console.error('Error fetching lesson:', error);
        if (error.message === 'Lesson metadata not found' || error.message === 'Lesson content not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the lesson'
        });
    }
};

const completeLesson = async (req, res) => {
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
        console.error('Error completing lesson:', error);
        if (error.message === 'Lesson not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An error occurred while completing the lesson'
        });
    }
};

const getProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const progressData = await trainerService.getProgress(userId);

        return res.status(200).json({
            success: true,
            message: "Progress retrieved successfully",
            data: progressData
        });
    } catch (error) {
        console.error('Error fetching progress:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching progress'
        });
    }
};

module.exports = {
    getLessons,
    getLesson,
    completeLesson,
    getProgress
};
