import { Request, Response, NextFunction } from "express";

import { BlogPost, IBlogPost } from "../../models/blogPost";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
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

  res.status(201).json({
    message: "Blog post created successfully.",
    "created-post": blogPost,
  });
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId: string = req.body.postId;
  let post: IBlogPost | null;

  try {
    post = await BlogPost.findByIdAndDelete(postId);
  } catch (err) {
    const error = new Error(
      "Something went wrong while fetching the post from the database."
    );
    res.status(500);
    return next(error);
  }

  if (!post) {
    const error = new Error("No blog post with the given post-id was found.");
    res.status(404);
    return next(error);
  }

  res.status(200).json({
    message: "The blog post was deleted succesfully.",
  });
};
