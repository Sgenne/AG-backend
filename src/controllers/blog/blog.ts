import { Response, Request } from "express";

import * as blogPostServices from "../../services/blogPost.service";

export const getBlogPosts = async (req: Request, res: Response) => {
  const latestDateParam = req.query["latestDate"];
  const numberOfPostsParam = req.query["numberOfPosts"];
  let latestDate: Date | undefined;
  let numberOfPosts: number | undefined;

  // Validate numberOfPostsParam if provided.
  if (numberOfPostsParam) {
    if (isNaN(+numberOfPostsParam)) {
      return res.status(400).json({
        message: "The provided number of posts to load was invalid.",
      });
    }
    numberOfPosts = +numberOfPostsParam;
  }

  // Validate latestDateParam if provided.
  if (latestDateParam) {
    if (
      typeof latestDateParam !== "string" ||
      isNaN(Date.parse(latestDateParam))
    ) {
      return res
        .status(400)
        .json({ message: "The provided latest date was invalid." });
    }

    latestDate = new Date(latestDateParam);
  }

  const { success, blogPosts, availableMonths } =
    await blogPostServices.getBlogPosts(latestDate, numberOfPosts);

  if (!success) {
    return res.status(500).json({
      message: "The blog posts could not be fetched from the database.",
    });
  }

  res.status(200).json({
    message: "Blog posts fetched successfully.",
    blogPosts: blogPosts,
    availableMonths: availableMonths,
  });
};

export const getBlogPostsByMonth = async (req: Request, res: Response) => {
  const month: number = +req.params.month;
  const year: number = +req.params.year;

  // check if given month is valid
  if (isNaN(month) || month < 0 || month >= 12) {
    return res.status(400).json({
      message:
        "An invalid month was given. The month should be a number between 0 (inclusive) and 12 (exclusive).",
    });
  }

  const { blogPosts, availableMonths, success } =
    await blogPostServices.getBlogPostsByMonth(month, year);

  if (!success) {
    return res
      .status(500)
      .json({ message: "Could not fetch blog posts from database." });
  }

  res.status(200).json({
    message: "Blog posts fetched succesfully.",
    blogPosts: blogPosts,
    availableMonths: availableMonths,
  });
};

export const getBlogPostById = async (req: Request, res: Response) => {
  const postId: string = req.params.postId;

  const { success, blogPost } = await blogPostServices.getBlogPostById(postId);

  if (!success) {
    return res
      .status(500)
      .json({ message: "Could not fetch blog post from backend." });
  }

  if (!blogPost) {
    return res
      .status(404)
      .json({ message: "No blog post with the given id was found." });
  }

  res.status(200).json({
    message: "Blog post fetched successfully.",
    blogPost: blogPost,
  });
};
