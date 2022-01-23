import { Request, Response } from "express";

import { BlogPost, IBlogPost } from "../../models/blogPost";

export const createPost = async (req: Request, res: Response) => {
  const title = req.body.title;
  const content = req.body.content;

  const blogPost = new BlogPost({
    title: title,
    content: content,
  });

  try {
    await blogPost.save();
  } catch (err) {
    return res.status(500).json({ message: "Could not create blog post." });
  }

  res.status(201).json({
    message: "Blog post created successfully.",
    "created-post": blogPost,
  });
};

export const deletePost = async (req: Request, res: Response) => {
  const postId: string = req.body.postId;
  let post: IBlogPost | null;

  try {
    post = await BlogPost.findByIdAndDelete(postId);
  } catch (err) {
    return res.status(500).json({
      message:
        "Something went wrong while fetching the post from the database.",
    });
  }

  if (!post) {
    return res
      .status(404)
      .json({ message: "No blog post with the given post-id was found." });
  }

  res.status(200).json({
    message: "The blog post was deleted succesfully.",
  });
};
