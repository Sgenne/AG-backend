const Image = require("../models/image");
const ImageCategory = require("../models/imageCategory");
const scrollingImage = require("../models/scrollingImage");
const ScrollingImage = require("../models/scrollingImage");

exports.getImages = async (req, res, next) => {
  try {
    const images = await Image.find();
    res.json(
      JSON.stringify({
        message: "Successfully fetched images.",
        images: images,
      })
    );
  } catch (err) {
    const error = new Error("Something went wrong while fetching images.");
    error.statusCode = 500;
    return next(error);
  }
};

exports.getImagesByCategory = async (req, res, next) => {
  const category = req.params.category;
  let categoryImages;
  try {
    categoryImages = await Image.find({
      category: category,
    });
  } catch (err) {
    const error = new Error("Something went wrong while fetching images.");
    error.statusCode = 500;
    return next(error);
  }
  res.status(200).json(
    JSON.stringify({
      message: "Successfully fetched images.",
      images: categoryImages,
    })
  );
};

exports.getCategories = async (req, res, next) => {
  let categories;
  try {
    categories = await ImageCategory.find().populate("previewImage");
  } catch (err) {
    const error = new Error("Something went wrong while fetching categories.");
    error.statusCode = 500;
    return next(error);
  }
  res.status(200).json(
    JSON.stringify({
      message: "Categories fetched successfully.",
      categories: categories,
    })
  );
};

exports.getScrollingImages = async (req, res, next) => {
  try {
    const scrollingImages = await ScrollingImage.find().populate("image");
    res.status(200).json(
      JSON.stringify({
        message: "Successfully fetched scrolling images.",
        scrollingImages: scrollingImages,
      })
    );
  } catch (error) {
    if (!error.statusCode) {
      error = new Error("Could not fetch scrolling images.");
      error.statusCode = 500;
    }
    return next(error);
  }
};
