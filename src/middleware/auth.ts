import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { User, IUser } from "../models/user";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let accessToken = req.header("Authorization");
  const userId = req.header("UserId");
  let user: IUser | null;

  if (!(userId && accessToken)) {
    const error = new Error(
      `Please provide a valid user-id and access token. 
      Provide the user id under header "userId", and the access-token under header "Authorization" as "Bearer: <token>".`
    );
    res.status(401);
    return next(error);
  }

  accessToken = accessToken.split(" ")[1];

  try {
    user = await User.findById(userId);
  } catch (e) {
    const error = new Error("An error occured while finding the user.");
    res.status(500);
    return next(error);
  }

  if (!user) {
    const error = new Error("No user with the provided user-id was found.");
    res.status(404);
    return next(error);
  }

  if (!process.env.TOKEN_SECRET) {
    const error = new Error("Could not verify access-token.");
    res.status(500);
    return next(error);
  }

  jwt.verify(accessToken, process.env.TOKEN_SECRET, (err) => {
    if (err) {
      const error = new Error("Invalid access-token.");
      res.status(400);
      return next(error);
    }

    next();
  });
};
