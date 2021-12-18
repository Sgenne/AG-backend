import { Response, Request } from "express";

import { BlogCategory } from "../models/blogCategory";
import { BlogPost } from "../models/blogPost";

// get latest blog posts
exports.getBlogPosts = async (req: Request, res: Response, next: Function) => {
  // will contain all months in which there are posts
  const availableMonths: number[] = [];

  let blogPosts;
  try {
    blogPosts = await BlogPost.find();
  } catch (e) {
    const error = new Error("Could not fetch blog posts.");
    res.status(500);
    return next(error);
  }

  // iterate over blogPosts and collect all months
  blogPosts.forEach((post) => {
    const month = new Date(post.createdAt).getMonth();

    if (!availableMonths.includes(month)) {
      availableMonths.push(month);
    }
  });

  // number of posts to return (returns all if none has been specified)
  let numberOfPosts = req.query["numberOfPosts"] || blogPosts.length;

  // check if provided value is a not a number
  if (isNaN(+numberOfPosts)) {
    numberOfPosts = blogPosts.length;
  }

  // limits number of returned posts if numberOfPosts has been set
  if (numberOfPosts) {
    blogPosts = blogPosts.slice(0, numberOfPosts as number); // can safely cast because of previous check
  }

  res.status(200).json(
    JSON.stringify({
      message: "Blog posts fetched successfully.",
      blogPosts: blogPosts,
    })
  );
};

// get all blog posts from a given category
exports.getBlogPostsByCategory = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const category = req.params.category;
  let blogPosts;

  try {
    blogPosts = await BlogPost.find({
      category: { $regex: new RegExp(category, "i") }, // case-insensitive query for posts with given category
    });
  } catch (e) {
    const error = new Error("Could not fetch blog posts.");
    res.status(500);
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
exports.getBlogPost = async (req: Request, res: Response, next: Function) => {
  const blogPostId = req.params.id;
  let blogPost;

  try {
    blogPost = await BlogPost.findById(blogPostId);
  } catch (e) {
    const error = new Error("Could not fetch blog post.");
    res.status(500);
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
exports.getCategories = async (req: Request, res: Response, next: Function) => {
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
