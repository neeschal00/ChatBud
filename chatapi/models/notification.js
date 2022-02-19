const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    notificationType: { type: String, required: true, max:30 },
    notificationTitle: { type: String, required: true ,max:100},
    notificationMessage: { type: String, required: true,max:200 },
    notificationSenderId: { type: String, required: true ,ref:'user'},
    notificationSenderName: { type: String, required: true ,max:100},
    notificationSenderAvatar: { type: String, required: true, max:100 },
    notificationSenderType: { type: String, required: true, max:100 },
    notificationCreatedAt: { type: Date, default: Date.now },
    notificationUpdatedAt: { type: Date, default: Date.now },

})

module.exports = mongoose.model("notification", notificationSchema);