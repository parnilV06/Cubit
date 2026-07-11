const { io } = require("socket.io-client");

// Read token from command line arguments
const token = process.argv[2];

if (!token) {
    console.error("Please provide a JWT token:");
    console.error("node tools/socket-test.js <JWT_TOKEN>");
    process.exit(1);
}

const socket = io("ws://localhost:5000", {
    auth: {
        token: token
    }
});

socket.on("connect", () => {
    console.log("✅ Connected to Socket.IO Server!");
    console.log("Socket ID:", socket.id);
});

socket.on("disconnect", (reason) => {
    console.log("❌ Disconnected from server. Reason:", reason);
});

socket.on("connect_error", (err) => {
    console.error("❌ Connection error:", err.message);
});

// Listen for notifications
socket.on("notification:new", (payload) => {
    console.log("\n================================");
    console.log("🔔 NEW NOTIFICATION RECEIVED!");
    console.log(JSON.stringify(payload, null, 2));
    console.log("================================\n");
});
