import { Router } from "express";

import authController from "../controllers/auth";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/sign-in", authController.signIn);

module.exports = router;

export default router;
