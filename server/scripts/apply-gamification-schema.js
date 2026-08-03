const { prisma, connectDB, disconnectDB } = require('../config/database');

async function main() {
    console.log("Applying Gamification DDL schema changes via Neon WebSocket...");
    await connectDB();

    try {
        await prisma.$executeRawUnsafe(`
            DO $$ BEGIN
                CREATE TYPE "RatingCategory" AS ENUM ('SOLVE', 'IMPROVEMENT', 'TRAINER', 'DAILY_ACTIVITY', 'STREAK_BONUS');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);
        console.log("✓ RatingCategory Enum created");

        await prisma.$executeRawUnsafe(`
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totalRating" DECIMAL(12, 4) NOT NULL DEFAULT 0;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "currentStreak" INTEGER NOT NULL DEFAULT 0;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "longestStreak" INTEGER NOT NULL DEFAULT 0;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastActiveDate" TEXT;
        `);
        console.log("✓ User columns added");

        await prisma.$executeRawUnsafe(`
            ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "evaluatedForImprovement" BOOLEAN NOT NULL DEFAULT false;
            ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "evaluatedAt" TIMESTAMP(3);
        `);
        console.log("✓ Session columns added");

        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "RatingLedger" (
                "id" TEXT NOT NULL,
                "userId" TEXT NOT NULL,
                "category" "RatingCategory" NOT NULL,
                "amount" DECIMAL(12, 4) NOT NULL,
                "description" TEXT,
                "solveId" TEXT,
                "sessionId" TEXT,
                "lessonId" TEXT,
                "activityDate" TEXT,
                "streakMilestone" INTEGER,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT "RatingLedger_pkey" PRIMARY KEY ("id")
            );
        `);
        console.log("✓ RatingLedger table created");

        await prisma.$executeRawUnsafe(`
            DO $$ BEGIN
                ALTER TABLE "RatingLedger" ADD CONSTRAINT "RatingLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            EXCEPTION WHEN duplicate_object THEN null; END $$;

            DO $$ BEGIN
                ALTER TABLE "RatingLedger" ADD CONSTRAINT "RatingLedger_solveId_fkey" FOREIGN KEY ("solveId") REFERENCES "Solve"("id") ON DELETE SET NULL ON UPDATE CASCADE;
            EXCEPTION WHEN duplicate_object THEN null; END $$;

            DO $$ BEGIN
                ALTER TABLE "RatingLedger" ADD CONSTRAINT "RatingLedger_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
            EXCEPTION WHEN duplicate_object THEN null; END $$;

            DO $$ BEGIN
                ALTER TABLE "RatingLedger" ADD CONSTRAINT "RatingLedger_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
            EXCEPTION WHEN duplicate_object THEN null; END $$;
        `);
        console.log("✓ Foreign Key constraints applied");

        await prisma.$executeRawUnsafe(`
            CREATE UNIQUE INDEX IF NOT EXISTS "RatingLedger_solveId_key" ON "RatingLedger"("solveId");
            CREATE UNIQUE INDEX IF NOT EXISTS "RatingLedger_userId_lessonId_key" ON "RatingLedger"("userId", "lessonId");
            CREATE UNIQUE INDEX IF NOT EXISTS "RatingLedger_userId_activityDate_category_key" ON "RatingLedger"("userId", "activityDate", "category");
            CREATE INDEX IF NOT EXISTS "RatingLedger_userId_idx" ON "RatingLedger"("userId");
            CREATE INDEX IF NOT EXISTS "RatingLedger_category_idx" ON "RatingLedger"("category");
            CREATE INDEX IF NOT EXISTS "RatingLedger_userId_category_idx" ON "RatingLedger"("userId", "category");
        `);
        console.log("✓ Unique constraints & Indexes created");

        console.log("🚀 All Gamification schema DDL successfully applied to PostgreSQL database!");
    } catch (err) {
        console.error("❌ Schema DDL application error:", err);
    } finally {
        await disconnectDB();
    }
}

main();
