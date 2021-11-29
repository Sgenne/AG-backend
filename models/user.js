const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    authenticationToken: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.Model("User", userSchema);
