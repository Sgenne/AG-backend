import { Router } from "express";

import blogController from "../controllers/blog";

const router = Router();

router.get("/post/:id", blogController.getBlogPost);
router.get("/category/:category", blogController.getBlogPostsByCategory);
router.get("/categories", blogController.getCategories);
router.get("", blogController.getBlogPosts);

export default router;

module.exports = router;
