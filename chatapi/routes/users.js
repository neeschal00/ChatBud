const express = require("express");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const auth = require("../auth/auth")
const router = new express.Router();

router.get("/all", async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (e) {
        res.json({ message: e });
    }
});


router.post("/register", async (req, res) => {
    const {username,email,password} = await req.body;
    const user = await userModel.findOne({ username: username });
    if(user != null){
        res.status(400).json({"message":"Username already exists"});
        return;
    }
    
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt)
    console.log(hashedPassword);
    const userData = new userModel({
        username: username,
        password: hashedPassword,
        email: email
    });
    userData.save().then( (result) => {
        res.status(201).json({"message":"User created successfully"});
    }).catch( (err) => {
        res.status(400).json({"message":err});
    });
        
});


router.post("/login", async (req, res) => {
    const {username,password} = req.body;
    console.log(username,password);
    const userData = await userModel.findOne({ username: username });
    console.log(userData);
    if (userData === null) {
        return res.status(401).json({ message: "invalid" })
    }
    const isMatch = await bcryptjs.compare(password, userData.password);
    
    
    if (isMatch === false) {
        return res.status(401).json({ message: "Password Incorrect" })
    }

    // ticket generate
    const token = jwt.sign({ userId: userData._id }, "anysecretkey");
    await userModel.findByIdAndUpdate(userData._id, { isActive: true });

    res.status(200).json({ token: token, message: "You have been logged in sucessfully" });
})


//to view own profile
router.get("/profile",auth.verifyUser,async(req,res)=>{
    try{
        const user = await userModel.findById(req.userInfo._id);
        res.status(200).json(user);
    }catch(e){
        res.status(400).json({message:e});
    }
});

//to view other profile
router.get("/profile/:id",auth.verifyUser,async(req,res)=>{
    try{
        const user = await userModel.findById(req.params.id);
        res.status(200).json(user);
    }catch(e){
        res.status(400).json({message:e});
    }
});

//delete users own account
router.delete("/delete",auth.verifyUser, async (req,res)=>{
    const id = req.userInfo._id;
    console.log(req.userInfo);
    try{
        const value = await userModel.findByIdAndDelete(id);
        res.status(200).json({message: `User with ID ${id} deleted sucessfully`})
    }
    catch{
        res.status(400).json({message: "User Couldn't be deleted"})
    }
})

//for admin to delete with user id 
router.delete('/delete/:id', auth.adminAuth, async(req,res) => {
    const id = req.params.id;
    try{
        const value = await userModel.findByIdAndDelete(id);
        res.status(200).json({message: `User with ID ${id} deleted sucessfully`})
    }
    catch{
        res.status(400).json({message: "User Couldn't be deleted"})
    }
})



//to get the list of buddies of a user
router.get("/buddies/all",auth.verifyUser,async (req,res) => {
    const id = req.userInfo._id;
    
    const buddies_chat = await userModel.findOne({_id:id},{username:1,buddies:1}).populate("buddies");
    console.log(buddies_chat);
    if (buddies_chat === null) {
        return res.status(401).json({ message: "invalid" })
    } else{
        res.status(200).json(buddies_chat);
    }
    
})


//to add a buddy to a user
router.patch('/buddies/add/:id',auth.verifyUser, async(req,res) => {
    const id =  req.userInfo._id;
    // console.log(req.userInfo);
    console.log(id);
    const userData = await req.userInfo
    const buddy_id = await req.params.id;
    const buddy = await userModel.findById(buddy_id);
    // const body = req.body;
    // console.log(body);
    console.log(userData.buddies)
    console.log("buddy id",buddy_id);
    
    if (userData.buddies.includes(buddy_id)) {
        res.status(400).json({message: "Buddy Already exists"});
        return;
    }
    
    try{
        const user = await userModel.findById(id);
        console.log(user);
        user.buddies.push(buddy);
        await user.save();
        const buddyv = await userModel.findById(buddy_id);
        buddyv.buddies.push(user);
        await buddyv.save();
        res.status(200).json({message: "Buddy added in each other's list"})
    }
    catch (err){
        res.status(400).json({message: err})
    }
});

//to delete a buddy from a user
router.delete("/buddies/remove",auth.verifyUser, async (req,res) => {
    const id = req.userData._id;
    try{
        const value = await user.findByIdAndUpdate(id,{ $pull: { buddies: req.params.comment_id }});
        res.status(200).json({message: `User with ID ${id} deleted sucessfully`})
    }
    catch{
        res.status(400).json({message: "User Couldn't be deleted"})
    }
})


module.exports = router;