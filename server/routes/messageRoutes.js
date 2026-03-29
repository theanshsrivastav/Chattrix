import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", authMiddleware, getUsersForSidebar);
messageRouter.get("/:id", authMiddleware, getMessages);
messageRouter.post("/send/:id", authMiddleware, sendMessage);

export default messageRouter;