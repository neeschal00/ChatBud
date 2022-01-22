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
    })
        
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

router.delete("/delete",auth.verifyUser, async (req,res)=>{
    const id = req.userData._id;
    try{
        const value = await user.findByIdAndDelete(id);
        res.status(200).json({message: `User with ID ${id} deleted sucessfully`})
    }
    catch{
        res.status(400).json({message: "User Couldn't be deleted"})
    }
})

router.post("/buddies/all",auth.verifyUser,async (req,res) => {
    const id = req.userData._id;
    
    const buddies_chat = userModel.findOne({ username: username })
    
})

router.delete("/buddies/remove",auth.verifyUser, async (req,res) => {
    const id = req.userData._id;
    try{
        const value = await user.findByIdAndUpdate(id,);
        res.status(200).json({message: `User with ID ${id} deleted sucessfully`})
    }
    catch{
        res.status(400).json({message: "User Couldn't be deleted"})
    }
})


module.exports = router;