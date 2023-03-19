const express = require("express");
const UserInformationController = require("../controllers/UserInformationController");

const loggedrouter = express.Router();

loggedrouter.get(
  "/loggeduser",
  UserInformationController.loggedUserInformation
);

module.exports = loggedrouter;
