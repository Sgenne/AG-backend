import { Request, Response } from "express";

import { BlogPost } from "../../models/blogPost";

export const createBlogPost = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const title = req.body.title;
  const content = req.body.content;

  const blogPost = new BlogPost({
    title: title,
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
