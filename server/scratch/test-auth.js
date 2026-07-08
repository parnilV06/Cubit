const http = require('http');

const request = (options, data = null) => {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk.toString());
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    body: body ? JSON.parse(body) : null
                });
            });
        });
        
        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
};

async function test() {
    const baseUrl = 'http://localhost:5000/api/auth';
    
    // 1. Register
    const registerBody = {
        displayName: 'Test User',
        username: 'testuser_' + Date.now(),
        email: `test_${Date.now()}@example.com`,
        password: 'password123'
    };
    
    console.log('Testing Registration...');
    const regRes = await request({
        method: 'POST',
        host: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        headers: { 'Content-Type': 'application/json' }
    }, registerBody);
    console.log('Register Response:', regRes.statusCode, regRes.body);
    
    // 2. Login
    console.log('\nTesting Login...');
    const loginRes = await request({
        method: 'POST',
        host: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        headers: { 'Content-Type': 'application/json' }
    }, {
        email: registerBody.email,
        password: registerBody.password
    });
    console.log('Login Response:', loginRes.statusCode, loginRes.body);
    
    const token = loginRes.body.data?.token;
    
    if (token) {
        // 3. Me
        console.log('\nTesting Me (with token)...');
        const meRes = await request({
            method: 'GET',
            host: 'localhost',
            port: 5000,
            path: '/api/auth/me',
            headers: { 
                'Authorization': `Bearer ${token}` 
            }
        });
        console.log('Me Response:', meRes.statusCode, meRes.body);
        
        // 4. Logout
        console.log('\nTesting Logout...');
        const logoutRes = await request({
            method: 'POST',
            host: 'localhost',
            port: 5000,
            path: '/api/auth/logout',
            headers: { 
                'Authorization': `Bearer ${token}` 
            }
        });
        console.log('Logout Response:', logoutRes.statusCode, logoutRes.body);
    }
}

test().catch(console.error);
