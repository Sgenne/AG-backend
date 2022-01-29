import { Schema, model, Document } from "mongoose";
import path from "path";
import fs from "fs";
import { IImage } from "../interfaces/image.interface";

export interface IImageDocument extends IImage, Document {}

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

export const Image = model<IImageDocument>("Image", imageSchema);
