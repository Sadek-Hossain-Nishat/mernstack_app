const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (res, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var uploadfiles = multer({
  storage: storage,
});
module.exports = uploadfiles;
