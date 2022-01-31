const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

module.exports.verifyUser = (req, res, next) => {
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
        const userData = userModel.findOne({ _id: data.userId })
        // console.log(userData);
        try{
            req.userInfo = userData;
            next();
        }
        catch (e) {
            res.status(403).json({ error: e })
        }
            
    } catch (e) {
        res.status(400).json({ error: e })
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
