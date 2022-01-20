import { Schema, Document, model, Types } from "mongoose";
import { IImage } from "./image";

export interface IImageCategory {
  title: string;
  previewImage: Types.ObjectId | IImage;
}

export interface IImageCategoryDocument extends IImageCategory, Document { }

const ImageCategorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  previewImage: {
    type: Types.ObjectId,
    ref: "Image",
    required: false,
  },
});

export const ImageCategory = model<IImageCategory>(
  "ImageCategory",
  ImageCategorySchema
);
