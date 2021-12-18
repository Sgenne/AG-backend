import { Request, Response } from "express";

exports.handleErrors = (
  error: Error,
  req: Request,
  res: Response,
  next: Function
) => {
  const message = error.message;
  res.json({
    message: message,
  });
};

exports.handle404 = (req: Request, res: Response, next: Function) => {
  res.status(404).json({
    message: "Invalid URL.",
  });
};
