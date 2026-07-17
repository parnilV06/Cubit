// Mock OAuth2Client before any imports to stub the Google verification
const { OAuth2Client } = require('google-auth-library');

OAuth2Client.prototype.verifyIdToken = async function({ idToken }) {
    if (idToken === 'mock-google-token-new') {
        return {
            getPayload: () => ({
                sub: 'google-sub-new-123',
                email: 'google-test-new@cubit.dev',
                name: 'Google Test New User',
                picture: 'https://lh3.googleusercontent.com/a/new-avatar-url'
            })
        };
    }
    if (idToken === 'mock-google-token-existing') {
        return {
            getPayload: () => ({
                sub: 'google-sub-existing-456',
                email: 'email-test-user@cubit.dev', // matching the email-password user
                name: 'Google Updated Name',
                picture: 'https://lh3.googleusercontent.com/a/existing-avatar-url'
            })
        };
    }
    throw new Error('Invalid Google Token');
};

require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB, disconnectDB, prisma } = require('./config/database');

// Mount routes (since server.js does this and app.js is just a base app)
const cubitRoutes = require('./routes/cubit.routes');
const errorHandler = require('./middlewares/error.middleware');

// Check if route is already mounted, if not mount it
if (!app._router || !app._router.stack.some(layer => layer.regexp.test('/api'))) {
    app.use('/api', cubitRoutes);
    app.use(errorHandler);
}

const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}/api`;

const testUser = {
    displayName: 'Test Email User',
    username: 'testemailuser',
    email: 'email-test-user@cubit.dev',
    password: 'securepassword123'
};

async function runTests() {
    console.log('🔄 Connecting to Database...');
    await connectDB();

    console.log('🧹 Cleaning up old test users...');
    try {
        await prisma.user.deleteMany({
            where: {
                email: {
                    in: [testUser.email, 'google-test-new@cubit.dev']
                }
            }
        });
        console.log('✅ Cleanup complete');
    } catch (e) {
        console.log('⚠️ Cleanup warning:', e.message);
    }

    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(PORT, resolve));
    console.log(`🚀 Test server listening on port ${PORT}`);

    let jwtToken = null;

    try {
        // --- TEST 1: EMAIL SIGNUP ---
        console.log('\n--- Test 1: Email Signup ---');
        const signupRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const signupJson = await signupRes.json();
        
        if (signupRes.status !== 201 || !signupJson.success) {
            throw new Error(`Email signup failed: ${JSON.stringify(signupJson)}`);
        }
        console.log('✅ Email Signup works! Response:', signupJson.message);

        // --- TEST 2: EMAIL LOGIN ---
        console.log('\n--- Test 2: Email Login ---');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });
        const loginJson = await loginRes.json();

        if (loginRes.status !== 200 || !loginJson.success || !loginJson.data.token) {
            throw new Error(`Email login failed: ${JSON.stringify(loginJson)}`);
        }
        jwtToken = loginJson.data.token;
        console.log('✅ Email Login works! Token generated.');

        // --- TEST 3: JWT AUTHENTICATION (/me endpoint) ---
        console.log('\n--- Test 3: JWT Verification ---');
        const meRes = await fetch(`${BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        });
        const meJson = await meRes.json();

        if (meRes.status !== 200 || !meJson.success || meJson.data.user.email !== testUser.email) {
            throw new Error(`JWT auth failed: ${JSON.stringify(meJson)}`);
        }
        console.log('✅ JWT Authentication works! Fetched user:', meJson.data.user.username);

        // --- TEST 4: GOOGLE LOGIN (CREATE NEW USER) ---
        console.log('\n--- Test 4: Google Login (Create New User) ---');
        const googleNewRes = await fetch(`${BASE_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                credential: 'mock-google-token-new'
            })
        });
        const googleNewJson = await googleNewRes.json();

        if (googleNewRes.status !== 200 || !googleNewJson.success || !googleNewJson.data.token) {
            throw new Error(`Google new user login failed: ${JSON.stringify(googleNewJson)}`);
        }
        
        const googleUserObj = googleNewJson.data.user;
        if (googleUserObj.email !== 'google-test-new@cubit.dev' || !googleUserObj.googleId) {
            throw new Error(`Google user creation mismatch: ${JSON.stringify(googleUserObj)}`);
        }
        console.log('✅ Google signup/login successful! Created username:', googleUserObj.username);

        // --- TEST 5: GOOGLE LOGIN (LINK EXISTING EMAIL USER) ---
        console.log('\n--- Test 5: Google Login (Link to Existing Email User) ---');
        const googleExistRes = await fetch(`${BASE_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                credential: 'mock-google-token-existing'
            })
        });
        const googleExistJson = await googleExistRes.json();

        if (googleExistRes.status !== 200 || !googleExistJson.success) {
            throw new Error(`Google existing user login failed: ${JSON.stringify(googleExistJson)}`);
        }

        const linkedUserObj = googleExistJson.data.user;
        if (linkedUserObj.email !== testUser.email || linkedUserObj.username !== testUser.username || linkedUserObj.googleId !== 'google-sub-existing-456') {
            throw new Error(`Linking user failed or duplicated account: ${JSON.stringify(linkedUserObj)}`);
        }
        console.log('✅ Google linked existing user account correctly! Linked googleId:', linkedUserObj.googleId);

        // Check DB directly to ensure single record
        const matchingUsers = await prisma.user.findMany({
            where: { email: testUser.email }
        });
        if (matchingUsers.length !== 1) {
            throw new Error(`Expected exactly 1 user for email ${testUser.email}, found ${matchingUsers.length}`);
        }
        console.log('✅ Verified no user duplication in Database.');

        console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉');

    } catch (error) {
        console.error('\n❌ TEST RUN FAILED:');
        console.error(error);
        process.exitCode = 1;
    } finally {
        console.log('\n%c Cleaning up test users from Database...', 'color: yellow');
        try {
            await prisma.user.deleteMany({
                where: {
                    email: {
                        in: [testUser.email, 'google-test-new@cubit.dev']
                    }
                }
            });
            console.log('✅ Cleanup complete');
        } catch (e) {
            console.log('⚠️ Cleanup failed:', e.message);
        }

        console.log('🔌 Closing server and database connection...');
        server.close();
        await disconnectDB();
        console.log('🏁 Finished.');
    }
}

runTests();
