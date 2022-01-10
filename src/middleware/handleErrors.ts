import { Request, Response, NextFunction } from "express";

export const handleErrors = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let message = error.message;

  if (!res.statusCode) {
    res.status(500);
    message = "Something went wrong.";
  }

  res.json({
    message: message,
  });
};

export const handle404 = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: "Invalid URL.",
  });
};
