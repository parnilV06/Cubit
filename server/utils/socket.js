const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initializeSocket = (httpServer) => {
    const parseAllowedOrigins = () => {
        const origins = [
            process.env.CLIENT_ORIGIN,
            process.env.CLIENT_URL,
            'http://localhost:5173',
            'http://127.0.0.1:5173',
        ];
        const list = [];
        origins.forEach(item => {
            if (item) {
                item.split(',').forEach(o => {
                    const trimmed = o.trim();
                    if (trimmed) {
                        const clean = trimmed.replace(/\/$/, '');
                        if (!list.includes(clean)) {
                            list.push(clean);
                        }
                    }
                });
            }
        });
        return list;
    };

    const allowedOrigins = parseAllowedOrigins();

    const isOriginAllowed = (origin) => {
        if (!origin) return false;
        const cleanOrigin = origin.replace(/\/$/, '');
        if (allowedOrigins.includes(cleanOrigin)) {
            return true;
        }
        if (cleanOrigin.startsWith('https://cubit-') && cleanOrigin.endsWith('.vercel.app')) {
            return true;
        }
        return false;
    };

    io = new Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || isOriginAllowed(origin)) {
                    callback(null, true);
                } else {
                    console.warn(`[Socket CORS Blocked] Origin "${origin}" is not allowed.`);
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }
    });

    io.use((socket, next) => {
        let token = socket.handshake.auth?.token;

        if (!token && socket.handshake.headers?.authorization) {
            token = socket.handshake.headers.authorization.split(' ')[1];
        }

        if (!token && socket.handshake.query?.token) {
            token = socket.handshake.query.token;
        }

        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // Should contain userId based on auth schema
            next();
        } catch (err) {
            return next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.user.id || socket.user.userId;
        const roomName = `room:${userId}`;
        socket.join(roomName);
        console.log("Socket connected:", socket.id);
        console.log("User:", socket.user);
        console.log("Joined room:", roomName);
        socket.on('disconnect', () => {
            socket.leave(roomName);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io is not initialized!');
    }
    return io;
};

const emitToUser = (userId, event, payload) => {
     console.log("================================");
    console.log("EMIT");
    console.log("User:", userId);
    console.log("Room:", `room:${userId}`);
    console.log("Event:", event);
    console.log("Payload:", payload);
    console.log("================================");

    if (io) {
        io.to(`room:${userId}`).emit(event, payload);
        
    }
};

module.exports = {
    initializeSocket,
    getIO,
    emitToUser
};
