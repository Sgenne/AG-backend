import { Router } from "express";
import galleryController from "../controllers/gallery";

const router = Router();

router.get("/images/:category", galleryController.getImagesByCategory);
router.get("/images", galleryController.getImages);

router.get("/categories", galleryController.getCategories);

router.get("/scrolling-images", galleryController.getScrollingImages);

export default router;