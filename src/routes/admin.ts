import { Router } from "express";
import multer from "multer";

import {
  createImageCategory,
  handleUploadedImage,
  addScrollingImage,
  deleteScrollingImage,
} from "../controllers/gallery/galleryAdmin";

import {
  createBlogCategory,
  createBlogPost,
} from "../controllers/blog/blogAdmin";

const router: Router = Router();

router.post("/new-image-category", createImageCategory);
router.post("/upload-image", multer().single("image"), handleUploadedImage);

router.post("/new-blog-category", createBlogCategory);
router.post("/new-blog-post", createBlogPost);

router.post("/new-scrolling-image", addScrollingImage);
router.delete("/delete-scrolling-image", deleteScrollingImage);

export default router;
