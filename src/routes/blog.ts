import { Router } from "express";

import { getBlogPosts, getBlogPostsByMonth } from "../controllers/blog/blog";

const router = Router();

router.get("/posts", getBlogPosts);
router.get("/posts/:month", getBlogPostsByMonth);

export default router;

module.exports = router;
