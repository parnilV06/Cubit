const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient({
    log:
        process.env.NODE_ENV === "development"
            ? ["query", "info", "warn", "error"]
            : ["error"],
});

async function connectDB() {
    try {
        await prisma.$connect();
        console.log("✅ Connected to PostgreSQL");
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