const multer = require("multer");
const express = require("express");

const Image = require("../models/image");

/*
TODO
======

* Create router
  * Chains uploadImage with updateDB
* updateDB should create new image model instance and upload to mongo.
  * throws error if no image was uploaded.
*/


const _storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "images/"),
  filename: (req, file, cb) => cb(null, Math.random().toFixed(4) + file.originalname),
});

const _fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    console.log("filter accept")
    cb(null, true);
  } else {
    console.log("filter fail")
    cb(null, false);
  }
};

const _uploadImage = multer({ storage: _storage, fileFilter: _fileFilter }).single(
  "image"
);

const _updateDB = async (req, res, next) => {
  console.log("req.body in _updateDB", req.body)
 try {
  if (!req.file) {
    const error = new Error("No file was uploaded.")
    throw error;
  }

  const title = req.file.filename; 
  const imageUrl = `localhost:8080/bilder/${req.file.filename}`;
  const description = req.body.description;
  const category = req.body.category;

  const image = new Image({
    title: title,
    imageUrl: imageUrl,
    description: description,
    category: category,
  })

  await image.save();
  res.json(JSON.stringify({
    message: "success!",
    image: image
  }))
 } catch(error) {
   console.log("error in _updateDB: ", error);
    res.status(400).json({
      message: "Error uploading image"
    })
 }
}

const router = express.Router();

router.use(_uploadImage, _updateDB);

module.exports = router;
