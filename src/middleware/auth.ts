import { Response, Request, NextFunction } from "express";

import * as userServices from "../services/user.service";
import { UNAUTHORIZED } from "../services";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let accessToken = req.header("Authorization");

  if (!accessToken) {
    return res.status(401).json({
      message: `Please provide a valid access token under header "Authorization" as "Bearer: <token>".`,
    });
  }

  if (!process.env.TOKEN_SECRET) {
    return res
      .status(500)
      .json({ message: "Could not verify the access token" });
  }

  accessToken = accessToken.split(" ")[1];

  const verificationResult = await userServices.verifyAccessToken(
    accessToken,
    process.env.TOKEN_SECRET
  );

  if (!verificationResult.user) {
    if (verificationResult.message === UNAUTHORIZED) {
      return res.status(401).json({ message: "Invalid access token." });
    }
    return res
      .status(500)
      .json({ message: "Could not verify the access token." });
  }
  next();
};
