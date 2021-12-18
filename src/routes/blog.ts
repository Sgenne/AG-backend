import { Router } from "express";

import { getBlogPost, getBlogPostsByCategory, getCategories, getBlogPosts } from "../controllers/blog";

const router = Router();

router.get("/post/:id", getBlogPost);
router.get("/category/:category", getBlogPostsByCategory);
router.get("/categories", getCategories);
router.get("", getBlogPosts);

export default router;

module.exports = router;
