import { Router } from "express";
import multer from "multer";

import {
  createImageCategory,
  handleUploadedImage,
  addScrollingImage,
  deleteScrollingImage,
} from "../controllers/gallery/galleryAdmin";

import { createPost, deletePost } from "../controllers/blog/blogAdmin";

const router: Router = Router();

router.post("/gallery/new-image-category", createImageCategory);
router.post(
  "/gallery/upload-image",
  multer().single("image"),
  handleUploadedImage
);
router.post("/gallery/new-scrolling-image", addScrollingImage);
router.delete("/gallery/delete-scrolling-image", deleteScrollingImage);

router.post("/blog/new-post", createPost);
router.delete("/blog/delete-post", deletePost);

export default router;
