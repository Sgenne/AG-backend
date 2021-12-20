import { Request, Response } from "express";

import { BlogCategory } from "../../models/blogCategory";
import { BlogPost } from "../../models/blogPost";

export const createBlogCategory = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const title = req.body.title;
  const category = new BlogCategory({
    title: title,
  });

  try {
    await category.save();
  } catch (err) {
    console.log("error in createBlogCategory: ", err);
    const error = new Error("Could not create blog category.");
    res.status(500);
    return next(error);
  }

  res.status(201).json(
    JSON.stringify({
      message: "Blog category created successfully.",
      "created-category": category,
    })
  );
};

export const createBlogPost = async (
  req: Request,
  res: Response,
  next: Function
) => {
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
    const error = new Error("Could not create blog post.");
    res.status(500);
    return next(error);
  }

  res.status(201).json(
    JSON.stringify({
      message: "Blog post created successfully.",
      "created-post": blogPost,
    })
  );
};
