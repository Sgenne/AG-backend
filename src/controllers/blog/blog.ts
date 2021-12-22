import { Response, Request } from "express";

import { BlogPost, IBlogPost } from "../../models/blogPost";

interface MonthAndYear {
  month: number;
  year: number;
}

const _fetchBlogPosts = async (): Promise<{
  availableMonths: MonthAndYear[];
  blogPosts: IBlogPost[];
}> => {
  // will contain all months in which there are posts
  const availableMonths: any = {};

  let blogPosts: IBlogPost[] | null;
  try {
    blogPosts = await BlogPost.find().sort("-createdAt");
  } catch (e) {
    throw new Error("Could not fetch blog posts from database.");
  }

  // iterate over blogPosts and collect all months
  blogPosts.forEach((post) => {
    const month = post.createdAt.getMonth();
    const year = post.createdAt.getFullYear();

    availableMonths[-year-month] = {
      month: month,
      year: year,
    };
  });

  const availableMonthsList = Object.values(availableMonths) as MonthAndYear[];

  return {
    availableMonths: availableMonthsList,
    blogPosts: blogPosts,
  };
};

// get latest blog posts
export const getBlogPosts = async (
  req: Request,
  res: Response,
  next: Function
) => {
  let blogPosts: IBlogPost[];
  let availableMonths: MonthAndYear[];

  try {
    const result = await _fetchBlogPosts();
    blogPosts = result.blogPosts;
    availableMonths = result.availableMonths;
  } catch (error) {
    res.status(500);
    return next(error);
  }

  // number of posts to return (returns all if none has been specified)
  let numberOfPosts = req.query["numberOfPosts"] || blogPosts.length;

  // check if provided value is a not a number
  if (isNaN(+numberOfPosts)) {
    numberOfPosts = blogPosts.length;
  }

  // limits number of returned posts if numberOfPosts has been set
  blogPosts = blogPosts.slice(0, numberOfPosts as number); // can safely cast because of previous check

  res.status(200).json(
    JSON.stringify({
      message: "Blog posts fetched successfully.",
      blogPosts: blogPosts,
      availableMonths: availableMonths,
    })
  );
};

// returns all blog posts from the specified month
export const getBlogPostsByMonth = async (
  req: Request,
  res: Response,
  next: Function
) => {
  let blogPosts: IBlogPost[];
  let avaialbleMonts: MonthAndYear[];

  const month: number = +req.params.month;

  // check if given month is valid
  if (isNaN(month) || month < 0 || month >= 12) {
    const error = new Error(
      "An invalid month was given. The month should be a number between 0 (inclusive) and 12 (exclusive)."
    );
    res.status(400);
    return next(error);
  }

  try {
    const result = await _fetchBlogPosts();
    blogPosts = result.blogPosts;
    avaialbleMonts = result.availableMonths;
  } catch (error) {
    res.status(500);
    return next(error);
  }

  // remove posts that are not from the specified month
  blogPosts = blogPosts.filter((post) => post.createdAt.getMonth() === month);

  res.status(200).json({
    message: "Blog posts fetched succesfully.",
    blogPosts: blogPosts,
    availableMonths: avaialbleMonts,
  });
};
