import { Request, Response } from "express";

export const handleErrors = (
  error: Error,
  req: Request,
  res: Response,
  next: Function
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

export const handle404 = (req: Request, res: Response, next: Function) => {
  res.status(404).json({
    message: "Invalid URL.",
  });
};
