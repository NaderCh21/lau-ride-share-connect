const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imgSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Img", imgSchema);
