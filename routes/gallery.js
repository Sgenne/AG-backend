const express = require("express");
const galleryController = require("../controllers/gallery");

const router = express.Router();

router.get("/images/:category", galleryController.getImagesByCategory);
router.get("/images", galleryController.getImages);

router.get("/categories", galleryController.getCategories);

router.get("/scrolling-images", galleryController.getScrollingImages);

module.exports = router;
