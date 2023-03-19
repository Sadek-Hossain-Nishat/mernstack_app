const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const filesSchema = new Schema(
  {
    senderemail: {
      type: String,
    },
    receiveremail: {
      type: String,
    },
    filepaths: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Files = mongoose.model("Files", filesSchema);

module.exports = Files;
