const notImplemented = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Not implemented yet"
    });
};

module.exports = {
    getSessions: notImplemented,
    createSession: notImplemented,
    renameSession: notImplemented,
    archiveSession: notImplemented,
    deleteSession: notImplemented
};
