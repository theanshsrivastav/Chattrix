import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";
import { generateReplySuggestions } from "../ai/aiService.js";

// Get all users except the logged in user
export const getUsersForSidebar = async(req, res)=>{
    try {
        // console.log("in getUsersForSidebar.");
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");


        // count no. messages not seen
        const unseenMessages = {};
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId: user._id, receiverId: userId, status: { $ne: "read" }});
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success: true, user: filteredUsers, unseenMessages});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


// Get all messages for selected user 
export const getMessages = async (req, res) => {
    try {
        const {id: selectedUserId} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId},
            ]
        })

        await Message.updateMany(
            {
                senderId: selectedUserId,
                receiverId: myId,
                status: { $ne: "read" }
            },
            { status: "read" }
        );

        const senderSocketId = userSocketMap[selectedUserId.toString()];

        if(senderSocketId){
            io.to(senderSocketId).emit("messagesRead", {
                readerId: myId
            });
        }


        res.json({success: true, messages});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


// send message to selected user
export const sendMessage = async(req, res)=>{
    try {
        const {text, image} = req.body;
        const receiverId  = req.params.id;
        const senderId = req.user._id;

        console.log("\n=== SEND MESSAGE ===");
        console.log("Sender:", senderId.toString());
        console.log("Receiver:", receiverId.toString());
        console.log("userSocketMap:", userSocketMap);

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
            status: "sent"
        });

        // emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId.toString()];
        console.log("Receiver socketId:", receiverSocketId);

        if(receiverSocketId){
            // Receiver is online → mark delivered
            newMessage.status = "delivered";
            await newMessage.save();
            
            console.log("✅ Emitting to receiver:", receiverSocketId);
            io.to(receiverSocketId).emit("newMessage", newMessage);

        } else {
            console.log("❌ Receiver offline");
        }

        // Also emit to the sender for instant UI update
        const senderSocketId = userSocketMap[senderId.toString()];
        console.log("Sender socketId:", senderSocketId);

        if(senderSocketId) {
            console.log("✅ Emitting to sender:", senderSocketId);
            io.to(senderSocketId).emit("newMessage", newMessage);
        } else {
            console.log("❌ Sender socket NOT FOUND");
        }
        console.log("=== END ===\n");

        res.json({success: true, newMessage});

        console.log("=== Starting AI Rellieess ===\n");

        /* =========================
        🤖 AI SMART REPLY SECTION
        ========================= */

        // run AI only for text messages
        if(receiverSocketId && text && text.length > 5){

            setTimeout(async () => {

                try {

                    console.log("🔥 Running AI async...");

                    const history = await Message.find({
                        $or:[
                            {senderId, receiverId},
                            {senderId: receiverId, receiverId: senderId}
                        ]
                    })
                    .sort({createdAt:-1})
                    .limit(5);

                    history.reverse();

                    const suggestions =
                        await generateReplySuggestions(
                            text,
                            history
                        );

                    console.log("✅ Suggestions:", suggestions);

                    io.to(receiverSocketId).emit("aiSuggestions", suggestions);

                } catch(err){
                    console.log("AI Error:", err);
                }

            }, 0);
        }

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}