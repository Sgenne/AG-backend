const express = require("express");

const {createCategory} = require("../controllers/admin");

const router = express.Router();

router.post("/new-category", createCategory);

module.exports = router;