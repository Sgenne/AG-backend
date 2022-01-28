import { BlogPost } from "../../models/blogPost";
import * as db from "../../testSetup/mockDB";

const generateBlogPosts = async () => {
  const numberOfPosts = Math.floor(Math.random() * 100) + 1;

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

beforeEach(async () => await generateBlogPosts());

afterEach(async () => await db.clear());

afterAll(async () => await db.close());

test("test runst", () => {
  expect(1 + 1).toBe(2);
});
