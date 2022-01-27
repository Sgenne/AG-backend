import { Schema, model, Document } from "mongoose";
import path from "path";
import fs from "fs";
import { IImage } from "../interfaces/image.interface";

export interface IImageDocument extends IImage, Document {
  unlink: () => Promise<[void, void]>;
}

const imageSchema = new Schema(
  {
    filename: {
      required: true,
      type: String,
      unique: true,
    },
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
// %%%%%    Should be in service.    %%%%%%
imageSchema.methods.unlink = function () {
  return Promise.all([
    fs.promises.unlink(path.join(this.relativeImagePath)),
    fs.promises.unlink(path.join(this.relativeCompressedImagePath)),
  ]);
};

export const Image = model<IImageDocument>("Image", imageSchema);
