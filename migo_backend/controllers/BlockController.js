const Blockuser = require("../models/Blockuser");

const isblock = (req, res, next) => {
  let useremail = req.params.useremail;
  let blockemail = req.params.blockemail;
  Blockuser.findOne({ useremail: useremail, blockemail: blockemail })
    .then((blockuser) => {
      if (
        blockuser.useremail == useremail &&
        blockuser.blockemail == blockemail
      ) {
        res.json({
          message: "yes",
          blockuser,
        });
      } else {
        res.json({
          message: "no",
        });
      }
    })
    .catch((error) => {
      res.json({
        message: "error",
      });
    });
};

const insertblock = (req, res, next) => {
  let useremail = req.body.useremail;
  let blockemail = req.body.blockemail;
  let blockuser = new Blockuser({
    useremail: useremail,
    blockemail: blockemail,
  });

  blockuser
    .save()
    .then((response) => {
      res.json({
        message: "user has been blocked successfully!",
      });
    })
    .catch((error) => {
      res.json({
        error,
      });
    });
};

const removeblock = (req, res, next) => {
  let blockId = req.params.blockId;
  Blockuser.findByIdAndRemove(blockId)
    .then((response) => {
      res.json({
        message: "successfully blocked removed",
      });
    })
    .catch((error) => {
      res.json({
        error,
      });
    });
};

module.exports = { isblock, insertblock, removeblock };
