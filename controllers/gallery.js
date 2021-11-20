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
    res.json("error in getImages", error);
    res
      .status(500)
      .json(JSON.stringify({ message: "something went wrong..." }));
  }
};

exports.getImagesByCategory = async (req, res, next) => {
  const category = req.params.category;

  try {
    const categoryImages = await Image.find({
      category: "animals",
    });
    console.log("fetched images: ", categoryImages);
    res.status(200).json(
      JSON.stringify({
        message: "Successfully fetched images.",
        images: categoryImages,
      })
    );
  } catch (error) {
    res.status(500).json(
      JSON.stringify({
        errorMessage: "Could not fetch images.",
      })
    );
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(
      JSON.stringify({
        message: "Categories fetched successfully.",
        categories: categories,
      })
    );
  } catch (error) {
    res.status(500).json(
      JSON.stringify({
        errorMessage: "An error occurred while fetching categories.",
      })
    );
  }
};
