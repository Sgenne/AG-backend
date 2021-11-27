const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogCategorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("BlogCategory", blogCategorySchema);
