import { IBlogPost } from "../interfaces/blogPost.interface";
import { BlogPost } from "../models/blogPost";

interface MonthAndYear {
  month: number;
  year: number;
}

const fetchBlogPosts = async () => {
  let blogPosts: IBlogPost[] | null;
  try {
    blogPosts = await BlogPost.find().sort("-createdAt");
  } catch (e) {
    throw new Error("Could not fetch blog posts from database.");
  }

  return blogPosts;
};

const getAvailableMonths = (blogPosts: IBlogPost[]) => {
  const availableMonths: { [key: number]: MonthAndYear } = {};

  // iterate over blogPosts and collect all months
  blogPosts.forEach((post) => {
    const month = post.createdAt.getMonth();
    const year = post.createdAt.getFullYear();

    availableMonths[-year - month] = {
      month: month,
      year: year,
    };
  });

  const availableMonthsList = Object.values(availableMonths) as MonthAndYear[];

  return availableMonthsList;
};

/**
 * Returns the latest blog posts.
 *
 * @param latestDate Specifies the latest allowed date of the returned posts
 *                   All returned posts will have been posted before this date.
 *                   If latestDate is omitted, then the latest uploaded posts will
 *                   be included.
 *
 * @param numberOfPosts The number of posts that will be returned.
 *
 * @returns The posts that fulfill the criteria specified by latestDate and numberOfPosts.
 */
export const getBlogPosts = async (
  latestDate?: Date,
  numberOfPosts?: number
): Promise<{
  success: boolean;
  status?: string;
  message?: string;
  blogPosts?: IBlogPost[];
  availableMonths?: MonthAndYear[];
}> => {
  let blogPosts: IBlogPost[];
  let availableMonths: { month: number; year: number }[];

  try {
    blogPosts = await fetchBlogPosts();
  } catch (error) {
    const message = error instanceof Error ? error.message : "code go boom";
    return { success: false, message: message };
  }

  availableMonths = getAvailableMonths(blogPosts);

  // If latest date was provided, remove posts from after the specified date.
  if (latestDate) {
    const latestDateNumber: number = latestDate.getTime();

    blogPosts = blogPosts.filter((post) => {
      const postTime = post.createdAt.getTime();

      return postTime < latestDateNumber;
    });
  }

  // Limits number of returned posts if numberOfPosts has been set.
  // Returns all posts otherwise.
  blogPosts = numberOfPosts ? blogPosts.slice(0, numberOfPosts) : blogPosts;

  return {
    success: true,
    blogPosts: blogPosts,
    availableMonths: availableMonths,
  };
};

/**
 *
 * Returns all blog posts from a specified month.
 *
 * @param month number in [0, 11].
 * @param year The year of the specified month.
 */
export const getBlogPostsByMonth = async (
  month: number,
  year: number
): Promise<{
  success: boolean;
  message?: string;
  blogPosts?: IBlogPost[];
  availableMonths?: MonthAndYear[];
}> => {
  let blogPosts: IBlogPost[];

  try {
    blogPosts = await fetchBlogPosts();
  } catch (error) {
    const message = error instanceof Error ? error.message : "code go boom";
    return {
      success: false,
      message: message,
    };
  }

  const availableMonths: MonthAndYear[] = getAvailableMonths(blogPosts);

  // remove posts that are not from the specified month and year
  blogPosts = blogPosts.filter(
    (post) =>
      post.createdAt.getMonth() === month &&
      post.createdAt.getFullYear() === year
  );

  return {
    success: true,
    blogPosts: blogPosts,
    availableMonths: availableMonths,
  };
};

/**
 *
 * Returns the blog post with the given id if one exists.
 *
 * @param postId The id of the blog post to return.
 */
export const getBlogPostById = async (
  postId: string
): Promise<{ success: boolean; message?: string; blogPost?: IBlogPost }> => {
  let post: IBlogPost | null;

  try {
    post = await BlogPost.findById(postId);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Code go boom when fetch post by id";
    return {
      success: false,
      message: message,
    };
  }

  if (!post) {
    return { success: true };
  }

  return { success: true, blogPost: post };
};
