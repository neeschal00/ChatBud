const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
    chatName: { type: String, required: true, max:100 },
    chatType: { type: String, required: true, max:100 },
    chatMembers: [{ type: mongoose.Schema.ObjectId, ref: "user" }],
    chatMessages: [{ type: mongoose.Schema.ObjectId, ref: "chatMessages" }],
    createdBy: { type: String, required: true, ref: "user" },
    chatCreatedAt: { type: Date, default: Date.now },
    chatUpdatedAt: { type: Date, default: Date.now },
    chatIsDeleted: { type: Boolean, default: false },
    chatIsActive: { type: Boolean, default: true },
    chatIsVerified: { type: Boolean, default: false },
    chatIsBlocked: { type: Boolean, default: false },
    chatIsPublic: { type: Boolean, default: false },
    chatIsPrivate: { type: Boolean, default: false },
    chatIsGroup: { type: Boolean, default: false },
    chatIsChannel: { type: Boolean, default: false },
    chatPicture:{type:String, default:""},
});

module.exports = mongoose.model("chat", chatSchema)

