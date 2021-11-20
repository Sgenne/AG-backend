const express = require("express");
const {
  getImages,
  getCategories,
  getImagesByCategory,
} = require("../controllers/gallery");

const router = express.Router();

router.get("/images/:category", getImagesByCategory);
router.get("/images", getImages);

router.get("/categories", getCategories);

module.exports = router;
