import { Router } from "express";
import multer from "multer";

import adminController from "../controllers/admin";

const router: Router = Router();

router.post("/new-image-category", adminController.createImageCategory);
router.post(
  "/upload-image",
  multer().single("image"),
  adminController.handleUploadedImage
);

router.post("/new-blog-category", adminController.createBlogCategory);
router.post("/new-blog-post", adminController.createBlogPost);

router.post("/new-scrolling-image", adminController.addScrollingImage);
router.delete("/delete-scrolling-image", adminController.deleteScrollingImage);

export default router;
