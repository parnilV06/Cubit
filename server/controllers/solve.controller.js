const notImplemented = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Not implemented yet"
    });
};

module.exports = {
    getSolves: notImplemented,
    addSolve: notImplemented,
    updateSolve: notImplemented,
    deleteSolve: notImplemented
};
