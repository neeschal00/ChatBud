const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  email: { type: String,required:true},
  password: { type: String, 
    required: true, 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  buddies: [{ type: mongoose.Schema.ObjectId, ref: "user" }],
  groups: [{ type: mongoose.Schema.ObjectId, ref: "chat" }],
  blockedUsers: [{ type: mongoose.Schema.ObjectId, ref: "user" }],
  chats: [{ type: mongoose.Schema.ObjectId, ref: "chat" }],
  channels: [{ type: mongoose.Schema.ObjectId, ref: "chat" }],
  messages: [{ type: mongoose.Schema.ObjectId, ref: "chatMessages" }],
  notifications: [{ type: mongoose.Schema.ObjectId, ref: "notification" }],  
  profile_picture: { type: String, 
    default: "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg" 
  },   
  bio: { type: String, default: " " },  
});

module.exports = mongoose.model("user", userSchema);


