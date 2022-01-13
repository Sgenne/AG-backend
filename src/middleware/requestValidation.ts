import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

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

export const validateUploadImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    const error = new Error(
      "Something went wrong. The image could not be uploaded."
    );
    res.status(500);
    return next(error);
  }

  if (!req.body.category) {
    const error = new Error("No category was provided");
    res.status(400);
    return next(error);
  }

  if (
    !(req.file.mimetype === "image/jpg" || req.file.mimetype === "image/jpeg")
  ) {
    const error = new Error("Invalid image format.");
    res.status(400);
    return next(error);
  }

  next();
};

export const validateDeleteImage = [
  body("imageId").exists().withMessage("No image-id was provided."),
  _handleValidationResult,
];

export const validateAddScrollingImage = [
  body("scrollingImageId")
    .exists()
    .withMessage("Please provide the id of image to add as a scrolling image."),
  _handleValidationResult,
];

export const validateDeleteScrollingImage = [
  body("scrollingImageId")
    .exists()
    .withMessage("Please provide the id of the scrolling image to delete."),
  _handleValidationResult,
];

export const validateReplaceScrollingImages = [
  body("newScrollingImageIds")
    .exists()
    .withMessage("The ids of the new scrolling images were not provided."),
  _handleValidationResult,
];

export const validateCreateBlogPost = [
  body("title").exists().withMessage("The title of the post was not provided."),
  body("content")
    .exists()
    .withMessage("The content of the post was not provided."),
  _handleValidationResult,
];

export const validateDeleteBlogPost = [
  body("postId")
    .exists()
    .withMessage("The id of the blog post to delete was not provided."),
  _handleValidationResult,
];
