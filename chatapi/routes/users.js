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

module.exports = router;