const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const userModel = require('../models/userModel');
const {chatModel, chatMessage, chatMembers} = require('../models/chatModel');


router.get('/', auth.verifyUser,async(req,res)=>{
    try{
        const users = await userModel.findById(req.userInfo._id).populate('chats');
        res.json(users);
    }catch(e){
        res.json({message:e});
    } 
});

router.post('/create', auth.verifyUser, async (req, res, next) => {
  const data = req.body;
  try {
    const chat = new chatModel({
      chatName: data.chatName,
      createdBy: req.userInfo._id
    })
    const chatCreated = await chat.save().catch(e => {res.status(400).json({message: e})});
    const user = await userModel.findByIdAndUpdate(req.userInfo._id, {$push: {chats: chatCreated._id}}, {new: true}).catch(e => {res.status(400).json({message: e})});
  } catch (e) {
    res.json({ message: e });
  }

});

module.exports = router;