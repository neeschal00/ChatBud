const mongoose = require("mongoose");


const chatMessagesSchema = new mongoose.Schema({
    chatId: { type: String, required: true },
    message: { type: String, required: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderAvatar: { type: String, required: true },
    senderType: { type: String, required: true },
    senderStatus: { type: String, required: true },
    senderIsOnline: { type: Boolean, required: true },
    senderIsTyping: { type: Boolean, required: true },
    senderIsDeleted: { type: Boolean, required: true },
    senderIsBlocked: { type: Boolean, required: true },
    senderIsVerified: { type: Boolean, required: true },
    senderIsAdmin: { type: Boolean, required: true },
    senderIsActive: { type: Boolean, required: true },
    senderCreatedAt: { type: Date, required: true },
    senderUpdatedAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

});

const chatMembersSchema = new mongoose.Schema({
    chatId: { type: String, required: true },
    memberId: { type: String, required: true },
    memberName: { type: String, required: true },
    memberAvatar: { type: String, required: true },
    memberType: { type: String, required: true },
    memberStatus: { type: String, required: true },
    memberIsOnline: { type: Boolean, required: true },
    memberIsTyping: { type: Boolean, required: true },
    memberIsDeleted: { type: Boolean, required: true },
    memberIsBlocked: { type: Boolean, required: true },
    memberIsVerified: { type: Boolean, required: true },
    memberIsAdmin: { type: Boolean, required: true },
    memberIsActive: { type: Boolean, required: true },
    memberCreatedAt: { type: Date, required: true },
    memberUpdatedAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    
});


const chatSchema = new mongoose.Schema({
    chatId: { type: String, required: true, unique: true },
    chatName: { type: String, required: true },
    chatType: { type: String, required: true },
    chatMembers: { type: Array, default: [] },
    chatMessages: { type: Array, default: [] },
    chatCreatedAt: { type: Date, default: Date.now },
    chatUpdatedAt: { type: Date, default: Date.now },
    chatIsDeleted: { type: Boolean, default: false },
    chatIsActive: { type: Boolean, default: true },
    chatIsVerified: { type: Boolean, default: false },
    chatIsBlocked: { type: Boolean, default: false },
    chatIsAdmin: { type: Boolean, default: false },
    chatIsPublic: { type: Boolean, default: false },
    chatIsPrivate: { type: Boolean, default: false },
    chatIsGroup: { type: Boolean, default: false },
    chatIsChannel: { type: Boolean, default: false },
});

module.exports = mongoose.model("chat", chatSchema)
module.exports = mongoose.model("chatMessages", chatMessagesSchema)
module.exports = mongoose.model("chatMembers", chatMembersSchema)
