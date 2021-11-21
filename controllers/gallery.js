const Image = require("../models/image");
const Category = require("../models/category");

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

  try {
    const categoryImages = await Image.find({
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
  try {
    const categories = await Category.find();
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
