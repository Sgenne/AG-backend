const Image = require("../models/image");
const Category = require("../models/category");

exports.getImages = async (req, res, next) => {
  try {
    const images = await Image.find({});
    res.json(JSON.stringify({
      images: images
    }));
  } catch (err) {
    res.json("error in getImages", error);
    res.status(500).json(JSON.stringify({message: "something went wrong..."}))
  }
};

exports.getImagesByCategory = async (req, res, next) => {


  try {
  } catch (error) {
    
  }
}

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(JSON.stringify({
      message: "Categories fetched succesfully.",
      categories: categories,
    }))
  } catch (error) {
    res.status(500).json(JSON.stringify({
      errorMessage: "An error occured while fetching categories."
    }))
  }

}
