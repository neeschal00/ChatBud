// const { diskStorage } = require("multer");
const multer = require("multer");

// file uploads

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../Pictures')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+ file.originalname)
    }
})

const filter = function (req, res) {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        // correct format
        cb(null, true);
    }
    else {
        cb(null, true);
    }
}

const uploads = multer({
    storage: storage,
    filefilter:filter
})
module.exports = uploads;