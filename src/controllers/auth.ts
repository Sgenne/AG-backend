import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { User } from "../models/user";

const registerUser = async (req: Request, res: Response) => {
  const name = req.body.name;
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  if (!(name && email && password)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid name, email, and password." });
  }

  const existingUser = await User.findOne({
    email: email,
  });

  if (existingUser) {
    return res.status(400).json({
      message:
        "A user with that email already exists. Please choose another email.",
    });
  }

  if (!process.env.TOKEN_SECRET) {
    return res.status(500).json({ message: "Could not generate access token" });
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
    return res
      .status(500)
      .json({ message: "Something went wrong while creating user." });
  }

  const token = _generateToken(user, process.env.TOKEN_SECRET);

  return res.status(201).json({
    message: "User created successfully.",
    user: user,
    accessToken: token,
  });
};

const signIn = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  let user;

  if (!(email && password)) {
    res
      .status(400)
      .json({ message: "Please provide a valid email and password." });
  }

  try {
    user = await User.findOne({
      email: email.toLowerCase(),
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Something went wrong while signing in." });
  }

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordIsValid) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  if (!process.env.TOKEN_SECRET) {
    return res
      .status(500)
      .json({ message: "Could not generate access token." });
  }

  // access-token used for jwt-authentication
  const token = _generateToken(user, process.env.TOKEN_SECRET);

  // returned user information
  const exposedUserObject = {
    email: user.email,
    accessToken: token,
    userId: user._id,
  };

  return res.status(200).json({
    message: "Signed in successfully.",
    user: exposedUserObject,
  });
};

const _generateToken = (user: { email: string }, secret: string) => {
  const token = jwt.sign({ email: user.email }, secret, {
    expiresIn: "1h",
  });
  return token;
};

export default {
  registerUser,
  signIn,
};
