import { Router } from "express";

import { registerUser, signIn } from "../controllers/auth";
import {
  validateRegisterUser,
  validateSignIn,
} from "../middleware/requestValidation";

const router = Router();

router.post("/register", validateRegisterUser, registerUser);
router.post("/sign-in", validateSignIn, signIn);

module.exports = router;

export default router;
