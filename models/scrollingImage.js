const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const scrollingImageSchema = new Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: true,
  },
});

module.exports = mongoose.model("ScrollingImage", scrollingImageSchema);
