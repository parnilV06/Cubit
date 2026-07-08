const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { user }
        });
    } catch (error) {
        // Return 400 for validation/duplicate errors to be safe, could be customized based on error type
        const statusCode = error.message.includes('required') || error.message.includes('already') ? 400 : 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { token, user } = await authService.login(req.body);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: { token, user }
        });
    } catch (error) {
        const statusCode = error.message.includes('Invalid credentials') ? 401 : 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

const logout = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Logout successful",
            data: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred during logout"
        });
    }
};

const me = async (req, res) => {
    try {
        // req.user is attached by the auth middleware
        const user = await authService.getUserById(req.user.id);
        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: { user }
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    me
};
