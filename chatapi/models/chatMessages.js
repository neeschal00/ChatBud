const mongoose = require("mongoose");
const chatMessagesSchema = new mongoose.Schema({
    chatId: { type: String, required: true ,ref: 'chat'},
    message: { type: String, required: true },
    isSent: { type: Boolean, required: true },
    isMedia: { type: Boolean, required: true, default: false },
    mediaType: { type: String, enum:["image","video"], required: true, default: "" },
    mediaUrl: { type: String, required: true, default: "" },
    senderId: { type: String, required: true, ref:'chatMembers' },
    senderName: { type: String, required: true },
    senderAvatar: { type: String, required: true },
    senderIsDeleted: { type: Boolean, required: true, default: false },
    senderIsBlocked: { type: Boolean, required: true,default: false },
    senderIsAdmin: { type: Boolean, required: true,default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

});
module.exports = mongoose.model("chatMessages", chatMessagesSchema)