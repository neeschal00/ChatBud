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
  
  try{
    const chats = await chatModel.find().populate('chatMembers');
    res.status(200).json(chats);
  } 
  catch(e){
    res.status(400).json({message:e,error:true});
  }
})

router.get('/details/:id',auth.verifyUser,async(req,res)=>{

  try{
    const chat = await chatModel.findById(req.params.id).populate('chatMembers').populate('chatMessages').sort({"chatMessages.createdAt":"desc"});
    res.status(200).json(chat);
  } 
  catch(e){
    res.status(400).json({message:e,error:true});
  }
});
router.get('/all/user',auth.verifyUser,async(req,res)=>{
    try{
        const chats = await userModel.findById(req.userInfo._id).populate('chats').sort({"chats.createdAt":"desc"});
        console.log(chats);
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

//create private chat
router.post('/create/private',auth.verifyUser,async(req,res)=>{
    const data = req.body;
    const userData = req.userInfo;
    const chatExists = await chatModel.findOne({ chatName: "_",
    createdBy:userData._id,chatType:"private",chatMembers: {"$in":[data.buddy]} });
    if (chatExists) return res.status(400).json({message: "Chat Already exists"});
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
    catch(e) {return res.status(400).json({message:e})};
});


router.post('/create/group',auth.verifyUser,async(req,res)=>{
    const data = req.body;
    const userData = req.userInfo;
    const buddies = data.buddies;
    //checking conditionals.
    if(buddies.length<2)return res.status(400).json({message:"Minimum 2 Buddies Required"});

    const chatExists = await chatModel.findOne({ chatName: data.groupName,createdBy:userData._id });
    if (chatExists) return res.status(400).json({message: "Chat Already exists"}); //check id chat exists
    try{
        const chat = new chatModel({
            chatName: data.groupName,
            chatType: "group",
            createdBy: req.userInfo._id,
            chatIsGroup: true,
        })
        const chatCreated = await chat.save().catch(e => {res.status(400).json({message: e})});
        const user = await userModel.findById(req.userInfo._id);
        user.chats.push(chatCreated);
        user.groups.push(chatCreated);
        await user.save();
        chatCreated.chatMembers.push(user);

        // async the missing piece to add buddies in each chat
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

//delete chat with id
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

//leaving a chat group/channel with id and user id
router.post('/:id/leave',auth.verifyUser,async(req,res)=>{
  const data = req.body;
  const id = req.params.id;
  const userData = req.userInfo;
  const chatExists = await chatModel.findById(id);

  //conditionals check with exit early js
  if(!chatExists)return res.status(400).json({message:"Chat Not Found"});

  if (chatExists.chatMembers.includes(userData._id)){
    res.status(400).json({message:"You are not a member of this chat"});
    return;
  }
  if(chatExists.createdBy.toString()===userData._id.toString()){
    res.status(400).json({message:"You are not allowed to leave this chat"});
    return;
  }
  if(chatExists.chatType==="private"){
    res.status(400).json({message:"You are not allowed to leave this chat"});
  }
  try{
    const chat = await chatModel.findById(id);
    const user = await userModel.findById(userData._id);
    user.chats.pull(id);
    await user.save();
    chat.chatMembers.pull(userData._id);
    await chat.save();
    res.status(200).json({message:"User Left"});
  }
  catch(e){
    res.status(400).json({message:e});
  }
})

//creating channel
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

//add buddy to chat group or channel with userid 
router.post('/add/member',auth.verifyUser,async(req,res)=>{
    const data = req.body;
    const userData = req.userInfo;
    const chat = await chatModel.findById(data.chatId);
    if(!chat){
      return res.status(400).json({message:"Chat Not Found"});}
    if(chat.createdBy.toString()!==userData._id.toString()){
      return res.status(400).json({message:"You are not the owner of this chat"});}
    if(chat.chatType==="private"|| chat.chatIsPrivate){
      res.status(400).json({message:"Cannot add members to private chat"});
    }
    if(chat.chatType==="group"|| chat.chatIsChannel ||chat.chatType=== "channel" || chat.chatIsChannel){
        const chatExists = await chatModel.findOne({ chatName: "_",createdBy:userData._id,chatMembers: {"$in":[data.buddy]} });
        if (chatExists){
          return res.status(400).json({message: "Buddy Already is in the chat"});}
      try{
          const buddy = await userModel.findById(data.buddy);
          buddy.chats.push(chat._id);
          buddy.groups.push(chat._id);
          await buddy.save();
          chat.chatMembers.push(buddy._id);
          await chat.save();
          res.status(200).json({message: "Buddy Added"});
      }
      catch(e){
          res.status(400).json({message:e});
      }
}});


router.post('/:chatId/sendMessage',auth.verifyUser,async(req,res)=>{
    const data = req.body;
    const userData = req.userInfo;
    const id = req.params.chatId;
    console.log(id);
    const chat = await chatModel.findById(id);
    if(!chat){
        res.status(400).json({message:"Chat Not Found"});
        return;
    }
    console.log("includes:",chat.chatMembers.includes(userData._id) )
    console.log("chat:",chat.chatMembers )
    userObj = await userModel.findById(userData._id);
    // if(!chat.chatMembers.includes(userData._id)){
    //     res.status(400).json({message:"You are not a member of this chat"});
    //     return;
    // }
    // if(chat.createdBy.toString()!==userData._id.toString()){
    //     res.status(400).json({message:"You are not the owner of this chat"});
    //     return;
    // }
    try{
        const message = new chatMessage({
            chatId: id,
            message: data.message,
            senderId: userData._id,
            isSent: true,
        });
        const messageCreated = await message.save();
        chat.chatMessages.push(messageCreated);
        await chat.save();
        res.status(200).json({message: "Message Sent"});
    }
    catch(e){
        res.status(400).json({message:e});
    }
});

router.delete('/:chatId/delete/:messageId',auth.verifyUser,async(req,res)=>{  
    const data = req.body;
    const userData = req.userInfo;
    const id = req.params.chatId;
    const messageId = req.params.messageId;
    const chat = await chatModel.findById(id);
    if(!chat){
        res.status(400).json({message:"Chat Not Found"});
        return;
    }
    if(chat.createdBy.toString()!==userData._id.toString()){
        res.status(400).json({message:"You are not the owner of this chat"});
        return;
    }
    try{
        const message = await chatMessage.findById(messageId);
        chat.chatMessages.pull(message);
        await chat.save();
        message.delete();
        res.status(200).json({message: "Message Deleted"});
    }
    catch(e){
        res.status(400).json({message:e});
    }
});

module.exports = router;