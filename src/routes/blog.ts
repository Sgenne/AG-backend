import { Router } from "express";

import {
  getBlogPostById,
  getBlogPosts,
  getBlogPostsByMonth,
} from "../controllers/blog/blog";

const router = Router();

router.get("/posts", getBlogPosts);
router.get("/posts/:year/:month", getBlogPostsByMonth);
router.get("/:postId", getBlogPostById);

export default router;

module.exports = router;
