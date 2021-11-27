const express = require("express");

const blogController = require("../controllers/blog");

const router = express.Router();

router.get("/post/:id", blogController.getBlogPost);
router.get("/category/:category", blogController.getBlogPostsByCategory);
router.get("/categories", blogController.getCategories);
router.get("", blogController.getBlogPosts);

module.exports = router;