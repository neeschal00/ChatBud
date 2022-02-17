const mongoose = require("mongoose");
const chatMessagesSchema = new mongoose.Schema({
    chatId: { type: String, required: true ,ref: 'chat'},
    message: { type: String, required: true },
    isSent: { type: Boolean, required: true },
    isMedia: { type: Boolean,  default: false },
    mediaType: { type: String, enum:["image","video","text"],  default: "text" },
    mediaUrl: { type: String,  default: "" },
    senderId: { type: String, required: true, ref:'user' },
    senderIsDeleted: { type: Boolean,  default: false },
    senderIsBlocked: { type: Boolean, default: false },
    senderIsAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

});
module.exports = mongoose.model("chatMessages", chatMessagesSchema)