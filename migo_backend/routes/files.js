const express = require("express");
const uploadfiles = require("../middleware/uploadfiles");
const UploadandDownloadController = require("../controllers/UploadandDownloadController");
const filesrouter = express.Router();

filesrouter.post(
  "/:senderemail/upload/:receiveremail",
  uploadfiles.array("filepaths[]"),
  UploadandDownloadController.upload
);
filesrouter.get(
  "/:senderemail/download/:receiveremail",
  UploadandDownloadController.download
);
filesrouter.post(
  "/:senderemail/removefiles/:receiveremail",
  UploadandDownloadController.removefiles
);

module.exports = filesrouter;
