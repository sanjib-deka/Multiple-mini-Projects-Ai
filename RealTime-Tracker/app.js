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

io.on("connection", function(socket){
    console.log("connected")
    socket.on("send-location", function(data){
        io.emit("receive-location",{id: socket.id, ...data})   // id and all data using spread oprator
    })


    socket.on("disconnect", function() {
        io.emit("user-disconnected", socket.id);
      });
      
})

// Basic route
app.get("/", (req, res) => {
    res.render("index");
});

// Start the server
server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
