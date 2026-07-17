const { prisma } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

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

const generateUniqueUsername = async (email, displayName) => {
    let base = '';
    if (email) {
        base = email.split('@')[0];
    } else if (displayName) {
        base = displayName;
    } else {
        base = 'user';
    }

    // Clean it up: keep only lowercase alphanumeric
    base = base.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (!base) {
        base = 'user';
    }

    let username = base;
    let exists = true;
    let count = 0;
    while (exists) {
        const user = await prisma.user.findUnique({
            where: { username }
        });
        if (!user) {
            exists = false;
        } else {
            count++;
            username = `${base}${count}`;
        }
    }
    return username;
};

const loginWithGoogle = async ({ credential }) => {
    if (!credential) {
        throw new Error('Google credential is required');
    }

    let payload;
    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
    } catch (error) {
        console.error('Google token verification error:', error);
        throw new Error('Invalid Google credential');
    }

    const { sub: googleId, email, name: displayName, picture: avatarUrl } = payload;

    if (!email) {
        throw new Error('Google account is missing an email address');
    }

    // Search existing user by email
    let user = await prisma.user.findUnique({
        where: { email }
    });

    if (user) {
        // Associate Google account if not already associated, and optionally update avatar
        if (user.googleId !== googleId || !user.avatarUrl) {
            user = await prisma.user.update({
                where: { email },
                data: {
                    googleId: user.googleId || googleId,
                    avatarUrl: user.avatarUrl || avatarUrl,
                }
            });
        }
    } else {
        // Generate a unique username
        const username = await generateUniqueUsername(email, displayName);

        // Create new user
        user = await prisma.user.create({
            data: {
                email,
                displayName: displayName || username,
                username,
                avatarUrl,
                googleId,
                emailVerified: true
            }
        });
    }

    // Generate JWT (matching the existing login flow)
    const jwtPayload = {
        id: user.id,
        username: user.username
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
        token,
        user: userWithoutPassword
    };
};

module.exports = {
    register,
    login,
    getUserById,
    loginWithGoogle
};

