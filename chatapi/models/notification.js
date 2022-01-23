const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    notificationType: { type: String, required: true },
    notificationTitle: { type: String, required: true },
    notificationMessage: { type: String, required: true },
    notificationSenderId: { type: String, required: true },
    notificationSenderName: { type: String, required: true },
    notificationSenderAvatar: { type: String, required: true },
    notificationSenderType: { type: String, required: true },
    notificationCreatedAt: { type: Date, default: Date.now },
    notificationUpdatedAt: { type: Date, default: Date.now },

})

module.exports = mongoose.model("notification", notificationSchema);