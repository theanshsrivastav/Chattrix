import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({children})=>{

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const {socket, axios} = useContext(AuthContext);

    // function to get all users for sidebar
    const getUsers = async ()=>{
        try {
            const {data} = await axios.get("/api/messages/users");
        
            if(data.success){
                setUsers(data.user);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to get messages for selected user
    const getMessages = async (userId)=>{
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to send message to selected user
    const sendMessage = async(messageData)=>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                //setMessages((prevMessages)=>[...prevMessages, data.newMessage]);
                
            } else{
                toast.error(data.message);
            }

        } catch (error) {
            toast(error.message);
        }
    }


    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            console.log("=== NEW MESSAGE EVENT ===");
            console.log("senderId:", newMessage.senderId);
            console.log("receiverId:", newMessage.receiverId);
            console.log("selectedUser._id:", selectedUser?._id);
            console.log("text:", newMessage.text);
            const isChatOpen =
                selectedUser &&
                (
                    newMessage.senderId.toString() === selectedUser._id.toString() ||
                    newMessage.receiverId.toString() === selectedUser._id.toString()
                );

            console.log("senderId match:", newMessage.senderId.toString() === selectedUser?._id.toString());
            console.log("receiverId match:", newMessage.receiverId.toString() === selectedUser?._id.toString());
            console.log("isChatOpen:", isChatOpen);

            if (isChatOpen) {
                console.log("✅ ADDING MESSAGE TO STATE");
                setMessages(prev => [...prev, newMessage]);

                setUnseenMessages(prev => ({
                    ...prev,
                    [newMessage.senderId]: 0
                }));
            } else {
                console.log("❌ NOT ADDING - different chat");
                setUnseenMessages(prev => ({
                    ...prev,
                    [newMessage.senderId]:
                        prev[newMessage.senderId]
                            ? prev[newMessage.senderId] + 1
                            : 1
                }));
            }
        };

        const handleMessagesRead = ({ readerId }) => {
            setMessages(prev =>
                prev.map(msg =>
                    msg.receiverId.toString() === readerId.toString()
                        ? { ...msg, status: "read" }
                        : msg
                )
            );
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("messagesRead", handleMessagesRead);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("messagesRead", handleMessagesRead);
        };

    }, [socket, selectedUser]);



    const value = {
        messages, users, selectedUser, getUsers, getMessages, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages, setMessages
    }

    return(
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}