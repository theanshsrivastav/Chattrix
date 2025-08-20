// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000"); // Your backend server

// export default socket;


// import { io } from "socket.io-client";

// // Replace with actual logged-in user ID
// const socket = io("http://localhost:5000", {
//     query: {
//         userId: authUser?._id, // this must be defined
//     },
// });

// socket.js
import { io } from "socket.io-client";

let socket;

export const connectSocket = (userId) => {
    socket = io("http://localhost:5000", {
        query: { userId },
    });
    return socket;
};

export const getSocket = () => socket;

