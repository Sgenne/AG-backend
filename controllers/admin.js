const BlogCategory = require("../models/blogCategory");
const ImageCategory = require("../models/imageCategory");
const BlogPost = require("../models/blogPost");

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
