const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const userModel = require('../models/userModel');
const chatModel = require('../models/chatModel');
const chatMember = require('../models/chatMembers');
const chatMessage = require('../models/chatMessages');


router.get('/', auth.verifyUser,async(req,res)=>{
    try{
        const users = await userModel.findById(req.userInfo._id).populate('chats');
        res.json(users);
    }catch(e){
        res.json({message:e});
    } 
});

router.get('/all',async(req,res)=>{
  // try{
    const chats = await chatModel.find().populate('chatMembers');
    res.status(200).json(chats);
  // } 
  // catch(e){
  //   res.status(400).json({message:e,error:true});
  // }
})

router.get('/alls',auth.verifyUser,async(req,res)=>{
    try{
        const chats = await userModel.findById(req.userInfo._id).populate('chats');
        res.status(200).json(chats);
    }catch(e){
        res.status(400).json({message:e,error:true});
    }
});

router.post('/create', auth.verifyUser, async (req, res, next) => {
  const data = req.body;
  const userData = req.userInfo;
  const chatExists = await chatModel.findOne({ chatName: data.chatName,createdBy:userData._id });
  console.log(chatExists);
  if (chatExists) {
    res.status(400).json({ message: 'Chat name already exists', success: false });
    return;
  }
  try {
    const chat = new chatModel({
      chatName: data.chatName,
      chatType: data.chatType,
      createdBy: req.userInfo._id
    })
    const chatCreated = await chat.save().catch(e => {res.status(400).json({message: e})});
    const user = await userModel.findById(req.userInfo._id);
    user.chats.push(chatCreated._id);
    await user.save();
    res.status(200).json({message: "Chat Created"});

  } catch (e) {
    res.json({ message: e });
  }
});

router.post('/create/private',auth.verifyUser,async(req,res)=>{
    const data = req.body;
    const userData = req.userInfo;
    const chatExists = await chatModel.findOne({ chatName: "_",createdBy:userData._id,chatType:"private",chatMembers: {"$in":[data.buddy]} });
    console.log(chatExists);
    if (chatExists){
        res.status(400).json({message: "Chat Already exists"});
        return;
    }
    try{
        const chat = new chatModel({
            chatName: "_",
            chatType: "private",
            createdBy: req.userInfo._id,
            chatIsPrivate: true,
        })
        const chatCreated = await chat.save().catch(e => {res.status(400).json({message: e})});
        const user = await userModel.findById(req.userInfo._id);
        user.chats.push(chatCreated._id);
        await user.save();
        const buddy = await userModel.findById(data.buddy);
        buddy.chats.push(chatCreated._id);
        await buddy.save();
        chatCreated.chatMembers.push(userData._id);
        chatCreated.chatMembers.push(data.buddy);
        await chatCreated.save();
        res.status(200).json({message: "Chat Created"});
    }
    catch(e){
        res.json({message:e});
    }

});

router.post('/create/group',auth.verifyUser,async(req,res)=>{
    const data = req.body;
    const userData = req.userInfo;
    const buddies = data.buddies;
    if(buddies.length<2){
        res.status(400).json({message:"Minimum 2 Buddies Required"});
        return;
    }
    console.log(buddies);
    const chatExists = await chatModel.findOne({ chatName: data.groupName,createdBy:userData._id });
    // console.log(chatExists);
    if (chatExists){
        res.status(400).json({message: "Chat Already exists"});
        return;
    }
    try{
      console.log("babu babu");
        const chat = new chatModel({
            chatName: data.groupName,
            chatType: "group",
            createdBy: req.userInfo._id,
            chatIsGroup: true,
        })
        const chatCreated = await chat.save().catch(e => {res.status(400).json({message: e})});
        const user = await userModel.findById(req.userInfo._id);
        console.log("baby");
        user.chats.push(chatCreated);
        user.groups.push(chatCreated);
        await user.save();
        chatCreated.chatMembers.push(user);
        console.log( buddies);
        buddies.forEach(async(buddy)=>{
            const buddyUser = await userModel.findById(buddy);
            buddyUser.chats.push(chatCreated);
            buddyUser.groups.push(chatCreated);
            await buddyUser.save();
            chatCreated.chatMembers.push(buddyUser);
        });
        
        await chatCreated.save();
        res.status(200).json({message: "Chat Created"});
    }
    catch(e){
        res.json({message:e});
    }

})

router.delete('/delete/:id',auth.verifyUser,async(req,res)=>{
  const id = req.params.id;
  const userData = req.userInfo;
  const chatExists = await chatModel.findById(id);
  if(!chatExists){
    res.status(400).json({message:"Chat Not Found"});
    return;
  }
  if(chatExists.createdBy.toString()!==userData._id.toString()){
    res.status(400).json({message:"You are not allowed to delete this chat"});
    return;
  }
  try{
    const chat = await chatModel.findByIdAndDelete(id);
    const user = await userModel.findById(userData._id);
    user.chats.pull(id);
    await user.save();
    res.status(200).json({message:"Chat Deleted"});
  }catch(e){
    res.status(400).json({message:e});
  }
})

router.post('/create/channel',auth.verifyUser, async(req, res, next) => {
  const data = req.body;
  const userData = req.userInfo;
  const chatExists = await chatModel.findOne({ chatName: data.channelName,createdBy:userData._id,chatType:"channel"});
  console.log(chatExists);
  if (chatExists) {
    res.status(400).json({ message: 'Channel name already exists', success: false });
    return;
  }
  try {
    const chat = new chatModel({
      chatName: data.channelName,
      chatType: "channel",
      createdBy: req.userInfo._id,
      chatIsChannel: true,
    })
    const chatCreated = await chat.save().catch(e => {res.status(400).json({message: e})});
    const user = await userModel.findById(req.userInfo._id);
    user.chats.push(chatCreated._id);
    user.channels.push(chatCreated._id);
    await user.save();
    res.status(200).json({message: "Channel Created"});

  } catch (e) {
    res.json({ message: e });
  }
});


router.post('/add/member',auth.verifyUser,async(req,res)=>{
    const data = req.body;
    const userData = req.userInfo;
    const chat = await chatModel.findById(data.chatId);
    if(!chat){
        res.status(400).json({message:"Chat Not Found"});
        return;
    }
    if(chat.createdBy.toString()!==userData._id.toString()){
        res.status(400).json({message:"You are not the owner of this chat"});
        return;
    }
    if(chat.chatType==="private"|| chat.chatIsPrivate){
      res.status(400).json({message:"Cannot add members to private chat"});
    }
    if(chat.chatType==="group"|| chat.chatIsChannel ||chat.chatType=== "channel" || chat.chatIsChannel){
        const chatExists = await chatModel.findOne({ chatName: "_",createdBy:userData._id,chatMembers: {"$in":[data.buddy]} });
        console.log(chatExists);
        if (chatExists){
            res.status(400).json({message: "Buddy Already is in the chat"});
            return;
        }
      try{
          const buddy = await userModel.findById(data.buddy);
          buddy.chats.push(chat._id);
          buddy.groups.push(chat._id);
          await buddy.save();
          chat.chatMembers.push(data.buddy);
          await chat.save();
          res.status(200).json({message: "Buddy Added"});
      }
      catch(e){
          res.status(400).json({message:e});
      }
}});

module.exports = router;