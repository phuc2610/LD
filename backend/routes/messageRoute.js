import express from "express";
import {
  sendMessage,
  adminSendMessage,
  getUserMessages,
  getAllConversations,
  getMessagesByUserId,
  getUserInfoForChat
} from "../controllers/messageController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const messageRouter = express.Router();

// User routes
messageRouter.post("/send", authUser, sendMessage);
messageRouter.get("/user", authUser, getUserMessages);

// Admin routes
messageRouter.post("/admin/send", adminAuth, adminSendMessage);
messageRouter.get("/admin/conversations", adminAuth, getAllConversations);
messageRouter.get("/admin/user/:userId", adminAuth, getMessagesByUserId);
messageRouter.get("/admin/user-info/:userId", adminAuth, getUserInfoForChat);

export default messageRouter;

