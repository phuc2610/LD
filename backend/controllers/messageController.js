import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";

// Send a message
const sendMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { message, receiverId = "admin" } = req.body;

    if (!message || !message.trim()) {
      return res.json({ success: false, message: "Tin nhắn không được để trống" });
    }

    const newMessage = new messageModel({
      senderId: userId,
      receiverId: receiverId,
      message: message.trim(),
      senderRole: "user"
    });

    await newMessage.save();

    res.json({ 
      success: true, 
      message: "Đã gửi tin nhắn",
      data: newMessage 
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin send message
const adminSendMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message || !message.trim()) {
      return res.json({ success: false, message: "Thiếu thông tin" });
    }

    const newMessage = new messageModel({
      senderId: null, // Admin doesn't have userId
      receiverId: userId,
      message: message.trim(),
      senderRole: "admin"
    });

    await newMessage.save();

    res.json({ 
      success: true, 
      message: "Đã gửi tin nhắn",
      data: newMessage 
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get messages for user
const getUserMessages = async (req, res) => {
  try {
    const userId = req.userId;

    const messages = await messageModel
      .find({
        $or: [
          { senderId: userId, receiverId: "admin" },
          { receiverId: userId, senderRole: "admin" }
        ]
      })
      .sort({ createdAt: 1 })
      .populate({ path: "senderId", select: "name email" })
      .lean();

    // Mark messages as read
    await messageModel.updateMany(
      { receiverId: userId, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all conversations for admin
const getAllConversations = async (req, res) => {
  try {
    const conversations = await messageModel.aggregate([
      {
        $match: {
          $or: [
            { receiverId: "admin" },
            { senderRole: "admin" }
          ]
        }
      },
      {
        $addFields: {
          userId: {
            $cond: [
              { $eq: ["$receiverId", "admin"] },
              "$senderId",
              "$receiverId"
            ]
          }
        }
      },
      {
        $match: {
          userId: { $ne: null, $ne: "admin" }
        }
      },
      {
        $group: {
          _id: "$userId",
          lastMessage: { $max: "$createdAt" },
          lastMessageText: {
            $first: {
              $cond: [
                { $eq: ["$createdAt", { $max: "$createdAt" }] },
                "$message",
                null
              ]
            }
          },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$receiverId", "admin"] }, { $eq: ["$isRead", false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $match: {
          _id: { $ne: null }
        }
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$_id", "$$userId"] },
                    { $eq: [{ $toString: "$_id" }, { $toString: "$$userId" }] }
                  ]
                }
              }
            }
          ],
          as: "user"
        }
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          userId: { $toString: "$_id" },
          userName: "$user.name",
          userEmail: "$user.email",
          lastMessage: 1,
          unreadCount: 1
        }
      },
      {
        $sort: { lastMessage: -1 }
      }
    ]);

    // Ensure unique userIds and convert ObjectIds to strings
    const conversationMap = new Map();
    conversations.forEach(conv => {
      const userIdStr = conv.userId ? conv.userId.toString() : null;
      if (userIdStr) {
        // If already exists, keep the one with more recent lastMessage and preserve user info
        const existing = conversationMap.get(userIdStr);
        if (!existing || new Date(conv.lastMessage) > new Date(existing.lastMessage)) {
          conversationMap.set(userIdStr, {
            userId: userIdStr,
            userName: conv.userName || existing?.userName || null,
            userEmail: conv.userEmail || existing?.userEmail || null,
            lastMessage: conv.lastMessage,
            unreadCount: conv.unreadCount || 0
          });
        } else {
          // Merge unread counts but keep user info from existing
          existing.unreadCount = (existing.unreadCount || 0) + (conv.unreadCount || 0);
          // Preserve user info if missing
          if (!existing.userName && conv.userName) {
            existing.userName = conv.userName;
          }
          if (!existing.userEmail && conv.userEmail) {
            existing.userEmail = conv.userEmail;
          }
        }
      }
    });

    const uniqueConversations = Array.from(conversationMap.values());

    res.json({ success: true, conversations: uniqueConversations });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get messages for a specific user (admin view)
const getMessagesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await messageModel
      .find({
        $or: [
          { senderId: userId, receiverId: "admin" },
          { receiverId: userId, senderRole: "admin" }
        ]
      })
      .sort({ createdAt: 1 })
      .populate({ path: "senderId", select: "name email" })
      .lean();

    // Mark messages as read
    await messageModel.updateMany(
      { receiverId: "admin", senderId: userId, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get user info by userId (for admin to start chat with user who hasn't chatted yet)
const getUserInfoForChat = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.json({ success: false, message: "Thiếu userId" });
    }

    const user = await userModel.findById(userId).select("name email").lean();
    
    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // Check if there are any messages with this user
    const hasMessages = await messageModel.findOne({
      $or: [
        { senderId: userId, receiverId: "admin" },
        { receiverId: userId, senderRole: "admin" }
      ]
    });

    res.json({ 
      success: true, 
      user,
      hasConversation: !!hasMessages
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  sendMessage,
  adminSendMessage,
  getUserMessages,
  getAllConversations,
  getMessagesByUserId,
  getUserInfoForChat
};

