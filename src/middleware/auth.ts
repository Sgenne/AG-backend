import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { IUser } from "../interfaces/user.interface";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let accessToken = req.header("Authorization");
  const userId = req.header("UserId");
  let user: IUser | null;

  if (!(userId && accessToken)) {
    return res.status(401).json({
      message: `Please provide a valid user-id and access token. 
    Provide the user id under header "userId", and the access-token under header "Authorization" as "Bearer: <token>".`,
    });
  }

  accessToken = accessToken.split(" ")[1];

  try {
    user = await User.findById(userId);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "An error occured while finding the user." });
  }

  if (!user) {
    return res
      .status(404)
      .json({ message: "No user with the provided user-id was found." });
  }

  if (!process.env.TOKEN_SECRET) {
    return res.status(500).json({ message: "Could not verify access-token." });
  }

  jwt.verify(accessToken, process.env.TOKEN_SECRET, (err) => {
    if (err) {
      return res.status(400).json({ message: "Invalid access-token." });
    }

    next();
  });
};
