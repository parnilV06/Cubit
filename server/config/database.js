require('dotenv').config();
const { neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { PrismaClient } = require('../generated/prisma');
const ws = require('ws');

// Configure Neon to use WebSockets over HTTPS/443 (bypasses ISP/firewall port 5432 blocks)
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error("❌ DATABASE_URL is not set in environment variables!");
}

// Pass configuration object to PrismaNeon factory
const adapter = new PrismaNeon({ connectionString });

const prisma = new PrismaClient({
    adapter,
    log:
        process.env.NODE_ENV === "development"
            ? ["query", "info", "warn", "error"]
            : ["error"],
});

async function connectDB() {
    try {
        await prisma.$connect();
        console.log("✅ Connected to PostgreSQL via Neon WebSocket (Port 443)");
    } catch (error) {
        console.error("❌ Failed to connect to PostgreSQL");
        console.error(error);
        process.exit(1);
    }
}

async function disconnectDB() {
    await prisma.$disconnect();
    console.log("📦 Database connection closed");
}

module.exports = {
    prisma,
    connectDB,
    disconnectDB,
};