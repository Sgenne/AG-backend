import { Schema, Types, model, Document } from "mongoose";
import { IImage } from "./image";

export interface IScrollingImage {
  image: Types.ObjectId | IImage;
}

export interface IScrollingImageDocument extends IScrollingImage, Document {}

const scrollingImageSchema = new Schema({
  image: {
    type: Types.ObjectId,
    ref: "Image",
    required: true,
  },
});

export const ScrollingImage = model<IScrollingImage>(
  "ScrollingImage",
  scrollingImageSchema
);
