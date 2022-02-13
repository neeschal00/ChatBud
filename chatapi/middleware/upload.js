// const { diskStorage } = require("multer");
const multer = require("multer");

// file uploads

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname.replace("middleware","") +"/Pictures")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+ file.originalname)
    }
})

const filter = function (req, res) {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, true);
    }
}

const uploads = multer({
    storage: storage,
    filefilter:filter,
    limits : {fileSize : 1000000} //filesize 1mb
})
module.exports = uploads;