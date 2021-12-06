const fs = require("fs");
const path = require("path");

const multer = require("multer");
const express = require("express");
const sharp = require("sharp");

const Image = require("../models/image");

// loads image to req.file.buffer;
const uploadImage = multer().single("image");

// verifies image, adds compressed version, and stores to file system and database
const handleUploadedImage = async (req, res, next) => {
  try {
    const category = req.body.category;

    if (!req.file) {
      const error = new Error("No image was provided.");
      error.statusCode = 400;
      throw error;
    }

    if (!category) {
      const error = new Error("No category was provided");
      error.statusCode = 400;
      throw error;
    }

    if (
      !(req.file.mimetype === "image/jpg" || req.file.mimetype === "image/jpeg")
    ) {
      const error = new Error("Invalid image format.");
      error.statusCode = 400;
      throw error;
    }

    const compressedImageName = "comp" + req.file.originalname;
    const compressedImagePath = `images/compressed/${compressedImageName}`;

    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpg")
      .toFile(compressedImagePath);

    const imagePath = path.join("images", "gallery", req.file.originalname);

    fs.writeFileSync(
      path.join(path.dirname(require.main.filename), imagePath),
      req.file.buffer
    );

    const image = new Image({
      imageUrl: `${process.env.HOST_NAME}:${process.env.PORT}/${imagePath}}`,
      compressedImageUrl: `${process.env.HOST_NAME}:${process.env.PORT}/${compressedImagePath}`,
      category: category,
    });

    await image.save();

    res
      .status(200)
      .json(JSON.stringify({ message: "Image uploaded successfully." }));
  } catch (error) {
    if (!error.statusCode) {
      console.trace(error);
      error = new Error("Could not upload file.");
      error.statusCode = 500;
    }
    return next(error);
  }
};
const router = express.Router();

router.use(uploadImage, handleUploadedImage);

module.exports = router;
