import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  return res.status(400).json({ message: errors.array()[0].msg });
};

export const validateCreateImageCategory = [
  body("categoryTitle")
    .isLength({ min: 3, max: 16 })
    .withMessage("No category title was provided."),
  handleValidationResult,
];

export const validateDeleteImageCategory = [
  body("categoryId")
    .exists()
    .withMessage("No category-id of the category to delete was provided."),
  handleValidationResult,
];

export const validateSetImageCategoryPreviewImage = [
  body("previewImageId")
    .exists()
    .withMessage("No preview image-id was provided."),
  body("categoryId").exists().withMessage("No category-id was provided."),
  handleValidationResult,
];

export const validateUploadImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return res.status(500).json({
      message: "Something went wrong. The image could not be uploaded.",
    });
  }

  if (!req.body.category) {
    return res.status(400).json({ message: "No category was provided" });
  }

  if (
    !(req.file.mimetype === "image/jpg" || req.file.mimetype === "image/jpeg")
  ) {
    return res.status(400).json({ message: "Invalid image format." });
  }

  next();
};

export const validateDeleteImage = [
  body("imageId").exists().withMessage("No image-id was provided."),
  handleValidationResult,
];

export const validateAddScrollingImage = [
  body("scrollingImageId")
    .exists()
    .withMessage("Please provide the id of image to add as a scrolling image."),
  handleValidationResult,
];

export const validateDeleteScrollingImage = [
  body("scrollingImageId")
    .exists()
    .withMessage("Please provide the id of the scrolling image to delete."),
  handleValidationResult,
];

export const validateReplaceScrollingImages = [
  body("newScrollingImageIds")
    .exists()
    .withMessage("The ids of the new scrolling images were not provided."),
  handleValidationResult,
];

export const validateCreateBlogPost = [
  body("title").exists().withMessage("The title of the post was not provided."),
  body("content")
    .exists()
    .withMessage("The content of the post was not provided."),
  handleValidationResult,
];

export const validateDeleteBlogPost = [
  body("postId")
    .exists()
    .withMessage("The id of the blog post to delete was not provided."),
  handleValidationResult,
];

export const validateRegisterUser = [
  body("name").exists().withMessage("No name was provided."),
  body("password").exists().withMessage("No password was provided."),
  body("email")
    .exists()
    .withMessage("No email was provided.")
    .isEmail()
    .withMessage("The provided email was invalid."),
  handleValidationResult,
];

export const validateSignIn = [
  body("email").exists().withMessage("No email was provided."),
  body("password").exists().withMessage("No password was provided."),
  handleValidationResult,
];
