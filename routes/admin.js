const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

router.post("/new-image-category", adminController.createImageCategory);

router.post("/new-blog-category", adminController.createBlogCategory);
router.post("/new-blog-post", adminController.createBlogPost);

router.post("/new-scrolling-image", adminController.addScrollingImage);
router.delete("/delete-scrolling-image", adminController.deleteScrollingImage);

module.exports = router;
