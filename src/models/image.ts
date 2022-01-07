import { Schema, model, Document } from "mongoose";

export interface IImage {
  imageUrl: string;
  compressedImageUrl: string;
  category: string;
  relativeImagePath: string;
  relativeCompressedImagePath: string;
}

export interface IImageDocument extends IImage, Document {}

const imageSchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      unique: true,
    },
    compressedImageUrl: {
      type: String,
      required: true,
      unique: true,
    },
    relativeImagePath: {
      type: String,
      required: true,
      unique: true,
    },
    relativeCompressedImagePath: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Image = model<IImage>("Image", imageSchema);
