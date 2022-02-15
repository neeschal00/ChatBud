const mongoose = require("mongoose");
const chatMembersSchema = new mongoose.Schema({
    chatId: { type: String, required: true ,ref:'chat'},
    userId: { type: String, required: true ,ref:'user'},
    memberName: { type: String, required: true },
    memberAvatar: { type: String, required: true },
    memberType: { type: String, required: true },
    memberIsDeleted: { type: Boolean, required: true },
    memberIsBlocked: { type: Boolean, required: true },
    memberIsAdmin: { type: Boolean, required: true },
    memberCreatedAt: { type: Date, default: Date.now,required: true },
    memberUpdatedAt: { type: Date, default: Date.now,required: true },    
});
module.exports = mongoose.model("chatMembers", chatMembersSchema)
