const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const scrollingImageSchema = new Schema({
  // should have reference to image-model
  imageUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ScrollingImage", scrollingImageSchema);
