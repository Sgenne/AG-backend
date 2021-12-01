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
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    name: name,
    email: email,
    passwordHash: passwordHash,
  });

  try {
    await user.save();
  } catch (e) {
    console.trace(e);
    const error = new Error("Something went wrong while creating user.");
    error.statusCode = 500;
    return next(error);
  }

  const token = _generateToken(user, process.env.TOKEN_SECRET);

  return res.status(201).json(
    JSON.stringify({
      message: "User created successfully.",
      user: user,
      "access-token": token,
    })
  );
};

exports.signIn = async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  let user;

  if (!(email && password)) {
    const error = new Error("Please provide a valid email and password.");
    error.statusCode = 400;
    return next(error);
  }

  try {
    user = await User.findOne({
      email: email,
    });
  } catch (e) {
    console.trace(e);
    const error = new Error("Something went wrong while signing in.");
    error.statusCode = 500;
    return next(error);
  }

  if (!user) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 400;
    return next(error);
  }

  const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordIsValid) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 400;
    return next(error);
  }

  const token = _generateToken(user, process.env.TOKEN_SECRET);

  return res.status(200).json(
    JSON.stringify({
      message: "Signed in successfully.",
      user: user,
      "access-token": token,
    })
  );
};

const _generateToken = (user, secret) => {
  const token = jwt.sign({ email: user.email }, secret, {
    expiresIn: "1h",
  });
  return token;
};
