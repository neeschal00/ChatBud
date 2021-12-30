const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  email: { type: String,required:true},
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  buddies: { type: Array, default: [] },
  groups: { type: Array, default: [] },
  chats: { type: Array, default: [] },
  channels: { type: Array, default: [] },
  messages: { type: Array, default: [] },
  notifications: { type: Array, default: [] },   
  profile_picture: { type: String, default: "https://res.cloudinary.com/dzqbzqgjw/image/upload/v1569098981/default_profile_picture_xqjqjy.png" },   
    
});

module.exports = mongoose.model("user", userSchema);


