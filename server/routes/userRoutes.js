import express from "express";
import { checkAuth, login, signUp, updateProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.put("/update-profile", authMiddleware, updateProfile);
router.get("/check", authMiddleware, checkAuth);


export default router;
