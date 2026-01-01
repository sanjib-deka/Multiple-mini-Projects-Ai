const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server); // socket initialized with the server

// Set EJS as view engine
app.set("view engine", "ejs");

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Store connected users with metadata
const connectedUsers = {};

// Color palette for user assignment
// High-contrast distinct colors for easy identification
const userColors = [
    '#FF0000', // Red
    '#0000FF', // Blue
    '#008000', // Green
    '#FFFF00', // Yellow
    '#800080', // Purple
    '#FFA500', // Orange
    '#00FFFF', // Cyan
    '#FF00FF', // Magenta
    '#00FF00', // Lime
    '#FFC0CB', // Pink
    '#008080', // Teal
    '#A52A2A', // Brown
    '#000080', // Navy
    '#808000' // Olive
];

// Assign color based on socket ID (Deterministic but distributed)
function assignColor(socketId) {
    // Simple hash to ensuring different socket IDs get different colors
    let hash = 0;
    for (let i = 0; i < socketId.length; i++) {
        hash = socketId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % userColors.length;
    return userColors[index];
}

io.on("connection", function (socket) {
    console.log("User connected:", socket.id);

    // Handle device name registration
    socket.on("register-device", function (deviceName) {
        connectedUsers[socket.id] = {
            id: socket.id,
            deviceName: deviceName || `User ${Object.keys(connectedUsers).length + 1}`,
            color: assignColor(socket.id),
            connectedAt: new Date().toISOString()
        };

        console.log(`Device registered: ${deviceName} (${socket.id})`);

        // Send user list to all clients
        io.emit("user-list-update", Object.values(connectedUsers));

        // Send current user their info
        socket.emit("user-info", connectedUsers[socket.id]);
    });

    // Handle location updates
    // Handle location updates
    socket.on("send-location", function (data) {
        // Fallback if server restarted and lost user memory
        const userData = connectedUsers[socket.id] || {
            deviceName: `User (${socket.id.substr(0, 4)})`,
            color: assignColor(socket.id)
        };

        // Ensure user is added back to memory if missing (self-healing)
        if (!connectedUsers[socket.id]) {
            connectedUsers[socket.id] = {
                id: socket.id,
                ...userData,
                connectedAt: new Date().toISOString()
            };
            // Notify others of this "new" user
            io.emit("user-list-update", Object.values(connectedUsers));
        }

        io.emit("receive-location", {
            id: socket.id,
            deviceName: userData.deviceName,
            color: userData.color,
            ...data
        });
    });

    // Handle disconnection
    socket.on("disconnect", function () {
        console.log("User disconnected:", socket.id);
        const deviceName = connectedUsers[socket.id]?.deviceName;
        delete connectedUsers[socket.id];
        io.emit("user-disconnected", socket.id);
        io.emit("user-list-update", Object.values(connectedUsers));
        console.log(`${deviceName} left the tracker`);
    });
})

// Basic route
app.get("/", (req, res) => {
    res.render("index");
});

const PORT = 9000;

server.listen(PORT, "0.0.0.0", () => {
    console.log("\n🚀 RealTime Tracker Server Started!");
    console.log(`\n📍 Local Access: http://localhost:${PORT}`);
    console.log(`\n🌐 Network Access: http://<YOUR_IP>:${PORT}`);
    console.log(`   (Run 'ipconfig' to find your IP address)`);
    console.log(`\n💡 To share with friends on different networks, use ngrok:`);
    console.log(`   ngrok http ${PORT}\n`);
});
