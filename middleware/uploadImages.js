const multer = require("multer");
const express = require("express");
const sharp = require("sharp");

const Image = require("../models/image");

const _storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "images/"),
  filename: (req, file, cb) =>
    cb(null, Math.random().toFixed(4) + file.originalname),
});

const _fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const _uploadImage = multer({
  storage: _storage,
  fileFilter: _fileFilter,
}).single("image");

const _updateDB = async (req, res, next) => {
  if (!req.body.category) {
    const error = new Error("No image category was given."); // should also delete image
    error.statusCode = 400;
    return next(error);
  }
  if (!req.file) {
    const error = new Error("No file was uploaded.");
    error.statusCode = 400;
    return next(error);
  }

  const title = req.file.filename;
  const imageUrl = `localhost:8080/images/${req.file.filename}`;
  const description = req.body.description;
  const category = req.body.category;

  const image = new Image({
    title: title,
    imageUrl: imageUrl,
    description: description,
    category: category,
  });

  try {
    await image.save();
  } catch (err) {
    const error = new Error("Error while updating database.");
    error.statusCode = 500;
    return next(error);
  }
  
  res.json(
    JSON.stringify({
      message: "Image uploaded successfully!",
      image: image,
    })
  );
};

const router = express.Router();

router.use(_uploadImage, _updateDB);

module.exports = router;
