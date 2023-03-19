const BlockController = require("../controllers/BlockController");
const express = require("express");

const blockrouter = express.Router();

blockrouter.get("/:useremail/:blockemail/isblock", BlockController.isblock);
blockrouter.post("/addblock", BlockController.insertblock);
blockrouter.post("/:blockId/removeblock", BlockController.removeblock);
module.exports = blockrouter;
