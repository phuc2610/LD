import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user",
      required: function() {
        return this.senderRole === "user";
      }
    },
    receiverId: { 
      type: String, // "admin" for admin messages, userId for user messages
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    isRead: { 
      type: Boolean, 
      default: false 
    },
    senderRole: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);

const messageModel = mongoose.models.message || mongoose.model("message", messageSchema);

export default messageModel;

