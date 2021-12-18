import { Schema, model } from "mongoose";

interface IBlogPost {
  title: string;
  content: string;
}

const blogPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const BlogPost = model<IBlogPost>("BlogPost", blogPostSchema);
