import { IBlogPost } from "../../interfaces/blogPost.interface";
import { BlogPost } from "../../models/blogPost";
import * as db from "../../tests/mockDB";
import { getBlogPosts } from "../blogPost.service";

const generateBlogPosts = async () => {
  const numberOfPosts = 4; //Math.floor(Math.random() * 100) + 1;

  for (let i = 0; i < numberOfPosts; i++) {
    const month = Math.floor(Math.random() * 12);
    const year = Math.floor(Math.random() * 10) + 2010;
    const day = Math.floor(Math.random() * 31) + 1;
    const createdAt = new Date(year, month, day);

    const title = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substring(0, 5);
    const content = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "");

    const blogPost = new BlogPost({
      title: title,
      content: content,
      createdAt: createdAt,
    });
    await blogPost.save();
  }
};

beforeAll(async () => await db.connect());

afterEach(async () => await db.clear());

afterAll(async () => await db.close());

describe("getBlogPosts", () => {
  it("returns two empty lists if no blog posts exist.", async () => {
    const { success, blogPosts, availableMonths } = await getBlogPosts();

    expect(success).toBe(true);
    expect(blogPosts).toBeTruthy();
    expect(availableMonths).toBeTruthy();
    if (!(blogPosts && availableMonths)) return;

    expect(blogPosts).toHaveLength(0);
    expect(availableMonths).toHaveLength(0);
  });

  it("returns availableMonths without duplicates.", async () => {
    await generateBlogPosts();
    const { availableMonths } = await getBlogPosts();
    if (!availableMonths) throw new Error();

    const uniqueElements: { month: number; year: number }[] = [];
    availableMonths.forEach((obj) => {
      if (
        !uniqueElements.some(
          (unq) => unq.month === obj.month && unq.year === obj.year
        )
      ) {
        uniqueElements.push(obj);
      }
    });
    expect(uniqueElements.length === availableMonths.length).toBe(true);
  });

  it("returns blogPosts with as many elements as there are posts in db.", async () => {
    await generateBlogPosts();
    const { blogPosts } = await getBlogPosts();
    if (!blogPosts) throw new Error();

    const posts: IBlogPost[] = await BlogPost.find();

    expect(posts.length === blogPosts.length).toBe(true);
  });

  it("returns availableMonths with the months of all blog posts included.", async () => {
    await generateBlogPosts();
    const { blogPosts, availableMonths } = await getBlogPosts();
    if (!(blogPosts && availableMonths)) throw new Error();

    blogPosts.forEach((post) => {
      if (
        !availableMonths.some(
          (avm) =>
            avm.month === post.createdAt.getMonth() &&
            avm.year === post.createdAt.getFullYear()
        )
      ) {
        console.log(blogPosts);
        console.log(post.createdAt);
        console.log("month: ", post.createdAt.getMonth());
        console.log("year: ", post.createdAt.getFullYear());
        console.log(availableMonths);
        throw new Error();
      }
    });

    return true;
  });
});
