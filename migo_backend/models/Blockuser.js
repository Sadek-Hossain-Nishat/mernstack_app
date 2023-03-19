const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blockuserSchema = new Schema(
  {
    useremail: {
      type: String,
    },
    blockemail: {
      type: String,
    },
  },
  { timestamps: true }
);

const Blockuser = mongoose.model("Blockuser", blockuserSchema);

module.exports = Blockuser;
