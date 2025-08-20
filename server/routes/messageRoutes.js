import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", authMiddleware, getUsersForSidebar);
messageRouter.get("/:id", authMiddleware, getMessages);
messageRouter.put("/mark/:id", authMiddleware, markMessageAsSeen);
messageRouter.post("/send/:id", authMiddleware, sendMessage);

export default messageRouter;