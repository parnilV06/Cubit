const notImplemented = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Not implemented yet"
    });
};

module.exports = {
    getFriends: notImplemented,
    sendFriendRequest: notImplemented,
    acceptRequest: notImplemented,
    rejectRequest: notImplemented,
    removeFriend: notImplemented
};
