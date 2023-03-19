const Files = require("../models/Files");
const upload = (req, res, next) => {
  let filesobject = new Files({
    senderemail: req.params.senderemail,
    receiveremail: req.params.receiveremail,
  });

  if (req.files) {
    let path = "";
    req.files.forEach(function (files, index, arr) {
      path = path + files.path + ",";
    });
    path = path.substring(0, path.lastIndexOf(","));
    filesobject.filepaths = path;
  }

  filesobject
    .save()
    .then((response) => {
      res.json({
        message: "Files uploaded successfully!",
      });
    })
    .catch((error) => {
      res.json({
        message: "An error occured!",
      });
    });
};

const download = (req, res, next) => {};

const removefiles = (req, res, next) => {};

module.exports = { upload, download, removefiles };
