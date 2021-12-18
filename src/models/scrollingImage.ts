import { Schema, Types, model } from "mongoose";
import { IImage } from "./image";

interface IScrollingImage {
  image: Types.ObjectId | IImage;
}

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
