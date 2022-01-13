import { Router } from "express";
import multer from "multer";

import {
  validateAddScrollingImage,
  validateCreateBlogPost,
  validateCreateImageCategory,
  validateDeleteBlogPost,
  validateDeleteImage,
  validateDeleteScrollingImage,
  validateReplaceScrollingImages,
  validateUploadImage,
} from "../middleware/requestValidation";
import {
  createImageCategory,
  handleUploadedImage,
  addScrollingImage,
  deleteScrollingImage,
  deleteImage,
  replaceScrollingImages,
} from "../controllers/gallery/galleryAdmin";

import { createPost, deletePost } from "../controllers/blog/blogAdmin";

const router: Router = Router();

router.post(
  "/gallery/new-image-category",
  validateCreateImageCategory,
  createImageCategory
);
router.post(
  "/gallery/upload-image",
  multer().single("image"),
  validateUploadImage,
  handleUploadedImage
);
router.delete("/gallery/delete-image", validateDeleteImage, deleteImage);

router.post(
  "/gallery/new-scrolling-image",
  validateAddScrollingImage,
  addScrollingImage
);
router.delete(
  "/gallery/delete-scrolling-image",
  validateDeleteScrollingImage,
  deleteScrollingImage
);
router.post(
  "/gallery/replace-scrolling-images",
  validateReplaceScrollingImages,
  replaceScrollingImages
);

router.post("/blog/new-post", validateCreateBlogPost, createPost);
router.delete("/blog/delete-post", validateDeleteBlogPost, deletePost);

export default router;
