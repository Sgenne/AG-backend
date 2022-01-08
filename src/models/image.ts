import { Schema, model, Document } from "mongoose";
import path from "path";
import fs from "fs";

export interface IImage {
  imageUrl: string;
  compressedImageUrl: string;
  category: string;
  relativeImagePath: string;
  relativeCompressedImagePath: string;
  unlink: () => Promise<[void, void]>;
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

// Delete image and compressed image from file system.
imageSchema.methods.unlink = function () {
  return Promise.all([
    fs.promises.unlink(path.join(this.relativeImagePath)),
    fs.promises.unlink(path.join(this.relativeCompressedImagePath)),
  ]);
};

export const Image = model<IImage>("Image", imageSchema);
