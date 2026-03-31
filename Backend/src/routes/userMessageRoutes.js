import express from "express";
import userMessage from "../controllers/userMessageController.js";
const router = express.Router();

router.post("/userMessage", userMessage);

export default router;
