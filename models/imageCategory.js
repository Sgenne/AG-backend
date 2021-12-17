const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ImageCategorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  previewImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: true,
  }
});

module.exports = mongoose.model("ImageCategory", ImageCategorySchema);