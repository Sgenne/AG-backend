import { Router } from "express";
import multer from "multer";

import {
  validateCreateImageCategory,
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
  validateUploadImage,
  multer().single("image"),
  handleUploadedImage
);
router.put("/gallery/update-image");
router.delete("/gallery/delete-image", deleteImage);

router.post("/gallery/new-scrolling-image", addScrollingImage);
router.delete("/gallery/delete-scrolling-image", deleteScrollingImage);
router.post("/gallery/replace-scrolling-images", replaceScrollingImages);

router.post("/blog/new-post", createPost);
router.delete("/blog/delete-post", deletePost);

export default router;
