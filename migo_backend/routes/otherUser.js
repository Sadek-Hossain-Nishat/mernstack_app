const express = require("express");
const UserInformationController = require("../controllers/UserInformationController");

const usersrouter = express.Router();

usersrouter.get(
  "/:email/otherusers",
  UserInformationController.OtherUserInformation
);

module.exports = usersrouter;
