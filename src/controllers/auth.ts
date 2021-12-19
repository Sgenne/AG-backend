import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { User } from "../models/user";

const registerUser = async (req: Request, res: Response, next: Function) => {
  const name = req.body.name;
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  if (!(name && email && password)) {
    const error = new Error(
      "Please provide a valid name, email, and password."
    );
    res.status(400);
    return next(error);
  }

  const existingUser = await User.findOne({
    email: email,
  });

  if (existingUser) {
    const error = new Error(
      "A user with that email already exists. Please choose another email."
    );
    res.status(400);
    return next(error);
  }

  if (!process.env.TOKEN_SECRET) {
    const error = new Error("Could not generate access token");
    res.status(500);
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
    res.status(500);
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

const signIn = async (req: Request, res: Response, next: Function) => {
  const email = req.body.email;
  const password = req.body.password;
  let user;

  if (!(email && password)) {
    const error = new Error("Please provide a valid email and password.");
    res.status(400);
    return next(error);
  }

  try {
    user = await User.findOne({
      email: email.toLowerCase(),
    });
  } catch (e) {
    console.trace(e);
    const error = new Error("Something went wrong while signing in.");
    res.status(500);
    return next(error);
  }

  if (!user) {
    console.trace("invalid email");
    const error = new Error("Invalid email or password.");
    res.status(400);
    return next(error);
  }

  const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordIsValid) {
    console.trace("invalid password");
    const error = new Error("Invalid email or password.");
    res.status(400);
    return next(error);
  }

  if (!process.env.TOKEN_SECRET) {
    const error = new Error("Could not generate access token.");
    res.status(500);
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