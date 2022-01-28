import { Schema, model } from "mongoose";

import { IBlogPost } from "../interfaces/blogPost.interface";

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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export const BlogPost = model<IBlogPost>("BlogPost", blogPostSchema);
