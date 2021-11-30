const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/sign-in", authController.signIn);

module.exports = router;
