const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

module.exports.verifyUser = async (req, res, next) => {
    // const tokens = await req.headers.authorization.split(" ")[1];
    // console.log(tokens);
    // const data = jwt.verify(tokens, "anysecretkey")
    // console.log(data)
    try {
        const token =  req.headers.authorization.split(" ")[1];
        console.log(token);
        const data = jwt.verify(token, "anysecretkey");
        console.log(data.userId);
        console.log("user auth hit")
        const userData = await userModel.findOne({ _id: data.userId })
        // console.log(userData);
        if (!userData) {
            return res.status(401).json({ message: "Not authorized" })
        }
        req.userInfo = userData;
        next();
            
    } catch (e) {
        res.status(400).json({ error: e })
    }

}


exports.userSocketAuth = async (socket, next) => {
  const token = await socket.handshake.query.token;
  if(token){
    
    const data = jwt.verify(token, "anysecretkey",(err, decodedToken) => {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decodedToken;
        console.log(decodedToken);
        // socket.userId = decodedToken.userId
        next();
      })
  }
  else{
    next(new Error('Authentication error'));
  }
  
  
}


exports.adminAuth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const data = jwt.verify(token, "anysecretkey");
  if (token) {
    jwt.verify(token, "anysecretkey",(err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" })
      } else {
          const userData = user.findOne({ _id: decodedToken.userId })
        if (!userData.isAdmin) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          next()
        }
      }
    })
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" })
  }
}
