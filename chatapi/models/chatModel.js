const mongoose = require("mongoose");


const chatMessagesSchema = new mongoose.Schema({
    chatId: { type: String, required: true ,ref: 'ChatSchema'},
    message: { type: String, required: true },
    senderId: { type: String, required: true, ref:'ChatMembersSchema' },
    senderName: { type: String, required: true },
    senderAvatar: { type: String, required: true },
    senderType: { type: String, required: true },
    senderStatus: { type: String, required: true },
    senderIsDeleted: { type: Boolean, required: true },
    senderIsBlocked: { type: Boolean, required: true },
    senderIsAdmin: { type: Boolean, required: true },
    senderIsActive: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

});

const chatMembersSchema = new mongoose.Schema({
    chatId: { type: String, required: true ,ref:'ChatSchema'},
    userId: { type: String, required: true ,ref:'UserSchema'},
    memberName: { type: String, required: true },
    memberAvatar: { type: String, required: true },
    memberType: { type: String, required: true },
    memberIsDeleted: { type: Boolean, required: true },
    memberIsBlocked: { type: Boolean, required: true },
    memberIsAdmin: { type: Boolean, required: true },
    memberCreatedAt: { type: Date, default: Date.now,required: true },
    memberUpdatedAt: { type: Date, default: Date.now,required: true },    
});


const chatSchema = new mongoose.Schema({
    chatName: { type: String, required: true },
    chatType: { type: String, required: true },
    chatMembers: [{ type: mongoose.Schema.ObjectId, ref: "chatMembers" }],
    chatMessages: [{ type: mongoose.Schema.ObjectId, ref: "chatMessages" }],
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
    chatPicture:{type:String, default:""},
});

module.exports = mongoose.model("chat", chatSchema)
module.exports = mongoose.model("chatMessages", chatMessagesSchema)
module.exports = mongoose.model("chatMembers", chatMembersSchema)
