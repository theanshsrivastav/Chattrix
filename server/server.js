import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import router from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";


//creating express app and http server
const app = express();

const server = http.createServer(app); // Create HTTP server


// initialize socket.io server
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // React app URL
        // methods: ["GET", "POST"]
    }
});


// Store online users
export const userSocketMap = {};     // {userId: socketId}


// Socket.io connection
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId) userSocketMap[userId] = socket.id;
    console.log(`userSocketMap: ${Object.keys(userSocketMap)}`)
    // emit online users to all connectedclients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('User disconnected:', userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Middleware
app.use(cors());
app.use(express.json({limit: "4mb"}));


//Routes setup

app.use("/api/status", (req, res)=>{res.send("Server is live.")})
app.use("/api/auth", router);
app.use("/api/messages", messageRouter);

// MongoDB connection
await connectDB();


// ⚡ Socket.IO setup

// app.use((req, res, next) => {
//     const cleanPath = decodeURIComponent(req.path.trim());
//     console.log(`Incoming ${req.method} request to ${cleanPath}`);
//     next();
// });

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})