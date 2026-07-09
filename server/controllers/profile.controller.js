const profileService = require('../services/profile.service');

const getProfileByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const profile = await profileService.getProfileByUsername(username);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: profile
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "An error occurred"
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { displayName, bio } = req.body;

        const updatedProfile = await profileService.updateProfile(userId, { displayName, bio });

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedProfile
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "An error occurred"
        });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided"
            });
        }

        const userId = req.user.id;
        const updatedProfile = await profileService.uploadAvatar(userId, req.file.buffer);

        return res.status(200).json({
            success: true,
            message: "Avatar updated successfully.",
            data: updatedProfile
        });
    } catch (error) {
        return res.status(error.message === 'User not found' ? 404 : 500).json({
            success: false,
            message: error.message || "An error occurred during avatar upload"
        });
    }
};

module.exports = {
    getProfileByUsername,
    updateProfile,
    uploadAvatar
};
