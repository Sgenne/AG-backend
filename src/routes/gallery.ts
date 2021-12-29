import { Router } from "express";
import {
  getImagesByCategory,
  getImages,
  getCategories,
  getScrollingImages,
  getImageById,
} from "../controllers/gallery/gallery";

const router = Router();

router.get("/images/:category", getImagesByCategory);
router.get("/images", getImages);
router.get("/image/:imageId", getImageById);

router.get("/categories", getCategories);

router.get("/scrolling-images", getScrollingImages);

export default router;
