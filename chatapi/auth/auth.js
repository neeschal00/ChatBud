const jwt = require("jsonwebtoken");

module.exports.verifyUser = function (req, res, next) {
    const tokens = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(tokens, "anysecretkey")
    console.log(data)
    try {
        const token = req.headers.authorization.split(" ")[1];
        const data = jwt.verify(token, "anysecretkey");
        console.log(data.userId);
        user.findOne({ _id: data.userId })
            .then(function (result) {
                console.log(result);
                req.userInfo = result;
                next();
            })
            .catch(function (e) {
                res.json({ error: "Invalid Access" })
            })
    } catch (e) {
        res.json({ error: " Invalid Access" })
    }

}