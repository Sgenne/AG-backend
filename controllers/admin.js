const Category = require("../models/category");

exports.createCategory = async (req, res, next) => {
  const categoryTitle = req.body.categoryTitle;

  if (!categoryTitle) {
    const error = new Error("Could not create category.");
    error.statusCode = 400;
    return next(error);
  }

  const category = new Category({
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
    message: "Category created successfully!",
  });
};
