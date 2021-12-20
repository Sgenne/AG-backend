import { Router } from "express";
import {
  getImagesByCategory,
  getImages,
  getCategories,
  getScrollingImages,
} from "../controllers/gallery/gallery";

const router = Router();

router.get("/images/:category", getImagesByCategory);
router.get("/images", getImages);

router.get("/categories", getCategories);

router.get("/scrolling-images", getScrollingImages);

export default router;
