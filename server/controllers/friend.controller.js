const friendService = require('../services/friend.service');

const getFriends = async (req, res, next) => {
    try {
        const friends = await friendService.getFriends(req.user.id);
        return res.status(200).json({
            success: true,
            message: "Friends fetched successfully",
            data: friends
        });
    } catch (error) {
        next(error);
    }
};

const getRequests = async (req, res, next) => {
    try {
        const requests = await friendService.getRequests(req.user.id);
        return res.status(200).json({
            success: true,
            message: "Friend requests fetched successfully",
            data: requests
        });
    } catch (error) {
        next(error);
    }
};

const sendFriendRequest = async (req, res, next) => {
    try {
        await friendService.sendFriendRequest(req.user.id, req.body.username);
        return res.status(200).json({
            success: true,
            message: "Friend request sent successfully",
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

const acceptRequest = async (req, res, next) => {
    try {
        await friendService.acceptRequest(req.user.id, req.params.id);
        return res.status(200).json({
            success: true,
            message: "Friend request accepted successfully",
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

const rejectRequest = async (req, res, next) => {
    try {
        await friendService.rejectRequest(req.user.id, req.params.id);
        return res.status(200).json({
            success: true,
            message: "Friend request rejected successfully",
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

const removeFriend = async (req, res, next) => {
    try {
        await friendService.removeFriend(req.user.id, req.params.id);
        return res.status(200).json({
            success: true,
            message: "Friend removed successfully",
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFriends,
    getRequests,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend
};
