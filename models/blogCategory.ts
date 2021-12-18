import { Schema, model } from "mongoose";

interface IBlogCategory {
  title: string;
}

const blogCategorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
});

export const BlogCategory = model<IBlogCategory>(
  "BlogCategory",
  blogCategorySchema
);
