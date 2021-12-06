const path = require("path");
const fs = require("fs");

const sharp = require("sharp");

const BlogCategory = require("../models/blogCategory");
const ImageCategory = require("../models/imageCategory");
const BlogPost = require("../models/blogPost");
const Image = require("../models/image");

exports.createImageCategory = async (req, res, next) => {
  const categoryTitle = req.body.categoryTitle;

  if (!categoryTitle) {
    const error = new Error("Could not create category.");
    error.statusCode = 400;
    return next(error);
  }

  const category = new ImageCategory({
    title: categoryTitle,
  });

  try {
    await category.save();
  } catch (e) {
    const error = new Error("Invalid category");
    error.statusCode = 400;
    return next(error);
  }
  res.status(201).json({
    message: "Category created successfully.",
    "created-category": category,
  });
};

exports.createBlogCategory = async (req, res, next) => {
  const title = req.body.title;
  const category = new BlogCategory({
    title: title,
  });

  try {
    await category.save();
  } catch (err) {
    console.log("error in createBlogCategory: ", err);
    const error = new Error("Could not create blog category.");
    error.statusCode = 500;
    return next(error);
  }

  res.status(201).json(
    JSON.stringify({
      message: "Blog category created successfully.",
      "created-category": category,
    })
  );
};

exports.createBlogPost = async (req, res, next) => {
  const title = req.body.title;
  const category = req.body.category;
  const content = req.body.content;

  const blogPost = new BlogPost({
    title: title,
    category: category,
    content: content,
  });

  try {
    await blogPost.save();
  } catch (err) {
    console.log("error in createBlogPost: ", err);
    const error = new Error("Could not create blog post.");
    error.statusCode = 500;
    return next(error);
  }

  res.status(201).json(
    JSON.stringify({
      message: "Blog post created successfully.",
      "created-post": blogPost,
    })
  );
};

exports.addScrollingImage = async (req, res, next) => {
  const scrollingImageId = req.body["scrolling-image-id"];

  if (!scrollingImageId) {
    const error = new Error(
      "Please provide the id of the image to add to the scrolling images."
    );
    error.statusCode = 400;
    return next(error);
  }

  const newScrollingImage = new ScrollingImage({
    image: scrollingImageId,
  });

  try {
    await newScrollingImage.save();
  } catch (err) {
    console.trace(err);
    const error = new Error(
      "Something went wrong while adding the new scrolling image."
    );
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({
    message: "Scrolling image added successfully.",
  });
};

exports.deleteScrollingImage = async (req, res, next) => {
  const scrollingImageId = req.body["scrolling-image-id"];

  try {
    if (!scrollingImageId) {
      const error = new Error(
        "Please provide the id of the scrolling image to delete."
      );
      error.statusCode = 400;
      throw error;
    }

    await ScrollingImage.findByIdAndDelete(
      scrollingImageId,
      {},
      (err, found) => {
        if (!found) {
          const error = new Error("No scrolling image with that id exists.");
          error.statusCode = 400;
          throw error;
        }
      }
    );

    res.status(200).json({
      message: "Image deleted successfully.",
    });
  } catch (error) {
    // if error wasn't handled nicely
    if (!error.statusCode) {
      console.trace(error);
      error = new Error("Something went wrong while deleting image.");
      error.statusCode = 500;
    }

    next(error);
  }
};

// verifies an uploaded image, adds compressed version, and stores to file system and database
exports.handleUploadedImage = async (req, res, next) => {
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
      .json(
        JSON.stringify({
          message: "Image uploaded successfully.",
          image: image,
        })
      );
  } catch (error) {
    if (!error.statusCode) {
      console.trace(error);
      error = new Error("Could not upload file.");
      error.statusCode = 500;
    }
    return next(error);
  }
};
