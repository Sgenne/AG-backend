const blogCategory = require("../models/blogCategory");
const BlogPost = require("../models/blogPost");
const Image = require("../models/image");

// get all blog posts
exports.getBlogPosts = async (req, res, next) => {
  let blogPosts;
  try {
    blogPosts = await BlogPost.find();
  } catch (e) {
    const error = new Error("Could not fetch blog posts.");
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json(
    JSON.stringify({
      message: "Blog posts fetched successfully.",
      blogPosts: blogPosts,
    })
  );
};

// get all blog posts from a given category
exports.getBlogPostsByCategory = async (req, res, next) => {
  const category = req.params.category;
  let blogPosts;

  try {
    blogPosts = await BlogPost.find({
      category: { $regex: new RegExp(category, "i")}, // case-insensitive query for posts with given category
    });
  } catch (e) {
    const error = new Error("Could not fetch blog posts.");
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json(
    JSON.stringify({
      message: "Blog posts fetched successfully.",
      blogPosts: blogPosts,
    })
  );
};

// get blog post with a given id
exports.getBlogPost = async (req, res, next) => {
  const blogPostId = req.params.id;
  let blogPost;

  try {
    blogPost = await BlogPost.findById(blogPostId);
  } catch (e) {
    const error = new Error("Could not fetch blog post.");
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json(
    JSON.stringify({
      message: "Blog posts fetched successfully.",
      blogPost: blogPost,
    })
  );
};

// get all blog categories
exports.getCategories = async (req, res, next) => {
  let categories;
  try {
    categories = await blogCategory.find();
  } catch (e) {
    const error = new Error("Could not fetch blog categories.");
    const statusCode = 500;
    return next(error);
  }

  res.status(200).json(
    JSON.stringify({
      message: "Blog categories fetched successfully.",
      categories: categories,
    })
  );
};

