const Category = require("../models/category");

exports.createCategory = async (req, res, next) => {
  try {
    const categoryTitle = req.body.categoryTitle;

    if (!categoryTitle) {
      const error = new Error("Could not create category.");
      error.statusCode = 400;
      throw error;
    }

    const category = new Category({
      title: categoryTitle,
    });

    try {
      await category.save();
    } catch (e) {
      const error = new Error("Invalid category");
      error.statusCode = 400;
      throw error;
    }
    res.status(201).json({
      message: "Category created succesfully!",
    });
  } catch (error) {
    res.status(400).json(
      JSON.stringify({
        message: error.message,
      })
    );
  }
};
