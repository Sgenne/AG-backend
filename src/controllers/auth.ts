import { Response, Request } from "express";

import {
  RESOURCE_ALREADY_EXISTS,
  RESOURCE_NOT_FOUND,
  UNAUTHORIZED,
} from "../services";
import * as userServices from "../services/user.service";

export const registerUser = async (req: Request, res: Response) => {
  const name = req.body.name;
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  if (!process.env.TOKEN_SECRET) {
    return res.status(500).json({ message: "Could not register user." });
  }

  const { user, accessToken, message } = await userServices.registerUser(
    name,
    email,
    password,
    process.env.TOKEN_SECRET
  );

  if (!(user && accessToken)) {
    if (message === RESOURCE_ALREADY_EXISTS) {
      return res
        .status(403)
        .json({ message: "A user with that email already exists." });
    }
    return res.status(500).json({ message: "Could not register user." });
  }

  return res.status(201).json({
    message: "User created successfully.",
    accessToken: accessToken,
  });
};

export const signIn = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!(email && password)) {
    res
      .status(400)
      .json({ message: "Please provide a valid email and password." });
  }

  if (!process.env.TOKEN_SECRET) {
    return res.status(500).json({ message: "Could not sign in." });
  }

  const { user, accessToken, message } = await userServices.signIn(
    email,
    password,
    process.env.TOKEN_SECRET
  );

  if (!(user && accessToken)) {
    if (message === RESOURCE_NOT_FOUND) {
      return res
        .status(404)
        .json({ message: "No user with the given email was found." });
    }
    if (message === UNAUTHORIZED) {
      return res
        .status(401)
        .json({ message: "The given password was not correct." });
    }
    return res.status(500).json({ message: "Could not sign the user in." });
  }

  return res.status(200).json({
    message: "Signed in successfully.",
    user: {
      name: user.name,
      email: user.email,
    },
    accessToken: accessToken,
  });
};
