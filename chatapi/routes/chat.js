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


router.post('/create', auth.verifyUser, async (req, res, next) => {
  const data = req.body;
  try {
    const chat = new chatModel({
      chatName: data.chatName,
      chatType: data.chatType,
      createdBy: req.userInfo._id
    })
    const chatCreated = await chat.save().catch(e => {res.status(400).json({message: e})});
    const user = await userModel.findByIdAndUpdate(req.userInfo._id, {$push: {chats: chatCreated._id}}, {new: true}).catch(e => {res.status(400).json({message: e})});
  } catch (e) {
    res.json({ message: e });
  }

});

router.post('/add',auth.verifyUser,async(req,res)=>{
    const id = req.userInfo._id;
    const chat_id = req.body.chat_id;
    const user = await userModel.findById(id);
    const chat = await chatModel.findById(chat_id);
    if(user.chats.includes(chat_id)){
        res.status(400).json({message:"Chat Already exists"});
        return;
    }
    try{
        user.chats.push(chat_id);
        await user.save();
        chat.members.push(user);
        await chat.save();
        res.status(200).json({message:"Chat added"});
    }
    catch(e){
        res.status(400).json({message:e});
    }
});


module.exports = router;