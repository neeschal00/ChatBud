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
  chats: [{ type: mongoose.Schema.ObjectId, ref: "chat" }],
  channels: [{ type: mongoose.Schema.ObjectId, ref: "chat" }],
  messages: [{ type: mongoose.Schema.ObjectId, ref: "chatMessages" }],
  notifications: [{ type: mongoose.Schema.ObjectId, ref: "notification" }],  
  profile_picture: { type: String, default: "https://res.cloudinary.com/dzqbzqgjw/image/upload/v1569098981/default_profile_picture_xqjqjy.png" },   
  bio: { type: String, default: " " },  
});

module.exports = mongoose.model("user", userSchema);


