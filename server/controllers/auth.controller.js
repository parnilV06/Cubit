const notImplemented = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Not implemented yet"
    });
};

module.exports = {
    register: notImplemented,
    login: notImplemented,
    logout: notImplemented,
    me: notImplemented
};
