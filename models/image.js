const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  title: {
    type: String, 
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  }, 
  category: {
    type: String,
    required: true,
  },
  description: String,
}, {timestamps: true})

module.exports = mongoose.model("Image", imageSchema);