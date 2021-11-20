const express = require("express");
const { getImages, getCategories } = require("../controllers/gallery");

const router = express.Router();

router.get("/images", getImages);

router.get("/categories", getCategories);

module.exports = router;