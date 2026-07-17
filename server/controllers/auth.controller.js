const authService = require('../services/auth.service');

const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { token, user } = await authService.login(req.body);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: { token, user }
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Logout successful",
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

const me = async (req, res, next) => {
    try {
        // req.user is attached by the auth middleware
        const user = await authService.getUserById(req.user.id);
        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

const googleLogin = async (req, res, next) => {
    try {
        const { token, user } = await authService.loginWithGoogle(req.body);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: { token, user }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    logout,
    me,
    googleLogin
};

