import { Schema, Types, model, Document } from "mongoose";
import { IImage } from "./image";

export interface IScrollingImage {
  image: Types.ObjectId | IImage;
}

export interface IScrollingImageDocument extends IScrollingImage, Document {}

const scrollingImageSchema = new Schema({
  // The image which will be shown.
  image: {
    type: Types.ObjectId,
    ref: "Image",
    required: true,
    unique: true,
  },
  // The order of appearance.
  order: {
    type: Number,
    required: true,
    unique: true,
  },
});

export const ScrollingImage = model<IScrollingImage>(
  "ScrollingImage",
  scrollingImageSchema
);
