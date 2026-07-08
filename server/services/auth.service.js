const { prisma } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async ({ displayName, username, email, password }) => {
    if (!displayName || !username || !email || !password) {
        throw new Error('All fields are required');
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
        where: { email }
    });
    if (existingEmail) {
        throw new Error('Email is already in use');
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
        where: { username }
    });
    if (existingUsername) {
        throw new Error('Username is already taken');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
        data: {
            displayName,
            username,
            email,
            password: hashedPassword,
            emailVerified: false
        }
    });

    // Exclude password from the returned user object
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
};

const login = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Generate JWT
    const payload = {
        id: user.id,
        username: user.username
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
        token,
        user: userWithoutPassword
    };
};

const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });
    
    if (!user) {
        throw new Error('User not found');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

module.exports = {
    register,
    login,
    getUserById
};
