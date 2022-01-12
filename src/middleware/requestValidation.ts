import path from "path";

import { NextFunction, Request, Response } from "express";
import { body, CustomValidator, validationResult } from "express-validator";

const VALID_IMAGE_EXTENSIONS = ["jpg", "jpeg"];

/*
=====================
Custom validators
=====================
*/

// Validates that the given value is an image of
// an accepted format.
const _isImage: CustomValidator = (file) => {
  if (file instanceof File) {
    const extension = path.extname(file.name);
    if (VALID_IMAGE_EXTENSIONS.includes(extension)) {
      return true;
    }
  }
  return false;
};

const _handleValidationResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  // If an error occured, then return error message
  // with status 400.
  const error = new Error(errors.array()[0].msg);
  res.status(400);
  next(error);
};

export const validateCreateImageCategory = [
  body("categoryTitle")
    .isLength({ min: 3, max: 16 })
    .withMessage("No category title was provided."),
  _handleValidationResult,
];

export const validateUploadImage = [
  body("image").custom(_isImage),
  _handleValidationResult,
];
