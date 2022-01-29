import { Router } from "express";
import multer from "multer";

import {
  validateAddScrollingImage,
  validateCreateBlogPost,
  validateCreateImageCategory,
  validateDeleteBlogPost,
  validateDeleteImage,
  validateDeleteImageCategory,
  validateDeleteScrollingImage,
  validateReplaceScrollingImages,
  validateSetImageCategoryPreviewImage,
  validateUploadImage,
} from "../middleware/requestValidation";
import {
  createCategory,
  deleteCategory,
  handleUploadedImage,
  deleteImage,
  replaceScrollingImages,
  setImageCategoryPreviewImage,
} from "../controllers/gallery/galleryAdmin";

import { createPost, deletePost } from "../controllers/blog/blogAdmin";

const router: Router = Router();

router.post(
  "/gallery/new-category",
  validateCreateImageCategory,
  createCategory
);
router.post(
  "/gallery/set-category-preview-image",
  validateSetImageCategoryPreviewImage,
  setImageCategoryPreviewImage
);
router.delete(
  "/gallery/delete-category",
  validateDeleteImageCategory,
  deleteCategory
);

router.post(
  "/gallery/upload-image",
  multer().single("image"),
  validateUploadImage,
  handleUploadedImage
);

router.delete("/gallery/delete-image", validateDeleteImage, deleteImage);

router.post(
  "/gallery/replace-scrolling-images",
  validateReplaceScrollingImages,
  replaceScrollingImages
);

router.post("/blog/new-post", validateCreateBlogPost, createPost);
router.delete("/blog/delete-post", validateDeleteBlogPost, deletePost);

export default router;
