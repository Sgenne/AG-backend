const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.registerUser = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  if (!(name && email && password)) {
    const error = new Error(
      "Please provide a valid name, email, and password."
    );
    error.statusCode = 400;
    return next(error);
  }

  const existingUser = await User.findOne({
    email: email,
  });

  if (existingUser) {
    const error = new Error(
      "A user with that email already exists. Please choose another email."
    );
    error.statusCode = 400;
    return next(error);
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const token = jwt.sign({ email: email }, process.env.TOKEN_SECRET, {
    expiresIn: "24h",
  });

  const user = new User({
    name: name,
    email: email,
    passwordHash: hashedPassword,
    authenticationToken: token,
  });

  try {
    await user.save();
  } catch (e) {
    console.trace(e);
    const error = new Error("Something went wrong while creating user.");
    error.statusCode = 500;
    return next(error);
  }

  return res.status(201).json(
    JSON.stringify({
      message: "User created successfully.",
      user: user,
    })
  );
};
